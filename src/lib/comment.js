import apiClient from "@/lib/apiClient";
import API from "@/lib/api";

const NEWS_API = API.news || `${process.env.NEXT_PUBLIC_API_BASE_URL}/news`;

export async function getComments(newsId = "") {
    try {
        const endpoint = `${NEWS_API}/${newsId}/comments`
        const result = await apiClient.makeRequest(endpoint, {
            method: "GET",
        })

        return result.data?.comments || []
    } catch (error) {
        console.error("Error getting user roles:", error.message)
        throw error
    }
}

export async function createComment(newsId, commentData) {
    try {
        const endpoint = `${NEWS_API}/${newsId}/comments`
        return await apiClient.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(commentData),
        });
    } catch (error) {
        console.log("Error creating comment / reply:", error.message)
        throw error
    }
}