"use client"

import {useCallback, useState} from "react";
import { createComment, getComments } from "@/lib/comment";
import { getCommentsIndex } from "@/lib/site-content";
import { toast } from "sonner";

export default function useComments(newsId = "") {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedComment, setSelectedComment] = useState(null)

    const fetchComments = useCallback(async (newsId = "") => {
        setIsLoading(true)
        try {
            const comments = await getCommentsIndex(newsId)
            setComments(comments)
        } catch (error) {
            toast.error("Gagal memuat data komentar")
            console.error("Fetch comments error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])


    const handleAddComment = async (newsId, values) => {
        setIsLoading(true)
        try {
            const res = await createComment(newsId, values)
            toast.success(res.message)
        } catch (error) {
            toast.error("Gagal menambahkan data komentar")
            console.log("Add comment / reply error:", error.message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        comments,
        isLoading,
        selectedComment,
        setSelectedComment,
        fetchComments,
        handleAddComment
    }
}