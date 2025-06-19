"use client"

import {useCallback, useEffect, useState} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addUserSchema, editUserSchema, photoFileSchema,  } from "@/schemas/user-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Upload, X, User, EyeOff, Eye} from "lucide-react"
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

export function UserForm({
   isModalOpen,
   setIsModalOpen,
   selectedUser,
   handleAddUser,
   handleEditUser,
   isLoading,
   roles = [],
}) {
    const isEditMode = !!selectedUser

    const [showPassword, setShowPassword] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const form = useForm({
        resolver: zodResolver(isEditMode ? editUserSchema : addUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role_id: "",
        },
    })

    const {
        formState: { errors },
        setFocus,
    } = form;

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

    // Reset form when modal opens/closes or selected user changes
    useEffect(() => {
        if (isModalOpen) {
            form.reset({
                name: selectedUser?.name || "",
                email: selectedUser?.email || "",
                password: "",
                role_id: selectedUser?.role?.id?.toString() || "",
            })

            // Set preview untuk foto existing
            if (selectedUser?.photo) {
                setPreviewUrl(selectedUser.photo)
            } else {
                setPreviewUrl(null)
            }
            setSelectedFile(null)
        } else {
            // Reset semua state ketika modal ditutup
            form.reset({
                name: "",
                email: "",
                password: "",
                role_id: "",
            })
            setSelectedFile(null)
            setPreviewUrl(null)
        }
    }, [isModalOpen, selectedUser, form])

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                photoFileSchema.parse({ file })
                setSelectedFile(file)

                // Create preview URL
                const reader = new FileReader()
                reader.onload = (e) => {
                    setPreviewUrl(e.target?.result)
                }
                reader.readAsDataURL(file)
            } catch (error) {
                toast.error(error.errors[0].message)
                return
            }
        }
    }

    // Remove selected file
    const removeFile = () => {
        setSelectedFile(null)
        if (isEditMode && selectedUser?.photo) {
            setPreviewUrl(selectedUser.photo)
        } else {
            setPreviewUrl(null)
        }
    }

    const onSubmit = async (values) => {
        try {
            // Create FormData untuk handle file upload
            const formData = new FormData()

            // Append values ke FormData
            formData.append("name", values.name || "")
            formData.append("email", values.email || "")
            formData.append("role_id", values.role_id || "")

            // Hanya tambahkan password jika diisi dan tidak kosong
            if (values.password?.trim()) {
                formData.append("password", values.password.trim())
            }

            // Tambahkan file jika ada
            if (selectedFile) {
                formData.append("photo", selectedFile)
            }

            if (isEditMode) {
                await handleEditUser(formData)
            } else {
                await handleAddUser(formData)
            }

            form.reset({
                name: "",
                email: "",
                password: "",
                role_id: "",
            })
            setSelectedFile(null)
            setPreviewUrl(null)
        } catch (error) {
            handleDisplayError(error);
        }
    }

    // Toast error handler
    // useEffect(() => {
    //     const errors = form.formState.errors
    //
    //     if (Object.keys(errors).length > 0) {
    //         const fieldLabels = {
    //             name: "Nama User",
    //             email: "Email",
    //             password: "Password",
    //             role_id: "Role",
    //             photo: "Foto Profile",
    //         }
    //
    //         showMultipleErrorToasts(errors, fieldLabels)
    //     }
    // }, [form.formState.errors])

    const onInvalidSubmit = (errors) => {
        const fieldLabels = {
            name: "Nama User",
            email: "Email",
            password: "Password",
            role_id: "Role",
            photo: "Foto Profile", // Jika Anda memiliki validasi Zod untuk photo field
        };
        // Panggil showMultipleErrorToasts di sini untuk error validasi client-side
        showMultipleErrorToasts(errors, fieldLabels);
    };

    return (
        <>
            <ModalForm
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={isEditMode ? "Edit Role" : "Tambah Role Baru"}
                description={isEditMode ? "Ubah informasi user yang sudah ada." : "Buat user baru untuk sistem."}
                onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
                isLoading={isLoading}
                submitLabel={isEditMode ? "Update" : "Simpan"}
                size="xl"
            >
                <Form {...form}>
                    <div className="flex flex-col md:flex-row gap-x-8">
                        <div className="w-full md:w-1/2 flex flex-col space-y-4">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan nama lengkap" disabled={isLoading} className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Masukkan email" disabled={isLoading} className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Password{" "}
                                            {isEditMode && <span className="text-muted-foreground">(kosongkan jika tidak diubah)</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-center relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                                                    {...field}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 rounded-md"
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Role Field */}
                            <FormField
                                control={form.control}
                                name="role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 w-full">
                                                    <SelectValue placeholder="Pilih role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">{role.name}</span>
                                                            <span className="text-xs text-muted-foreground">({role.role_code})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center text-center border border-gray-200 rounded-lg">
                            {/* Photo Upload */}
                            <div>
                                <label className="text-sm font-medium">Foto Profile</label>
                                <div className="flex flex-col items-center">
                                    <div className="py-4">
                                        <Avatar className="h-44 w-44">
                                            <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Preview" />
                                            <AvatarFallback className="bg-gray-100">
                                                <User className="h-20 w-20 text-gray-400" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex flex-col justify-center items-center space-y-2">
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById("photo-upload")?.click()}
                                                className="h-8"
                                            >
                                                <Upload className="h-3.5 w-3.5 mr-1" />
                                                {selectedFile || previewUrl ? "Ganti Foto" : "Upload Foto"}
                                            </Button>

                                            {(selectedFile) && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={removeFile}
                                                    className="h-8 text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>

                                        <p className="text-xs text-muted-foreground">JPG, PNG, JPEG, WEBP. Maksimal 2MB.</p>
                                    </div>
                                </div>

                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
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
