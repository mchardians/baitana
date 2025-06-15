"use client";

import React from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { ModalForm } from "@/components/ModalForm";

export default function ImagePreviewModal({ isOpen, onClose, images }) {
    const { coverImage, previewImages } = images;

    const hasAnyImage = !!coverImage || (Array.isArray(previewImages) && previewImages.length > 0);

    if (!isOpen) {
        return null;
    }

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={onClose}
            title="Gallery Fasilitas"
            size="xl"
            hideSubmitButton={true}
        >
            <div className="flex flex-col items-center max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {!hasAnyImage ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                        <ImageOff className="h-10 w-10 mb-4" />
                        <p className="text-center">Tidak ada gambar preview yang tersedia.</p>
                    </div>
                ) : (
                    <div className="p-2 flex flex-col md:flex-row gap-6 w-full items-start">
                        <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col items-center bg-gray-90 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Cover Utama Fasilitas</h4>
                            {coverImage ? (
                                <div
                                    key={coverImage}
                                    className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex justify-center items-center" // Hapus tinggi tetap
                                >
                                    <Image
                                        src={coverImage}
                                        alt="Gambar Utama Fasilitas"
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-[200px] w-full">
                                    <ImageOff className="h-8 w-8 mb-2" />
                                    <p className="text-sm">Tidak ada gambar utama.</p>
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Gambar Detail Fasilitas (Image Previews) */}
                        <div className="flex-1 w-full md:w-1/2 bg-gray-90 dark:bg-gray-700 p-4 rounded-lg shadow-lg">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Gambar Detail Fasilitas</h4>
                            {Array.isArray(previewImages) && previewImages.length > 0 ? (
                                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 rounded-lg">
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {previewImages.map((img, index) => (
                                            <div
                                                key={img.image_path + index}
                                                className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-gray-200 dark:border-gray-600"
                                            >
                                                <Image
                                                    src={img.image_path}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    sizes="100vw"
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-[200px] w-full">
                                    <ImageOff className="h-8 w-8 mb-2" />
                                    <p className="text-sm">Tidak ada gambar galeri tambahan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ModalForm>
    );
}