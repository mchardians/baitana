"use client"

import { useEffect } from "react"
import useFinanceRecapitulations from "@/hooks/useFinanceRecapitulations";
import { DataTable } from "@/app/(administrator)/finance/recapitulations/data-table";
import { createColumns } from "@/app/(administrator)/finance/recapitulations/column";

export default function FinanceRecapitulationsPage() {
    const {
        financeRecapitulations,
        totalIncome,
        totalExpense,
        isLoading,
        currentFilterDates,
        fetchFinanceRecapitulations,
        handleApplyDateFilter
    } = useFinanceRecapitulations();

    useEffect(() => {
        const { startDate, endDate } = currentFilterDates;
        fetchFinanceRecapitulations(startDate, endDate);
    }, [currentFilterDates, fetchFinanceRecapitulations]);

    const columns = createColumns()

    return (
        <div className="container mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Rekapitulasi Keuangan</h1>
                <p className="text-lg text-muted-foreground">Lihat ringkasan dan analisis lengkap dari seluruh aktivitas keuangan Anda.</p>
            </div>

            <DataTable
                columns={columns}
                data={financeRecapitulations}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                isLoading={isLoading}
                onDateRangeChange={handleApplyDateFilter}
            />
        </div>
    )
}
