"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"

export const createColumns = (openEditModal, openDeleteAlert) => [
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
        accessorKey: "role_code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start hover:cursor-pointer"
                >
                    Kode Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="bg-blue-50 text-[#2C3E9E] border-[#2C3E9E]/30 font-medium px-3 py-1">
                    {row.getValue("role_code")}
                </Badge>
            )
        },
        size: 150,
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
                    Nama Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900">{row.getValue("name_upper")}</div>
        },
        size: 600,
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
            const role = row.original
            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">{role.created_at}</div>
                    <div className="text-xs text-muted-foreground">{role.created_at_human}</div>
                </div>
            )
        },
        size: 180,
    },
    {
        id: "actions",
        header: () => <div className="text-center font-semibold">Aksi</div>,
        cell: ({ row }) => {
            const role = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(role)}
                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteAlert(role)}
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )
        },
        enableSorting: false,
        size: 60,
    },
]
