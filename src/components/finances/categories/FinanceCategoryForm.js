"use client";

import {useCallback, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financeCategorySchema } from "@/schemas/finance-category-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function FinanceCategoryForm({
    isModalOpen,
    setIsModalOpen,
    selectedFinanceCategory,
    handleAddFinanceCategory,
    handleEditFinanceCategory,
    isLoading,
}) {
    const isEditMode = !!selectedFinanceCategory;

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(financeCategorySchema),
        defaultValues: {
            name: selectedFinanceCategory?.name || "",
            type: selectedFinanceCategory?.type || ""
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
                name: selectedFinanceCategory?.name || "",
                type: selectedFinanceCategory?.type || ""
            });
        }
    }, [isModalOpen, selectedFinanceCategory, form]);

    const onSubmit = async (values) => {
        try {
            if (isEditMode) {
                await handleEditFinanceCategory(values);
            } else {
                await handleAddFinanceCategory(values);
            }
            form.reset();
        } catch (error) {
            handleDisplayError(error);
        }
    };

    // Toast error handler untuk multiple errors
    useEffect(() => {
        const errors = form.formState.errors

        if (Object.keys(errors).length > 0) {
            const fieldLabels = {
                name: "Nama Kategori Keuangan",
                type: "Tipe Keuangan"
            }

            showMultipleErrorToasts(errors, fieldLabels);
        }
    }, [form.formState.errors])

    return (
        <>
            <ModalForm
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={isEditMode ? "Edit Kategori Keuangan" : "Tambah Kategori Keuangan"}
                description={isEditMode ? "Ubah informasi kategori keuanangan yang sudah ada." : "Buat kategori keuangan baru untuk sistem."}
                onSubmit={form.handleSubmit(onSubmit)}
                isLoading={isLoading}
                submitLabel={isEditMode ? "Update" : "Simpan"}
                size="sm"
            >
                <div className="space-y-4 pb-4">
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Nama Kategori Keuangan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama kategori keuangan" disabled={isLoading} className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Tipe Keuangan</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger className="h-10 w-full">
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="expense">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">Expense</span>
                                                    <span className="text-xs text-muted-foreground">(Pengeluaran)</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="income">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">Income</span>
                                                    <span className="text-xs text-muted-foreground">(Pemasukan)</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
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