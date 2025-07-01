// hooks/useHandleDisplayError.js

import { useCallback } from 'react';
import { toast } from "sonner";

function toTitleCase(str) {
    if (!str) return '';
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export const useHandleDisplayError = (setErrorMessage, setErrorDialogOpen, setFocus) => {
    const handleDisplayError = useCallback((currentError) => {
        if (!currentError) return;

        let messageForAlertDialog = "Terjadi kesalahan. Silakan coba lagi.";

        // Prioritaskan currentError.message jika ada
        if (currentError.message) {
            messageForAlertDialog = currentError.message;
        }

        setErrorMessage(messageForAlertDialog);
        setErrorDialogOpen(true);

        // Tangani error validasi field
        if (currentError.errors) {
            // Jika errors adalah objek dengan error per field
            if (typeof currentError.errors === 'object' && Object.keys(currentError.errors).length > 0) {
                // Atur fokus ke field error pertama
                const firstErrorField = Object.keys(currentError.errors)[0];
                if (firstErrorField) {
                    setTimeout(() => {
                        setFocus(firstErrorField);
                    }, 100);
                }

                // Tampilkan toast untuk setiap error field
                Object.entries(currentError.errors).forEach(([field, messages]) => {
                    const messageText = Array.isArray(messages) ? messages.join(", ") : messages;
                    toast.error(`${toTitleCase(field)}: ${messageText}`, {
                        duration: 4000,
                        position: "top-right",
                        id: `error-${field}-${Date.now()}`,
                        dismissible: true
                    });
                });
            }
            // Jika errors adalah string (pesan error global)
            else if (typeof currentError.errors === 'string') {
                toast.error(currentError.errors, {
                    duration: 4000,
                    position: "top-right",
                    id: `error-global-${Date.now()}`,
                    dismissible: true
                });
            }
        }
    }, [setErrorMessage, setErrorDialogOpen, setFocus]);

    return handleDisplayError;
};