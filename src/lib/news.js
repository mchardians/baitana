import apiClient from "@/lib/apiClient";
import API from "@/lib/api";

const NEWS_API = API.news || `${process.env.NEXT_PUBLIC_API_BASE_URL}/news`;

export async function getNews() {
    try {
        const result = await apiClient.makeRequest(NEWS_API, {
            method: "GET",
        });

        return result.data?.news || []
    } catch (error) {
        console.log("Error getting news: ", error.message)
        throw error
    }
}

export async function getNewsByParam(param = "status", value = "") {
    try {
        const query = `${encodeURIComponent(param)}=${encodeURIComponent(value)}`;
        const url = `${NEWS_API}?${query}`;

        const result = await apiClient.makeRequest(url, {
            method: "GET",
        });

        return result.data?.news || []
    } catch (error) {
        console.log("Error getting news: ", error.message)
        throw error
    }
}

export async function createNews(newsData) {
    try {
        return await apiClient.makeRequest(NEWS_API, {
            method: "POST",
            body: newsData,
        });
    } catch (error) {
        console.log("Error creating news:", error.message)
        throw error
    }
}

export async function updateNews(id, newsData) {
    try {
        newsData.append("_method", "PUT")
        return await apiClient.makeRequest(`${NEWS_API}/${id}`, {
            method: "POST",
            body: newsData,
        });
    } catch (error) {
        console.log("Error updating news:", error.message)
        throw error
    }
}

export async function deleteNews(id) {
    try {
        return await apiClient.makeRequest(`${NEWS_API}/${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.log("Error deleting news:", error.message)
        throw error
    }
}