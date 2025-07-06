"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpDown, Pencil, Trash2, Mail, User } from "lucide-react"

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
        accessorKey: "photo",
        header: () => <div className="text-center font-semibold">Foto</div>,
        cell: ({ row }) => {
            const user = row.original
            const photoUrl = user.photo ?? null

            return (
                <div className="flex justify-center">
                    <Avatar className="h-16 w-16 object-cover object-center">
                        <AvatarImage src={photoUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                            {
                                user.name ?
                                    user.name.split(" ").slice(0, 2)
                                    .map((word) => word.charAt(0)).join(" ").toUpperCase()
                                        :
                                    <User className="h-4 w-4" />
                            }
                        </AvatarFallback>
                    </Avatar>
                </div>
            )
        },
        enableSorting: false,
        size: 80,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent text-left justify-start hover:cursor-pointer"
                >
                    Nama User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <Badge variant="outline" className="bg-blue-50 text-[#2C3E9E] border-[#2C3E9E]/30 text-[11px] px-1">
                        {user.code}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                    </div>
                </div>
            )
        },
        size: 250,
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:cursor-pointer"
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex justify-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium px-3 py-1">
                        {user.role.name_upper || "No Role"}
                    </Badge>
                </div>
            )
        },
        size: 150,
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
            const user = row.original
            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">{user.created_at}</div>
                    <div className="text-xs text-muted-foreground">{user.created_at_human}</div>
                </div>
            )
        },
        size: 180,
    },
    {
        id: "actions",
        header: () => <div className="text-center font-semibold">Aksi</div>,
        cell: ({ row }) => {
            const user = row.original

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                        className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteAlert(user)}
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Hapus
                    </Button>
                </div>
            )
        },
        enableSorting: false,
        size: 120,
    },
]
