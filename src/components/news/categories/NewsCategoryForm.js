"use client";

import {useCallback, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {newsCategorySchema} from "@/schemas/news-category-schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { InputError } from "@/components/InputError";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ModalForm } from "@/components/ModalForm";
import { showMultipleErrorToasts } from "@/utlis/toast-error-handle";
import {toast} from "sonner";

function toTitleCase(str) {
    if (!str) return '';
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function NewsCategoryForm({
    isModalOpen,
    setIsModalOpen,
    selectedNewsCategory,
    handleAddNewsCategory,
    handleEditNewsCategory,
    isLoading,
}) {
    const isEditMode = !!selectedNewsCategory;

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(newsCategorySchema),
        defaultValues: {
            name: selectedNewsCategory?.name || "",
        },
    });

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

    useEffect(() => {
        if (isModalOpen) {
            form.reset({
                name: selectedNewsCategory?.name || "",
            });
        }
    }, [isModalOpen, selectedNewsCategory, form]);

    const onSubmit = async (values) => {
        try {
            if (isEditMode) {
                await handleEditNewsCategory(values);
            } else {
                await handleAddNewsCategory(values);
            }
            form.reset();
        } catch (error) {
            handleDisplayError(error);
            // console.error(error);
            // toast.error(error.message || "Terjadi kesalahan saat menyimpan data");
        }
    };

    useEffect(() => {
        const errors = form.formState.errors

        if (Object.keys(errors).length > 0) {
            const fieldLabels = {
                name: "Nama Kategori Berita"
            }

            showMultipleErrorToasts(errors, fieldLabels);
        }
    }, [form.formState.errors])

    return (
        <>
            <ModalForm
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={isEditMode ? "Edit Kategori Berita" : "Tambah Kategori Berita Baru"}
                description={isEditMode ? "Ubah informasi kategori berita yang sudah ada." : "Buat kategori berita baru untuk sistem."}
                onSubmit={form.handleSubmit(onSubmit)}
                isLoading={isLoading}
                submitLabel={isEditMode ? "Update" : "Simpan"}
                size="sm"
            >
                <div className="space-y-2">
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Kategori Berita</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama kategori berita" disabled={isLoading} className="h-10" {...field} />
                                    </FormControl>
                                    <InputError message={form.formState.errors.name?.message} />
                                </FormItem>
                            )}
                        />
                    </Form>
                </div>
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
    );
}