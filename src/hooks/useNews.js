"use client"

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getNews, createNews, updateNews, deleteNews } from "@/lib/news";
import { getNewsCategories } from "@/lib/news-category";

export default function useFacilities() {
    const [news, setNews] = useState([]);
    const [newsCategories, setNewsCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isPreviewImageModalOpen, setIsPreviewImageModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedNewsForDetail, setSelectedNewsForDetail] = useState(null);
    const [imageToPreview, setImageToPreview] = useState(null);

    const fetchNews = useCallback (async () => {
        setIsLoading(true);
        try {
            const news = await getNews();
            setNews(news);
        } catch (error) {
            toast.error("Gagal memuat data news.");
            console.error("Fetch news error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchNewsCategories = useCallback(async () => {
        setIsLoading(true)
        try {
            const newsCategories = await getNewsCategories()
            setNewsCategories(newsCategories)
        } catch (error) {
            toast.error("Gagal memuat data kategori berita")
            console.error("Fetch news categories error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleAddNews = async (value) => {
        setIsLoading(true);
        try {
            const res = await createNews(value);
            toast.success(res.message);
            setIsModalOpen(false);
            await fetchNews();
        } catch (error) {
            toast.error("Gagal menambahkan data berita")
            console.log("Add news error:", error.message)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditNews = async (value) => {
        if (!selectedNews) return

        setIsLoading(true);
        try {
            const res = await updateNews(selectedNews.id, value);
            toast.success(res.message);
            setIsModalOpen(false);
            await fetchNews();
        } catch (error) {
            toast.error("Gagal memperbarui data berita")
            console.log("Edit news error:", error.message)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteNews = async () => {
        if (!selectedNews) return

        setIsLoading(true);
        try {
            const res = await deleteNews(selectedNews.id);
            toast.success(res.message);
            setIsDeleteAlertOpen(false);
            await fetchNews();
        } catch (error) {
            toast.error("Gagal menghapus data berita")
            console.log("Delete news error:", error?.originalError?.message)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    const openAddModal = () => {
        setSelectedNews(null)
        setIsModalOpen(true)
    }

    const openEditModal = (news) => {
        setSelectedNews(news)
        setIsModalOpen(true)
    }

    const openDeleteAlert = (news) => {
        setSelectedNews(news)
        setIsDeleteAlertOpen(true)
    }

    const openPreviewImageModal = (news) => {
        if (news && news.thumbnail) {
            setImageToPreview(news.thumbnail);
            setIsPreviewImageModalOpen(true)
        } else {
            toast.info("Tidak ada bukti transaksi untuk ditampilkan.");
        }
    };

    const closePreviewImageModal = () => {
        setIsPreviewImageModalOpen(false);
        setImageToPreview(null);
    };

    const openDetailModal = (newsItem) => {
        setSelectedNewsForDetail(newsItem);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedNewsForDetail(null);
    }

    return {
        news,
        newsCategories,
        isLoading,
        isModalOpen,
        setIsModalOpen,
        isPreviewImageModalOpen,
        setIsPreviewImageModalOpen,
        isDetailModalOpen,
        setIsDetailModalOpen,
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
    }
}