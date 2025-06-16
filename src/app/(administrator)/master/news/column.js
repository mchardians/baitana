"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, FileX, Image, Pencil, Trash2 } from "lucide-react"

export const createColumns = (openEditModal, openPreviewImageModal, openDetailModal, openDeleteAlert) => [
    {
        id: "index",
        header: () => <div className="text-center font-semibold">#</div>,
        cell: ({ row, table }) => {
            const filteredRows = table.getFilteredRowModel().rows;
            const currentRowId = row.original.id;
            const currentIndex = filteredRows.findIndex(r => r.original.id === currentRowId) + 1;
            return <div className="text-center font-medium text-muted-foreground">{currentIndex}</div>;
        },
        enableSorting: false,
        size: 60,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start hover:cursor-pointer"
                >
                    Judul
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const news = row.original
            return <div className="font-medium text-gray-900 w-[280px] max-w-[280px] text-justify whitespace-normal break-words">{news.title}</div>
        },
        size: 200,
    },
    {
        accessorKey: "news_category",
        header: () => <div className="text-center font-semibold">Kategori Berita</div>,
        cell: ({ row }) => {
            const news = row.original
            const newsCategories = news.news_category || [];

            const categoryColors = [
                "bg-blue-50 text-blue-700 border-blue-200",
                "bg-purple-50 text-purple-700 border-purple-200",
                "bg-pink-50 text-pink-700 border-pink-200",
                "bg-red-50 text-red-700 border-red-200",
                "bg-yellow-50 text-yellow-700 border-yellow-200",
                "bg-green-50 text-green-700 border-green-200",
            ];

            return (
                <div className="flex justify-center flex-wrap gap-1">
                    {newsCategories.length > 0 ? (
                        newsCategories.map((category, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className={`${categoryColors[idx % categoryColors.length]} text-xs px-3 py-1`}
                            >
                                {category.name}
                            </Badge>
                        ))
                    ) : (
                        <div className="text-sm font-medium text-gray-900">Tidak Ada</div>
                    )}
                </div>
            );
        },
        size: 100,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center font-semibold">Status</div>,
        cell: ({ row }) => {
            const news = row.original
            const statusValue = news.status
            const displayStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

            let badgeClass = ""
            if (statusValue === "published") {
                badgeClass = "bg-green-50 text-green-700 border-green-200"
            } else if (statusValue === "drafted") {
                badgeClass = "bg-yellow-50 text-yellow-700 border-yellow-200"
            } else if (statusValue === "archived") {
                badgeClass = "bg-red-50 text-red-700 border-red-200"
            } else {
                badgeClass = "bg-gray-50 text-gray-700 border-gray-200"
            }

            return (
                <div className="flex justify-center">
                    <Badge variant="outline" className={`${badgeClass} text-xs font-medium px-3 py-1`}>
                        { displayStatus || "No Status"}
                    </Badge>
                </div>
            )
        },
        size: 100,
    },
    {
        accessorKey: "preview_thumbnail",
        header: () => <div className="text-center font-semibold">Thumbnail</div>,
        cell: ({ row }) => {
            const news = row.original;
            const hasImages = news.thumbnail || null;

            if (hasImages) {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPreviewImageModal(news)}
                            className="h-8 px-3 text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 cursor-pointer"
                        >
                            <Image className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                );
            }
            return (
                <div className="flex flex-col justify-center items-center text-muted-foreground space-y-1">
                    <FileX className="w-4 h-4" />
                    <span className="text-xs text-center">Tidak ada</span>
                </div>
            );
        },
        size: 100,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start hover:cursor-pointer"
                >
                    Tanggal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const data = row.original; // Dapatkan seluruh data baris

            let displayDate = data.created_at;
            let displayHumanDate = data.created_at_human;
            let dateTypeLabel = "Dibuat";

            if (data.status === "published") {
                if (data.published_at) {
                    displayDate = data.published_at;
                    displayHumanDate = data.published_at_human;
                    dateTypeLabel = "Terbit";
                }
            } else if (data.status === "archived") {
                if (data.archived_at) {
                    displayDate = data.archived_at;
                    displayHumanDate = data.archived_at_human;
                    dateTypeLabel = "Arsip";
                }
            }

            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">{displayDate}</div>
                    <div className="text-xs text-muted-foreground">{displayHumanDate}</div>
                    <div className="text-xs text-gray-500 italic">{dateTypeLabel}</div>
                </div>
            )
        },
        size: 180,
    },
    {
        id: "actions",
        header: () => <div className="text-center font-semibold">Aksi</div>,
        cell: ({ row }) => {
            const news = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(news)}
                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailModal(news)}
                        className="h-8 px-3 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteAlert(news)}
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )
        },
        enableSorting: false,
        size: 120,
    },
]
