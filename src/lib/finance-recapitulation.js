import apiClient from "@/lib/apiClient";
import API from "@/lib/api";

const FINANCE_RECAPITULATIONS_API = API.finance_recapitulations || `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/recapitulations`;

const token = apiClient.getToken();

export async function getFinanceRecapitulations(startDate = "", endDate = "") {
    try {
        const queryParams = new URLSearchParams();

        let url = FINANCE_RECAPITULATIONS_API;

        if (startDate && endDate) {
            queryParams.append("date_range[between]", `${startDate},${endDate}`);
        }

        if (queryParams.toString()) {
            url = `${url}?${queryParams.toString()}`;
        }

        const result = await apiClient.makeRequest(url, {
            method: "GET",
        })

        return {
            recapitulations: result.data.finance_recapitulations,
            accumulations: result.data.finance_accumulations
        };
    } catch (error) {
        console.error("Error getting finance recapitulations:", error.message)
        throw error
    }
}

export async function exportToExcel(startDate = "", endDate = "") {
    try {
        let exportUrl = `${FINANCE_RECAPITULATIONS_API}/export?format=xlsx`;

        const queryParams = new URLSearchParams();

        if (startDate && endDate) {
            queryParams.append("date_range[between]", `${startDate},${endDate}`);
        }

        if (queryParams.toString()) {
            exportUrl = `${url}&${queryParams.toString()}`;
        }

        const response = await fetch(exportUrl, {
            method: 'GET',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }
    } catch (error) {
        console.error("Error getting finance recapitulations:", error.message)
        throw error
    }
}

export async function exportToPdf(startDate = "", endDate = "") {
    try {
        let exportUrl = `${FINANCE_RECAPITULATIONS_API}/export?format=pdf`;

        const queryParams = new URLSearchParams();

        if (startDate && endDate) {
            queryParams.append("date_range[between]", `${startDate},${endDate}`);
        }

        if (queryParams.toString()) {
            exportUrl = `${url}&${queryParams.toString()}`;
        }

        window.open(exportUrl, '_blank');
    } catch (error) {
        console.error("Error getting finance recapitulations:", error.message)
        throw error
    }
}
