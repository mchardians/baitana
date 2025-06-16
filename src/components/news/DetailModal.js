"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { ModalForm } from "@/components/ModalForm";
import { Badge } from "@/components/ui/badge";

export function NewsDetailModal({ isOpen, onClose, newsData }) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [isOpen, newsData]);

    if (!isOpen || !newsData) {
        return null;
    }

    const categoryColors = [
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
        "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700",
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    ];

    let displayDate = newsData.created_at;
    let displayHumanDate = newsData.created_at_human;
    let dateTypeLabel = "Dibuat (Drafted)";

    if (newsData.status === "published") {
        if (newsData.published_at) {
            displayDate = newsData.published_at;
            displayHumanDate = newsData.published_at_human;
            dateTypeLabel = "Terbit (Published)";
        }
    } else if (newsData.status === "archived") {
        if (newsData.archived_at) {
            displayDate = newsData.archived_at;
            displayHumanDate = newsData.archived_at_human;
            dateTypeLabel = "Arsip (Archived)";
        }
    }

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Berita"
            hideSubmitButton={true}
            size="2xl"
        >
            <div className="flex flex-col gap-y-4 pb-4 overflow-y-auto max-h-[80vh]">
                {/* Judul Berita */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
                    {newsData.title}
                </h2>

                {/* Kategori dan Info Status/Tanggal */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Kategori:</span>
                    {newsData.news_category && newsData.news_category.length > 0 ? (
                        newsData.news_category.map((category, idx) => (
                            <Badge key={category.id} variant="outline" className={`${categoryColors[idx % categoryColors.length]} text-xs px-3 py-1`}>
                                {category.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="italic text-gray-500 dark:text-gray-400">Tidak ada kategori</span>
                    )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                    <Badge variant="outline" className={`text-xs
                        ${newsData.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                        ${newsData.status === 'drafted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                        ${newsData.status === 'archived' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                    `}>
                        {dateTypeLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        ({displayDate} - {displayHumanDate})
                    </span>
                </div>

                {/* Bagian Gambar Thumbnail */}
                {newsData.thumbnail ? (
                    <div className="flex justify-center items-center py-4">
                        {imageError ? (
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-400 p-8 w-full h-48 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                <ImageOff className="h-16 w-16" />
                                <p className="text-sm">Gambar tidak dapat dimuat</p>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-xl h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
                                <Image
                                    src={newsData.thumbnail}
                                    alt={newsData.title || "Thumbnail Berita"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    // Fallback jika tidak ada gambar thumbnail
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <ImageOff className="h-16 w-16 mb-2" />
                        <p className="text-sm">Tidak ada gambar thumbnail.</p>
                    </div>
                )}

                {/* Konten Berita (dengan dangerouslySetInnerHTML) */}
                <div
                    className="prose dark:prose-invert max-w-none text-justify text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: newsData.content }}
                />
            </div>
        </ModalForm>
    );
}