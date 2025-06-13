"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {getNews, getPrayerTimes} from "@/lib/site-content";
import { getFacilities } from "@/lib/site-content";

export default function useSiteContent() {
    const [prayerTimes, setPrayerTimes] = useState([])
    const [facilities, setFacilities ] = useState([])
    const [news, setNews] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    // const [isModalOpen, setIsModalOpen] = useState(false)
    // const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

    const fetchPrayerTimes = useCallback(async () => {
        setIsLoading(true)
        try {
            const prayerTimes  = await getPrayerTimes()
            setPrayerTimes(prayerTimes)
        } catch (error) {
            toast.error("Gagal memuat data prayer times")
            console.error("Fetch prayer times error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchFacilities = useCallback(async () => {
        setIsLoading(true)
        try {
            const resultFacilities = await getFacilities()
            setFacilities(resultFacilities.facilities)
        } catch (error) {
            toast.error("Gagal memuat data fasilitas")
            console.error("Fetch facilities error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchNews = useCallback(async () => {
        setIsLoading(true)
        try {
            const resultNews = await getNews()
            setNews(resultNews.news)
        } catch (error) {
            toast.error("Gagal memuat data berita")
            console.error("Fetch news error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        prayerTimes,
        facilities,
        news,
        isLoading: isLoading,
        fetchPrayerTimes,
        fetchFacilities,
        fetchNews
    }
}
