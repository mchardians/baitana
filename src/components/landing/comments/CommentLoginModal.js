"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CommentLoginModal({ isOpen, onClose, onLoginClick }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Anda Belum Login</DialogTitle>
                    <DialogDescription className="text-md text-justify">
                        Untuk dapat mengirim komentar atau membalas, Anda perlu login terlebih dahulu.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 text-center">
                    <p className="text-gray-700">Silakan login untuk melanjutkan.</p>
                </div>
                <DialogFooter className="!justify-center flex gap-2 ">
                    <Button onClick={onClose} variant="outline" className="bg-red-500 hover:bg-red-600 text-white hover:text-white cursor-pointer">
                        Batal
                    </Button>
                    <Button onClick={onLoginClick} className="bg-[#2C3E9E] hover:bg-[#3f51b5] text-white cursor-pointer">
                        Login Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
