"use client"

import * as React from "react"
import { useDebounce } from "use-debounce";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {DataTablePagination} from "@/components/DataTablePagination";

export function DataTable({ columns, data, isLoading = false, onAddNew }) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [localSearchQuery, setLocalSearchQuery] = React.useState("")
    const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300) // Debounce local state

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValue) => { // filter
            const search = filterValue.toLowerCase().trim();
            return (
                row.original.role_code?.toLowerCase().includes(search) ||
                row.original.name?.toLowerCase().includes(search) ||
                row.original.created_at?.toLowerCase().includes(search) ||
                row.original.created_at_human?.toLowerCase().includes(search)
            )
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery, // filter debounce
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <Card className="shadow-sm border-gray-200">
            <CardContent className="px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                    <div className="w-full flex items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari role..."
                                value={localSearchQuery}
                                onChange={(event) => setLocalSearchQuery(event.target.value)}
                                className="pl-9 h-10 border-gray-300 focus:border-[#2C3E9E] focus:ring-[#2C3E9E]"
                            />
                        </div>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-10 border-gray-300">
                                    <ChevronDown className="h-4 w-4" />
                                    Column
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id === "role_code"
                                                    ? "Kode Role"
                                                    : column.id === "name_upper"
                                                        ? "Nama Role"
                                                        : column.id === "created_at"
                                                            ? "Tanggal Dibuat"
                                                            : column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={onAddNew} className="bg-[#2C3E9E] hover:bg-[#243280] h-10 px-4 font-medium">
                            <Plus className="h-4 w-4" />
                            Tambah Role
                        </Button>
                    </div>
                </div>
                {/* Table */}
                <div className="rounded-xl border border-gray-200">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-gray-50/80 hover:bg-gray-50/80">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                style={{ width: header.getSize() }}
                                                className="h-12 font-semibold text-gray-700 border-b border-gray-200 rounded-xl"
                                            >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50/50">
                                        {columns.map((_, cellIndex) => (
                                            <TableCell key={cellIndex} className="h-16 px-4">
                                                <Skeleton className="h-6 w-full rounded" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-gray-50/50 border-b border-gray-100"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="h-16 px-4 py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="text-muted-foreground">Tidak ada data role ditemukan</div>
                                            <div className="text-sm text-muted-foreground">
                                                Coba ubah filter pencarian atau tambah role baru
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination table={table} pageSizeOptions={[5, 10, 15, 25, 50, 100]} />
            </CardContent>
        </Card>
    )
}
