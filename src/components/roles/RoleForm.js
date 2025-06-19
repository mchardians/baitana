"use client";

import {useCallback, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "@/schemas/role-schema";
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

export function RoleForm({
   isModalOpen,
   setIsModalOpen,
   selectedRole,
   handleAddRole,
   handleEditRole,
   isLoading,
}) {
    const isEditMode = !!selectedRole;

    // State untuk AlertDialog
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: selectedRole?.name || "",
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

    // Reset form when modal opens/closes or selected roles changes
    useEffect(() => {
        if (isModalOpen) {
            form.reset({
                name: selectedRole?.name || "",
            });
            setErrorDialogOpen(false);
            setErrorMessage("");
        }
    }, [isModalOpen, selectedRole, form]);

    const onSubmit = async (values) => {
        try {
            if (isEditMode) {
                await handleEditRole(values);
            } else {
                await handleAddRole(values);
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
                name: "Nama Role"
            }

            showMultipleErrorToasts(errors, fieldLabels);
        }
    }, [form.formState.errors])

    return (
        <>
            <ModalForm
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={isEditMode ? "Edit Role" : "Tambah Role Baru"}
                description={isEditMode ? "Ubah informasi roles yang sudah ada." : "Buat roles baru untuk sistem."}
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
                                    <FormLabel className="text-sm font-medium">Nama Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama role" disabled={isLoading} className="h-10" {...field} />
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