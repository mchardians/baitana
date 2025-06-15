import apiClient from "@/lib/apiClient";
import API from "@/lib/api";

const FACILITIES_API = API.facilities || `${process.env.NEXT_PUBLIC_API_BASE_URL}/facilities`;

export async function getFacilities() {
    try {
        const result = await apiClient.makeRequest(FACILITIES_API, {
            method: "GET",
        });

        return result.data?.facilities || []
    } catch (error) {
        console.log("Error getting facilities: ", error.message)
        throw error
    }
}

export async function
createFacility(facilityData) {
    try {
        return await apiClient.makeRequest(FACILITIES_API, {
            method: "POST",
            body: facilityData,
        });
    } catch (error) {
        console.log("Error creating facility:", error.message)
        throw error
    }
}

export async function updateFacility(id, facilityData) {
    try {
        facilityData.append("_method", "PUT")
        return await apiClient.makeRequest(`${FACILITIES_API}/${id}`, {
            method: "POST",
            body: facilityData,
        });
    } catch (error) {
        console.log("Error updating facility:", error.message)
        throw error
    }
}

export async function deleteFacility(id) {
    try {
        return await apiClient.makeRequest(`${FACILITIES_API}/${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.log("Error deleting facility:", error.message)
        throw error
    }
}