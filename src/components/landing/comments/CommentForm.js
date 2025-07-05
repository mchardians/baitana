"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useComments from "@/hooks/useComments"
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/schemas/comment-schema";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"

export function CommentForm({
    newsId,
    userId,
    parentId = null,
    onCommentAdded,
    onCancelReply,
    isLoggedIn,
    onLoginRequired,
}) {
    const { handleAddComment } = useComments(newsId)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: "",
            user_id: userId ?? "",
            news_id: newsId ?? "",
            parent_id: parentId ?? null,
        },
    })

    useEffect(() => {
        reset({
            content: "",
            user_id: userId ?? "",
            news_id: newsId ?? "",
            parent_id: parentId ?? null,
        })
    }, [userId, newsId, parentId, reset])

    const onSubmit = async (data) => {
        if (!isLoggedIn) {
            onLoginRequired()
            return
        }

        const payload = {
            ...data,
            user_id: userId,
            news_id: newsId,
            parent_id: parentId ?? null,
        }

        try {
            await handleAddComment(newsId, payload)
            reset()

            onCommentAdded?.()
            onCancelReply?.()
        } catch (err) {
            console.error("Gagal kirim komentar", err);
        }
    }

    if (!userId || !newsId) return null

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("user_id")} value={userId} />
            <input type="hidden" {...register("news_id")} value={newsId} />
            {parentId && <input type="hidden" {...register("parent_id")} value={parentId} />}
            <div>
                <Textarea
                    {...register("content")}
                    placeholder={parentId ? "Balas komentar ini..." : "Tulis komentar Anda..."}
                    rows={parentId ? 2 : 4}
                    className="resize-y min-h-[240px] text-sm md:text-lg"
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>
            <div className="flex justify-end gap-2">
                {onCancelReply && (
                    <Button type="button" variant="ghost" onClick={onCancelReply}>
                        Batal
                    </Button>
                )}
                <Button type="submit" className="bg-[#2C3E9E] hover:bg-[#3f51b5]" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            {parentId ? "Kirim Balasan" : "Kirim Komentar"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
