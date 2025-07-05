"use client"

import { Badge } from "@/components/ui/badge"

export const createColumns = () => [
    {
        id: "index",
        header: () => <div className="text-center font-semibold">#</div>,
        cell: ({ row, table }) => {
            const filteredRows = table.getFilteredRowModel().rows;
            const currentItem = row.original;

            if (!currentItem) return null;

            const filteredIndex = filteredRows.findIndex(
                r =>
                    r.original?.date === currentItem?.date &&
                    r.original?.description === currentItem?.description
            );

            const displayIndex = filteredIndex !== -1 ? filteredIndex + 1 : row.index + 1;

            return (
                <div className="text-center font-medium text-muted-foreground">
                    {displayIndex}
                </div>
            );
        },
        enableSorting: false,
        size: 60,
    },
    {
        accessorKey: "date_idn_format",
        header: () => <div className="px-2 font-semibold">Tanggal</div>,
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900">{row.getValue("date_idn_format")}</div>
        },
        size: 150,
    },
    {
        accessorKey: "category",
        header: () => <div className="px-2 font-semibold text-center">Kategori Keuangan</div>,
        cell: ({ row }) => {
            const financeRecapitulations = row.original
            return (
                <div className="flex justify-center">
                    <Badge variant="outline" className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1">
                        <span>
                            {financeRecapitulations?.category ?? "No Finance Category"}
                        </span>
                    </Badge>
                </div>
            )
        },
        size: 150,
    },
    {
        accessorKey: "description",
        header: () => <div className="px-2 font-semibold">Deskripsi</div>,
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900 text-justify whitespace-normal break-words">{row.getValue("description")}</div>
        },
        size: 300,
    },
    {
        accessorKey: "income",
        header: () => <div className="px-2 font-semibold text-center">Pemasukan Keuangan</div>,
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900 text-center">{row.getValue("income")}</div>
        },
        size: 150,
    },
    {
        accessorKey: "expense",
        header: () => <div className="px-2 font-semibold text-center">Pengeluaran Keuangan</div>,
        cell: ({ row }) => {
            return <div className="font-medium text-gray-900 text-center">{row.getValue("expense")}</div>
        },
        size: 150,
    },
]
