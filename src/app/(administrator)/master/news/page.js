"use client"

import useNews from "@/hooks/useNews";
import { useEffect, useState } from "react";
import { DataTable } from "@/app/(administrator)/master/news/data-table";
import { createColumns } from "@/app/(administrator)/master/news/column";
import { NewsForm } from "@/components/news/NewsForm";
import { NewsImagePreviewModal } from "@/components/NewsImagePreviewModal";
import { NewsDetailModal } from "@/components/news/DetailModal";
import DeleteAlert from "@/components/news/DeleteAlert";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"

export default function DashboardNewsPage() {
    const [activeTab, setActiveTab] = useState("published");

    const {
        news,
        newsCategories,
        isLoading,
        isModalOpen,
        setIsModalOpen,
        isPreviewImageModalOpen,
        isDetailModalOpen,
        isDeleteAlertOpen,
        setIsDeleteAlertOpen,
        selectedNews,
        selectedNewsForDetail,
        imageToPreview,
        fetchNews,
        fetchNewsCategories,
        handleAddNews,
        handleEditNews,
        handleDeleteNews,
        openAddModal,
        openEditModal,
        openPreviewImageModal,
        closePreviewImageModal,
        openDetailModal,
        closeDetailModal,
        openDeleteAlert,
    } = useNews(activeTab);

    useEffect(() => {
        fetchNews()
        fetchNewsCategories()
    }, [fetchNews, fetchNewsCategories])

    const columns = createColumns(openEditModal, openPreviewImageModal, openDetailModal, openDeleteAlert)

    return (
        <div className="container mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Berita</h1>
                <p className="text-lg text-muted-foreground">
                    Kelola informasi berita, unggah gambar, dan atur kategori berita dengan mudah melalui sistem.
                </p>
            </div>

            <Tabs defaultValue="published" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger
                        value="published"
                        className="data-[state=active]:bg-[#2C3E9E] data-[state=active]:text-white px-4 py-1.5 text-sm rounded-md transition-all"
                    >
                        Published
                    </TabsTrigger>
                    <TabsTrigger
                        value="drafted"
                        className="data-[state=active]:bg-[#2C3E9E] data-[state=active]:text-white px-4 py-1.5 text-sm rounded-md transition-all"
                    >
                        Drafted
                    </TabsTrigger>
                    <TabsTrigger
                        value="archived"
                        className="data-[state=active]:bg-[#2C3E9E] data-[state=active]:text-white px-4 py-1.5 text-sm rounded-md transition-all"
                    >
                        Archived
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="published">
                    <DataTable
                        columns={columns}
                        data={news}
                        isLoading={isLoading}
                        onAddNew={openAddModal}
                    />
                </TabsContent>

                <TabsContent value="drafted">
                    <DataTable
                        columns={columns}
                        data={news}
                        isLoading={isLoading}
                        onAddNew={openAddModal}
                    />
                </TabsContent>

                <TabsContent value="archived">
                    <DataTable
                        columns={columns}
                        data={news}
                        isLoading={isLoading}
                        onAddNew={openAddModal}
                    />
                </TabsContent>
            </Tabs>

            <NewsForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedNews={selectedNews}
                handleAddNews={handleAddNews}
                handleEditNews={handleEditNews}
                isLoading={isLoading}
                newsCategories={newsCategories}
            />

            <NewsImagePreviewModal
                isOpen={isPreviewImageModalOpen}
                onClose={closePreviewImageModal}
                thumbnailUrl={imageToPreview}
            />

            <NewsDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                newsData={selectedNewsForDetail}
            />

            <DeleteAlert
                isDeleteAlertOpen={isDeleteAlertOpen}
                setIsDeleteAlertOpen={setIsDeleteAlertOpen}
                selectedNews={selectedNews}
                handleDeleteNews={handleDeleteNews}
                isLoading={isLoading}
            />
        </div>
    );
}
