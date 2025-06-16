// components/forms/NewsForm.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewsSchema } from "@/schemas/news-schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, ImageOff } from "lucide-react";
import { ModalForm } from "@/components/ModalForm"; // ModalForm tidak diubah
import { toast } from "sonner";

import dynamic from 'next/dynamic';
import { MultiSelect } from "@/components/MultiSelect";
import { FormProvider } from "react-hook-form";

const QuillEditorManual = dynamic(() => import('@/components/QuillEditorManual'), { ssr: false });

function toTitleCase(str) {
    if (!str) return '';
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

const showMultipleErrorToasts = (errors, fieldLabels) => {
    Object.entries(errors).forEach(([field, error]) => {
        const label = fieldLabels[field] || field;
        if (error && error.message) {
            toast.error(`${label}: ${error.message}`, {
                duration: 4000,
                position: "top-right",
                id: `error-${field}-${Date.now()}`,
                dismissible: true
            });
        }
    });
};

export function NewsForm({
    isModalOpen,
    setIsModalOpen,
    selectedNews,
    handleAddNews,
    handleEditNews,
    isLoading,
    newsCategories
}) {
    const isEditMode = !!selectedNews;

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(NewsSchema),
        defaultValues: {
            title: "",
            content: "",
            category_id: [],
            status: "drafted",
        },
    });

    // Destructuring dari objek form
    const {
        formState: { errors },
        setFocus,
        setValue,
        control,
        reset
    } = form;

    const handleDisplayError = useCallback((currentError) => {
        if (!currentError) return;

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
            const initialCategoryIds = selectedNews?.news_category?.map(cat => cat.id) || [];
            reset({
                title: selectedNews?.title || "",
                content: selectedNews?.content || "",
                category_id: initialCategoryIds,
                status: selectedNews?.status || "drafted",
            });

            if (selectedNews?.thumbnail) {
                setThumbnailPreviewUrl(selectedNews.thumbnail);
            } else {
                setThumbnailPreviewUrl(null);
            }
            setThumbnailFile(null);
        } else {
            reset({
                title: "",
                content: "",
                category_id: [],
                status: "drafted",
            });
            setThumbnailFile(null);
            setThumbnailPreviewUrl(null);
        }
    }, [isModalOpen, selectedNews, reset, newsCategories]);

    // Handler untuk memilih file thumbnail
    const handleThumbnailFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreviewUrl(e.target?.result);
            };
            reader.readAsDataURL(file);
            setValue("thumbnail", file);
        } else {
            setThumbnailFile(null);
            setThumbnailPreviewUrl(null);
            setValue("thumbnail", null);
        }
    };

    const removeThumbnailFile = () => {
        setThumbnailFile(null);
        setThumbnailPreviewUrl(null);
        setValue("thumbnail", null);
    };

    const onSubmit = async (values) => {
        try {
            if (!isEditMode && !thumbnailFile && !thumbnailPreviewUrl) {
                form.setError("thumbnail", {
                    type: "manual",
                    message: "Gambar thumbnail wajib diupload untuk berita baru.",
                });
                toast.error("Gambar thumbnail wajib diupload untuk berita baru.", { position: "top-right" });
                return;
            }

            const formData = new FormData();

            formData.append("title", values.title || "");
            formData.append("content", values.content || "");
            values.category_id.forEach((id) => {
                formData.append("category_id[]", id.toString());
            });
            formData.append("status", values.status || "drafted");

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            } else if (isEditMode && !thumbnailPreviewUrl && selectedNews?.thumbnail_url) {
                formData.append("thumbnail", null);
            }

            if (isEditMode) {
                await handleEditNews(formData, selectedNews.id);
            } else {
                await handleAddNews(formData);
            }

            reset();
            setThumbnailFile(null);
            setThumbnailPreviewUrl(null);
            setIsModalOpen(false); // Tutup modal
        } catch (error) {
            handleDisplayError(error); // Tampilkan error jika terjadi
        }
    };

    const onInvalidSubmit = (errors) => {
        const fieldLabels = {
            title: "Judul Berita",
            content: "Konten Berita",
            category_id: "Kategori",
            status: "Status",
            thumbnail: "Gambar Thumbnail",
        };
        showMultipleErrorToasts(errors, fieldLabels);
    };

    return (
        <>
            {/* FormProvider membungkus seluruh ModalForm untuk menyediakan konteks form */}
            <FormProvider {...form}>
                <ModalForm
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    title={isEditMode ? "Edit Berita" : "Tambah Berita Baru"}
                    description={isEditMode ? "Ubah informasi berita yang sudah ada." : "Buat berita baru untuk sistem."}
                    onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
                    isLoading={isLoading}
                    submitLabel={isEditMode ? "Update" : "Simpan"}
                    size="2xl"
                >
                    <div className="flex flex-col gap-y-8 flex-grow min-h-0 overflow-y-auto pb-4 px-1">
                        <div className="flex flex-row space-x-8">
                            <div className="w-full md:w-1/2 flex flex-col space-y-4">
                                {/* Field Judul Berita */}
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Judul Berita</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan judul berita" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Field Kategori Berita */}
                                <FormField
                                    control={control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={newsCategories.map(category => ({ value: category.id, label: category.name }))}
                                                    selected={field.value}
                                                    onSelectedChange={(selectedValues) => {
                                                        field.onChange(selectedValues);
                                                    }}
                                                    placeholder="Pilih kategori..."
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Field Status Berita */}
                                <FormField
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Status</FormLabel>
                                            <ShadcnSelect onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="h-10 w-full">
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                                                    <SelectItem value="drafted">Drafted</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </ShadcnSelect>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Bagian Gambar Thumbnail */}
                            <div className="w-full md:w-1/2 flex flex-col space-y-6">
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 text-center">Gambar Thumbnail</h4>
                                    <div className="py-4 w-full flex justify-center">
                                        <div className="relative w-full max-w-sm h-44 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                            {thumbnailPreviewUrl ? (
                                                <Image
                                                    src={thumbnailPreviewUrl}
                                                    alt="Thumbnail Preview"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                                    <ImageOff className="h-12 w-12 mb-4" />
                                                    <p className="text-center">Tidak ada gambar thumbnail.</p>
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
                                                onClick={() => document.getElementById("thumbnail-upload")?.click()}
                                                className="h-8"
                                                disabled={isLoading}
                                            >
                                                <Upload className="h-3.5 w-3.5 mr-1" />
                                                {thumbnailFile || (isEditMode && selectedNews?.thumbnail) ? "Ganti Gambar" : "Upload Gambar"}
                                            </Button>

                                            {(thumbnailFile || (isEditMode && selectedNews?.thumbnail)) && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={removeThumbnailFile}
                                                    className="h-8 text-red-600 hover:text-red-700"
                                                    disabled={isLoading}
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, JPEG, GIF. Maksimal 2MB.</p>
                                    </div>
                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleThumbnailFileSelect}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    {errors.thumbnail && <FormMessage>{errors.thumbnail.message}</FormMessage>}
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex flex-col flex-grow">
                                    <FormLabel className="text-sm font-medium">Konten Berita</FormLabel>
                                    <FormControl className="flex-grow">
                                        <QuillEditorManual
                                            value={field.value}
                                            onChange={field.onChange}
                                            readOnly={isLoading}
                                            placeholder="Masukkan konten berita..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </ModalForm>
            </FormProvider>

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
    );
}