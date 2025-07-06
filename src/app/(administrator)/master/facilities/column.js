"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ArrowUpDown, Pencil, Trash2, Mail, User, ImageOff, Eye, FileX} from "lucide-react"

export const createColumns = (openEditModal, openDeleteAlert, openPreviewImagesModal) => [
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
        accessorKey: "name_upper",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start hover:cursor-pointer"
                >
                    Nama Fasilitas
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const facility = row.original
            return (
                <div className="space-y-1">
                    <div className="font-medium text-gray-900 text-xs text-justify w-[200px] max-w-[200px] whitespace-normal break-words">{facility?.name_upper}</div>
                    <Badge variant="outline" className="bg-blue-50 text-[#2C3E9E] border-[#2C3E9E]/30 text-[11px] px-1">
                        {facility?.facility_code}
                    </Badge>
                </div>
            )
        },
        size: 200,
    },
    {
        accessorKey: "description",
        header: () => <div className="px-2 font-semibold">Deskripsi</div>,
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900 text-xs text-justify w-[200px] max-w-[200px] whitespace-normal break-words">{row.getValue("description")}</div>
        },
        size: 100,
    },
    {
        accessorKey: "capacity",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:cursor-pointer"
                    >
                        Kapasitas
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const facility = row.original
            return (
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="font-medium text-xs text-gray-900">{facility?.capacity} Orang</div>
                    <Badge variant="outline" className="bg-blue-50 text-[#2C3E9E] border-[#2C3E9E]/30 text-[11px] px-1">
                        {facility?.price_per_hour_in_rupiah} / jam
                    </Badge>
                </div>
            )
        },
        size: 200,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:cursor-pointer"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const facility = row.original
            const statusValue = facility.status
            const displayStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
            let badgeClass = ""
            if (statusValue === "reservable") {
                badgeClass = "bg-green-50 text-green-700 border-green-200"
            } else if (statusValue === "reserved") {
                badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
            } else if (statusValue === "unreservable") {
                badgeClass = "bg-red-50 text-red-700 border-red-200"
            } else {
                badgeClass = "bg-gray-50 text-gray-700 border-gray-200"
            }

            return (
                <div className="flex justify-center">
                    <Badge variant="outline" className={`${badgeClass} text-[11px] font-medium px-2 py-1`}>
                        { displayStatus || "No Status"}
                    </Badge>
                </div>
            )
        },
        size: 150,
    },
    {
        accessorKey: "image_previews_action",
        header: () => <div className="text-center font-semibold">Images</div>,
        cell: ({ row }) => {
            const facility = row.original;
            const hasImages = facility.cover_image || (Array.isArray(facility.image_previews) && facility.image_previews.length > 0);

            if (hasImages) {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPreviewImagesModal(facility)}
                            className="h-8 px-3 text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 cursor-pointer"
                        >
                            <Eye className="h-3.5 w-3.5" />
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
                    Tanggal Dibuat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const facility = row.original
            return (
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-900">{facility?.created_at}</div>
                    <div className="text-xs text-muted-foreground">{facility?.created_at_human}</div>
                </div>
            )
        },
        size: 180,
    },
    {
        id: "actions",
        header: () => <div className="text-center font-semibold">Aksi</div>,
        cell: ({ row }) => {
            const facility = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(facility)}
                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteAlert(facility)}
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
