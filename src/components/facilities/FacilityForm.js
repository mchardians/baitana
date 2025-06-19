"use client"

import {useCallback, useEffect, useState} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addFacilitySchema, editFacilitySchema  } from "@/schemas/facility-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, ImageOff, Trash2 } from "lucide-react"
import { ModalForm } from "@/components/ModalForm";
import { showMultipleErrorToasts } from "@/utlis/toast-error-handle";
import { toast } from "sonner"

function toTitleCase(str) {
    if (!str) return '';
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function FacilityForm({
    isModalOpen,
    setIsModalOpen,
    selectedFacility,
    handleAddFacility,
    handleEditFacility,
    isLoading
}) {
    const isEditMode = !!selectedFacility

    const [selectedCoverFile, setSelectedCoverFile] = useState(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);

    const [newPreviewFiles, setNewPreviewFiles] = useState([]);
    const [existingPreviewImages, setExistingPreviewImages] = useState([]);
    const [removedPreviewIds, setRemovedPreviewIds] = useState([]);

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(isEditMode ? editFacilitySchema : addFacilitySchema),
        defaultValues: {
            name: "",
            description: "",
            capacity: 0,
            price_per_hour: 0,
            status: "available",
        },
    })

    const {
        formState: { errors },
        setFocus,
        setValue,
        watch,
    } = form;

    const currentStatus = watch("status");

    const handleDisplayError = useCallback((currentError) => {
        if (!currentError) return; // Pastikan ada error object

        let messageForAlertDialog = "Terjadi kesalahan. Silakan coba lagi.";

        if (currentError.message) {
            messageForAlertDialog = currentError.message;
        }

        setErrorMessage(messageForAlertDialog);
        setErrorDialogOpen(true);

        if (currentError.errors) {
            if (typeof currentError.errors === 'object' && Object.keys(currentError.errors).length > 0) {
                const firstErrorField = Object.keys(currentError.errors)[0];
                if (firstErrorField) {
                    setTimeout(() => {
                        setFocus(firstErrorField);
                    }, 100);
                }

                Object.entries(currentError.errors).forEach(([field, messages]) => {
                    const messageText = Array.isArray(messages) ? messages.join(", ") : messages;
                    toast.error(`${toTitleCase(field)}: ${messageText}`, {
                        duration: 4000,
                        position: "top-right",
                        id: `error-${field}-${Date.now()}`,
                        dismissible: true
                    });
                });
            } else if (typeof currentError.errors === 'string') {
                toast.error(currentError.errors, {
                    duration: 4000,
                    position: "top-right",
                    id: `error-global-${Date.now()}`,
                    dismissible: true
                });
            }
        }
    }, [setFocus]);

    useEffect(() => {
        if (isModalOpen) {
            form.reset({
                name: selectedFacility?.name || "",
                description: selectedFacility?.description || "",
                capacity: selectedFacility?.capacity || 0,
                price_per_hour: selectedFacility?.price_per_hour || 0,
                status: selectedFacility?.status || "available",
            });

            if (selectedFacility?.cover_image) {
                setCoverPreviewUrl(selectedFacility.cover_image);
            } else {
                setCoverPreviewUrl(null);
            }
            setSelectedCoverFile(null);

            if (Array.isArray(selectedFacility?.image_previews) && selectedFacility.image_previews.length > 0) {
                setExistingPreviewImages(selectedFacility.image_previews);
            } else {
                setExistingPreviewImages([]);
            }
            setNewPreviewFiles([]);
            setRemovedPreviewIds([]);

        } else {
            form.reset({
                name: "",
                description: "",
                capacity: 0,
                price_per_hour: 0,
                status: "available",
            });
            setSelectedCoverFile(null);
            setCoverPreviewUrl(null);
            setNewPreviewFiles([]);
            setExistingPreviewImages([]);
            setRemovedPreviewIds([]);
        }
    }, [isModalOpen, selectedFacility, form]);

    const handleCoverFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedCoverFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreviewUrl(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverFile = () => {
        setSelectedCoverFile(null);
        if (isEditMode && selectedFacility?.cover_image) {
            setCoverPreviewUrl(selectedFacility.cover_image);
        } else {
            setCoverPreviewUrl(null);
        }
    };

    // Handle new preview images selection
    const handleNewPreviewFilesSelect = (event) => {
        const files = Array.from(event.target.files);
        setNewPreviewFiles(prev => [...prev, ...files]);
    };

    // Remove a new preview file (before upload)
    const removeNewPreviewFile = (indexToRemove) => {
        setNewPreviewFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Mark an existing preview image for removal
    const toggleRemoveExistingPreview = (id) => {
        setRemovedPreviewIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name || "");
            formData.append("description", values.description || "");
            formData.append("capacity", values.capacity || 0);
            formData.append("price_per_hour", values.price_per_hour || 0);
            formData.append("status", values.status || "available");

            if (selectedCoverFile) {
                formData.append("cover_image", selectedCoverFile);
            } else if (isEditMode && !coverPreviewUrl) {
                formData.append("cover_image", "");
            }

            // Append new preview files
            newPreviewFiles.forEach((file, index) => {
                formData.append(`facility_previews[${index}]`, file);
            });

            // Append IDs of preview images to be removed
            if (removedPreviewIds.length > 0) {
                removedPreviewIds.forEach((id, index) => {
                    formData.append(`remove_facility_preview_id[${index}]`, id);
                });
            }

            if (isEditMode) {
                await handleEditFacility(formData);
            } else {
                await handleAddFacility(formData);
            }

            form.reset();
            setSelectedCoverFile(null);
            setCoverPreviewUrl(null);
            setNewPreviewFiles([]);
            setExistingPreviewImages([]);
            setRemovedPreviewIds([]);
            setIsModalOpen(false);
        } catch (error) {
            handleDisplayError(error);
        }
    };

    const onInvalidSubmit = (errors) => {
        const fieldLabels = {
            name: "Nama Fasilitas",
            description: "Deskripsi",
            capacity: "Kapasitas",
            price_per_hour: "Harga Per Jam",
            status: "Status",
            cover_image: "Gambar Utama Fasilitas",
            facility_previews: "Gambar Detail Fasilitas",
            remove_facility_preview_id: "Hapus Gambar Detail Fasilitas",
        };
        showMultipleErrorToasts(errors, fieldLabels);
    };

    return (
        <>
            <ModalForm
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={isEditMode ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
                description={isEditMode ? "Ubah informasi fasilitas yang sudah ada." : "Buat fasilitas baru untuk sistem."}
                onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
                isLoading={isLoading}
                submitLabel={isEditMode ? "Update" : "Simpan"}
                size="2xl" // Sesuaikan ukuran modal untuk layout kiri-kanan
            >
                <Form {...form}>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-row gap-x-8">
                            {/* Kolom Kiri: Detail Fasilitas (Text Inputs) */}
                            <div className="w-full md:w-1/2 flex flex-col space-y-4">
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Nama Fasilitas</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan nama fasilitas" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description Field */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Deskripsi</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan deskripsi fasilitas" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Capacity Field */}
                                <FormField
                                    control={form.control}
                                    name="capacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Kapasitas</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan kapasitas"
                                                    disabled={isLoading}
                                                    className="h-10"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value;

                                                        if (rawValue === "" || /^[1-9]\d*$/.test(rawValue)) {
                                                            field.onChange(rawValue);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Price Per Hour Field */}
                                <FormField
                                    control={form.control}
                                    name="price_per_hour"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Harga Per Jam</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan harga per jam"
                                                    disabled={isLoading}
                                                    className="h-10"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value;

                                                        // Izinkan string kosong atau angka tanpa awalan 0
                                                        if (rawValue === "" || /^[1-9]\d*$/.test(rawValue)) {
                                                            field.onChange(rawValue);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Status Field */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                                                    <SelectItem value="available">
                                                        <div className="flex justify-center items-center space-x-2">
                                                            <span className="font-medium">Tersedia</span>
                                                            <span className="text-muted-foreground">(Available)</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="maintenance">
                                                        <div className="flex justify-center items-center space-x-2">
                                                            <span className="font-medium">Perawatan</span>
                                                            <span className="text-muted-foreground">(Maintenance)</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="unavailable">
                                                        <div className="flex justify-center items-center space-x-2">
                                                            <span className="font-medium">Tidak Tersedia</span>
                                                            <span className="text-muted-foreground">(Unavailable)</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Kolom Kanan: Pengelolaan Gambar */}
                            <div className="w-full md:w-1/2 flex flex-col space-y-6">
                                {/* Gambar Utama Fasilitas (Cover Image) */}
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">Gambar Utama Fasilitas</h4>
                                    <div className="py-4 w-full flex justify-center">
                                        <div className="relative w-full max-w-sm h-[200px] md:h-[270px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                            {coverPreviewUrl ? (
                                                <Image
                                                    src={coverPreviewUrl}
                                                    alt="Cover Preview"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                                    <ImageOff className="h-12 w-12 mb-4" />
                                                    <p className="text-center">Tidak ada gambar utama.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center space-y-2">
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById("cover-upload")?.click()}
                                                className="h-8"
                                            >
                                                <Upload className="h-3.5 w-3.5 mr-1" />
                                                {selectedCoverFile || (isEditMode && selectedFacility?.cover_image) ? "Ganti Gambar" : "Upload Gambar"}
                                            </Button>

                                            {(selectedCoverFile || (isEditMode && selectedFacility?.cover_image)) && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={removeCoverFile}
                                                    className="h-8 text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, JPEG, WEBP. Maksimal 2MB.</p>
                                    </div>
                                    <input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleCoverFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">Gambar Detail Fasilitas</h4>
                            <div className="max-h-[30vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 rounded-lg">
                                <div className="flex flex-wrap justify-center gap-4">
                                    {/* Existing Preview Images */}
                                    {existingPreviewImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`relative w-24 h-24 rounded-lg shadow-sm border ${removedPreviewIds.includes(img.id) ? 'border-red-500 opacity-50' : 'border-gray-200 dark:border-gray-600'} group`}
                                        >
                                            <Image
                                                src={img.image_path}
                                                alt={`Existing Preview ${img.id}`}
                                                fill
                                                sizes="100vw"
                                                className="object-cover rounded-md" // Tambahkan padding di sini dan pastikan rounded-md
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                // Sesuaikan posisi agar setengah di luar. Z-index penting.
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-red-600 hover:bg-red-700 text-white" // Tambah z-10 dan warna latar
                                                onClick={() => toggleRemoveExistingPreview(img.id)}
                                            >
                                                {removedPreviewIds.includes(img.id) ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    ))}

                                    {/* New Preview Files */}
                                    {newPreviewFiles.map((file, index) => (
                                        <div
                                            key={file.name + index}
                                            className="relative w-24 h-24 rounded-lg shadow-sm border border-blue-500 dark:border-blue-600 group"
                                        >
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={`New Preview ${index + 1}`}
                                                fill
                                                sizes="100vw"
                                                className="object-cover rounded-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => removeNewPreviewFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {/* Upload button for new previews */}
                                    <div className="w-24 h-24 flex flex-col justify-center items-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => document.getElementById("previews-upload")?.click()}
                                            className="h-10 w-10 text-gray-500 dark:text-gray-400"
                                        >
                                            <Upload className="h-6 w-6" />
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center">Tambah</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">JPG, PNG, JPEG, WEBP. Maksimal 2MB per gambar.</p>
                            <input
                                id="previews-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple // Izinkan multi-select
                                onChange={handleNewPreviewFilesSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </Form>
            </ModalForm>

            {errorDialogOpen && (
                <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className={"text-center text-red-500"}>Gagal!</AlertDialogTitle>
                            <AlertDialogDescription className={"text-center"}>
                                {errorMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction className={"mx-auto "} onClick={() => setErrorDialogOpen(false)}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    )
}
