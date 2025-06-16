"use client"

import { useState } from "react"
import { ConfirmDelete } from "@/components/ModalConfirmDelete";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteAlert({
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    selectedNews,
    handleDeleteNews,
    isLoading
}) {
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleConfirmDelete = async () => {
        try {
            await handleDeleteNews();
        } catch (error) {
            const messageToDisplay = error?.message || "Terjadi kesalahan saat menghapus berita.";
            setErrorMessage(messageToDisplay);
            setErrorDialogOpen(true);
            setIsDeleteAlertOpen(false);
        }
    };
    return (
        <>
            <ConfirmDelete
                isOpen={isDeleteAlertOpen}
                onClose={setIsDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
                description={
                    <>
                        Apakah Anda yakin ingin menghapus berita <strong>{selectedNews?.title}</strong>?
                        Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                isLoading={isLoading}
            />

            {errorDialogOpen && (
                <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className={"text-center text-red-500"}>Gagal Menghapus Berita!</AlertDialogTitle>
                            <AlertDialogDescription className={"text-center"}>
                                <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
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