const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export async function getPrayerTimes() {
    try {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')

        // 1634 adalah kode untuk Kota Malang
        const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1634/${year}/${month}/${day}`)
        const result = await response.json()

        if (result.status && result.data) {
            return result?.data?.jadwal || []
        }
    } catch (error) {
        console.error('Error getting prayer times:', error)
    }
}

export async function getFacilities() {
    try {
        const res = await fetch(`${API_URL}/facilities`);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        const result = await res.json();

        if (result.status && result.data) {
            return {
                facilities: result.data.facilities || [],
                message: result.message || null
            };
        }
    } catch (error) {
        console.error("Error fetching facilities:", error);
        return {
            facilities: [],
            message: "Failed to fetch facilities"
        };
    }
}

export async function getNews() {
    try {
        const res = await fetch(`${API_URL}/news/published`);

        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        const result = await res.json();

        if (result.status && result.data) {
            return {
                news: result.data.news || [],
                message: result.message || null
            };
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        return {
            news: [],
            serverTime: null,
            message: "Failed to fetch news"
        };
    }
}

