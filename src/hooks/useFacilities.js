"use client"

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getFacilities, createFacility, updateFacility, deleteFacility } from "@/lib/facility";

export default function useFacilities() {
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isPreviewImageModalOpen, setIsPreviewImageModalOpen] = useState(false);
    const [imagesToPreview, setImagesToPreview] = useState({ coverImage: null, previewImages: [] });
    const [selectedFacility, setSelectedFacility] = useState(null);

    const fetchFacilities = useCallback (async () => {
        setIsLoading(true);
        try {
            const facilities = await getFacilities();
            setFacilities(facilities);
        } catch (error) {
            toast.error("Gagal memuat data facilities.");
            console.error("Fetch facilities error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddFacility = async (value) => {
        setIsLoading(true);
        try {
            const res = await createFacility(value);
            toast.success(res.message);
            setIsModalOpen(false);
            await fetchFacilities();
        } catch (error) {
            toast.error("Gagal menambahkan data facility")
            console.log("Add facility error:", error.message)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditFacility = async (value) => {
        if (!selectedFacility) return

        setIsLoading(true);
        try {
            const res = await updateFacility(selectedFacility.id, value);
            toast.success(res.message);
            setIsModalOpen(false);
            await fetchFacilities();
        } catch (error) {
            toast.error("Gagal memperbarui data facility")
            console.log("Edit facility error:", error.message)
            console.log(error)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteFacility = async () => {
        if (!selectedFacility) return

        setIsLoading(true);
        try {
            const res = await deleteFacility(selectedFacility.id);
            toast.success(res.message);
            setIsDeleteAlertOpen(false);
            await fetchFacilities();
        } catch (error) {
            toast.error("Gagal menghapus data facility")
            console.log("Delete facility error:", error?.originalError?.message)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const openAddModal = () => {
        setSelectedFacility(null)
        setIsModalOpen(true)
    }

    const openEditModal = (facility) => {
        setSelectedFacility(facility)
        setIsModalOpen(true)
    }

    const openDeleteAlert = (facility) => {
        setSelectedFacility(facility)
        setIsDeleteAlertOpen(true)
    }

    const openPreviewImagesModal = (facility) => {
        setImagesToPreview({
            coverImage: facility.cover_image || null,
            previewImages: Array.isArray(facility.image_previews) ? facility.image_previews : []
        });
        setIsPreviewImageModalOpen(true);
    };

    const closePreviewImagesModal = () => {
        setIsPreviewImageModalOpen(false);
        setImagesToPreview({ coverImage: null, previewImages: [] });
    };

    return {
        facilities,
        isLoading,
        isModalOpen,
        setIsModalOpen,
        isPreviewImageModalOpen,
        setIsPreviewImageModalOpen,
        isDeleteAlertOpen,
        setIsDeleteAlertOpen,
        imagesToPreview,
        selectedFacility,
        fetchFacilities,
        handleAddFacility,
        handleEditFacility,
        handleDeleteFacility,
        openAddModal,
        openEditModal,
        openPreviewImagesModal,
        closePreviewImagesModal,
        openDeleteAlert,
    }
}