"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, FileCheck, FileDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {DataTablePagination} from "@/components/DataTablePagination";
import {DateRangeFilter} from "@/components/DateRangeFilter";
import LoadingSpinner from "@/components/LoadingSpinner";

export function DataTable({ columns, data, totalIncome, totalExpense, isLoading = false, onDateRangeChange, onExportExcel, onExportPdf}) {
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
            const search = filterValue.toLowerCase().trim()
            return (
                row.original.date?.toLowerCase().includes(search) ||
                row.original.category?.toLowerCase().includes(search) ||
                row.original.description?.toLowerCase().includes(search) ||
                row.original.income?.toLowerCase().includes(search) ||
                row.original.expense?.toLowerCase().includes(search)
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

    const sumOfIncome = table.getRowModel().rows.reduce((sum, row) => {
        const incomeValue = row.original.income || "0";
        const cleanedIncomeString = incomeValue
            .replace(/Rp\.\s?/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '.');

        const income = parseFloat(cleanedIncomeString) || 0; // Parse to float, default to 0 if NaN
        return sum + income;
    }, 0);

    const sumOfExpense = table.getRowModel().rows.reduce((sum, row) => {
        const expenseValue = row.original.expense || "0";
        const cleanedExpenseString = expenseValue
            .replace(/Rp\.\s?/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '.');

        const expense = parseFloat(cleanedExpenseString) || 0; // Parse to float, default to 0 if NaN
        return sum + expense;
    }, 0);

    const showGrandTotal = table.getFilteredRowModel().rows.length > table.getState().pagination.pageSize;

    const firstTotalLabel = showGrandTotal ? "Total Halaman ini" : "Total"

    return (
        <>
            <DateRangeFilter onApplyFilter={onDateRangeChange} />
            <Card className="shadow-sm border-gray-200">
                <CardContent className="px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                        <div className="w-full flex items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari transaksi keuangan masuk..."
                                    value={localSearchQuery}
                                    onChange={(event) => setLocalSearchQuery(event.target.value)}
                                    className="pl-9 h-10 border-gray-300 focus:border-[#2C3E9E] focus:ring-[#2C3E9E]"
                                />
                            </div>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10 border-gray-300 cursor-pointer">
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
                                                    {column.id === "date_idn_format"
                                                        ? "Tanggal"
                                                        : column.id === "category"
                                                            ? "Kategori Keuangan"
                                                            : column.id === "description"
                                                                ? "Deskripsi"
                                                                : column.id === "incomes"
                                                                    ? "Pemasukan Keuangan"
                                                                    : column.id === "expense"
                                                                        ? "Pengeluaran Keuangan"
                                                                        : column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                className="bg-green-600 hover:bg-green-500 h-10 px-4 font-medium cursor-pointer"
                                onClick={onExportExcel}
                                disabled={isLoading}
                            >
                                <FileCheck className="h-4 w-4" />
                                Export Excel
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-500 h-10 px-4 font-medium cursor-pointer"
                                onClick={onExportPdf}
                                disabled={isLoading}
                            >
                                <FileDown className="h-4 w-4" />
                                Export PDF
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
                                    // Array.from({ length: 6 }).map((_, index) => (
                                    //     <TableRow key={index} className="hover:bg-gray-50/50">
                                    //         {columns.map((_, cellIndex) => (
                                    //             <TableCell key={cellIndex} className="h-16 px-4">
                                    //                 <Skeleton className="h-6 w-full rounded" />
                                    //             </TableCell>
                                    //         ))}
                                    //     </TableRow>
                                    // ))
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="p-0">
                                            <LoadingSpinner />
                                        </TableCell>
                                    </TableRow>
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
                                                <div className="text-muted-foreground">Tidak ada data transaksi keuangan ditemukan</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Coba ubah filter pencarian data transaksi keuangan
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {/* Table Footer */}
                            <TableFooter>
                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                    <TableCell
                                        colSpan={4} // Spans over 'index', 'date', 'category', 'description'
                                        className="h-12 font-semibold text-gray-700 border-t border-gray-200 rounded-xl pl-7"
                                    >
                                        {firstTotalLabel}
                                    </TableCell>

                                    {/* This TableCell is specifically for the 'incomes' column */}
                                    <TableCell className="h-12 font-semibold text-green-700 border-t border-gray-200 text-center rounded-xl">
                                        {sumOfIncome.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0, })}
                                    </TableCell>

                                    {/* This TableCell is specifically for the 'expense' column */}
                                    <TableCell className="h-12 font-semibold text-red-700 border-t border-gray-200 text-center rounded-xl">
                                        {sumOfExpense.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0, })}
                                    </TableCell>
                                </TableRow>

                                {showGrandTotal && (
                                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                        <TableCell
                                            colSpan={4}
                                            className="h-12 font-semibold text-gray-700 border-t border-gray-200 rounded-xl pl-7"
                                        >
                                            Grand Total
                                        </TableCell>
                                        <TableCell className="h-12 font-semibold text-green-700 border-t border-gray-200 text-center rounded-xl">
                                            {totalIncome ? totalIncome : "Rp 0"}
                                        </TableCell>
                                        <TableCell className="h-12 font-semibold text-red-700 border-t border-gray-200 text-center rounded-xl">
                                            {totalExpense ? totalExpense : "Rp 0"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableFooter>
                        </Table>
                    </div>

                    <DataTablePagination table={table} pageSizeOptions={[5, 10, 15, 25, 50, 100]} />
                </CardContent>
            </Card>
        </>
    )
}
