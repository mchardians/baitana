"use client"

import useFacilities from "@/hooks/useFacilities";
import { useEffect } from "react";
import { DataTable } from "@/app/(administrator)/master/facilities/data-table";
import { createColumns } from "@/app/(administrator)/master/facilities/column";
import { FacilityForm } from "@/components/facilities/FacilityForm";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import DeleteAlert from "@/components/facilities/DeleteAlert";


export default function FacilityPage() {

    const {
        facilities,
        isLoading,
        isModalOpen,
        setIsModalOpen,
        isPreviewImageModalOpen,
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
    } = useFacilities();

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities])

    const columns = createColumns(openEditModal, openDeleteAlert, openPreviewImagesModal)

    return (
        <div className="container mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Fasilitas</h1>
                <p className="text-lg text-muted-foreground">Kelola data fasilitas dan statusnya dalam sistem dengan mudah</p>
            </div>

            <DataTable
                columns={columns}
                data={facilities}
                isLoading={isLoading}
                onAddNew={openAddModal}
            />

            <FacilityForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedFacility={selectedFacility}
                handleAddFacility={handleAddFacility}
                handleEditFacility={handleEditFacility}
                isLoading={isLoading}
            />

            <ImagePreviewModal
                isOpen={isPreviewImageModalOpen} // Mengontrol visibilitas modal
                onClose={closePreviewImagesModal} // Fungsi untuk menutup modal
                images={imagesToPreview} // Array gambar yang akan ditampilkan
            />

            <DeleteAlert
                isDeleteAlertOpen={isDeleteAlertOpen}
                setIsDeleteAlertOpen={setIsDeleteAlertOpen}
                selectedFacility={selectedFacility}
                handleDeleteFacility={handleDeleteFacility}
                isLoading={isLoading}
            />
        </div>
    );
}
