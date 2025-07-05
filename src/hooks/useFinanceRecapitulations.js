"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { getFinanceRecapitulations, exportToExcel, exportToPdf } from "@/lib/finance-recapitulation"

export default function useFinanceRecapitulations() {
    const [financeRecapitulations, setFinanceRecapitulations] = useState([])
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [currentFilterDates, setCurrentFilterDates] = useState({
        startDate: null,
        endDate: null,
    });

    const fetchFinanceRecapitulations = useCallback(async (startDate, endDate) => {
        setIsLoading(true)
        try {
            const financeRecapitulations = await getFinanceRecapitulations(startDate, endDate)

            setFinanceRecapitulations(financeRecapitulations?.recapitulations ?? []);
            setTotalIncome(financeRecapitulations?.accumulations?.overall?.total_income ?? "Rp. 0");
            setTotalExpense(financeRecapitulations?.accumulations?.overall?.total_expense ?? "Rp. 0");
        } catch (error) {
            toast.error("Gagal memuat data finance recapitulations.")
            console.error("Fetch finance recapitulations error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleExportExcel = useCallback(async () => { // <--- MAKE ASYNC
        setIsLoading(true); // Set loading true
        try {
            exportToExcel(currentFilterDates.startDate, currentFilterDates.endDate);
            toast.success("Mempersiapkan unduhan Excel...");
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Error during Excel export:", error);
            toast.error("Gagal memulai unduhan Excel.");
        } finally {
            setIsLoading(false)
        }
    }, [currentFilterDates]);

    const handleExportPdf = useCallback(async () => { // <--- MAKE ASYNC
        setIsLoading(true);
        try {
            exportToPdf(currentFilterDates.startDate, currentFilterDates.endDate);
            toast.success("Mempersiapkan unduhan PDF...");
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Error during PDF export:", error);
            toast.error("Gagal memulai unduhan PDF.");
        } finally {
            setIsLoading(false)
        }
    }, [currentFilterDates]);

    const handleApplyDateFilter = (dates) => {
        setCurrentFilterDates(dates)
    }

    return {
        financeRecapitulations,
        totalIncome,
        totalExpense,
        isLoading,
        currentFilterDates,
        fetchFinanceRecapitulations,
        handleExportExcel,
        handleExportPdf,
        handleApplyDateFilter
    }
}
