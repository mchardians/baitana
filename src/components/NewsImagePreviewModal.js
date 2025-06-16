import Image from "next/image";
import { ImageOff } from "lucide-react";

import { ModalForm } from "@/components/ModalForm";
import { useState, useEffect } from 'react';

export function NewsImagePreviewModal({ isOpen, onClose, thumbnailUrl }) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [isOpen, thumbnailUrl]);

    if (!isOpen || !thumbnailUrl) {
        return null;
    }

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={onClose}
            title="Thumbnail Berita"
            size="md"
            hideSubmitButton={true}
        >
            <div className="flex flex-col items-center justify-center p-2 h-full">
                {imageError ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 p-4 w-full h-full">
                        <ImageOff className="h-16 w-16" />
                        <p className="text-sm">Gambar tidak dapat dimuat</p>
                    </div>
                ) : (
                    <div className="relative flex justify-center items-center w-full h-full max-h-[85vh] overflow-auto">
                        <Image
                            src={thumbnailUrl}
                            alt="Thumbnail Berita"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="max-h-[80vh] w-[400px] object-contain rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700"
                            onError={() => setImageError(true)}
                        />
                    </div>
                )}
            </div>
        </ModalForm>
    );
}