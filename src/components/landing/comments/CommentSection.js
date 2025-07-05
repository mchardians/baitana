"use client"

import { useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import useComments from "@/hooks/useComments";
import { CommentItem } from "@/components/landing/comments/CommentItem";
import { CommentForm } from "@/components/landing/comments/CommentForm";
import { CommentLoginModal } from "@/components/landing/comments/CommentLoginModal";

export default function CommentSection({
    newsDetail,
    currentUserId,
    isLoggedIn: initialIsLoggedIn,
}) {
    const router = useRouter();
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

    const {
        comments,
        isLoading,
        fetchComments,
    } = useComments(newsDetail?.id);

    useEffect(() => {
        if (newsDetail?.id) {
            fetchComments(newsDetail.id);
        }
    }, [newsDetail?.id, fetchComments]);

    const handleReply = useCallback((commentId) => {
        setReplyingToCommentId(commentId)
    }, [])

    const handleCancelReply = useCallback(() => {
        setReplyingToCommentId(null)
    }, [])

    const handleLoginRequired = useCallback(() => {
        setShowLoginModal(true)
    }, [])

    const handleCommentAdded = useCallback(async () => {
        setReplyingToCommentId(null);

        await fetchComments(newsDetail.id);
        router.refresh();

        document.getElementById("comment-section")?.scrollIntoView({ behavior: "smooth" });
    }, [newsDetail?.id, fetchComments, router]);

    const handleLoginClick = useCallback(() => {
        router.push("/auth/login");
    }, [router])

    return (
        <div id="comment-section" className="px-6 py-8 lg:px-[86px] lg:pt-[64px] lg:pb-0 w-full">
            <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Komentar ({comments.length})</h1>
            <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">Tinggalkan Komentar Anda</h1>
            <div className="mb-6">
                <CommentForm
                    newsId={newsDetail.id}
                    userId={currentUserId}
                    onCommentAdded={handleCommentAdded}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={handleLoginRequired}
                />
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    <p className="text-gray-400 text-center">Memuat komentar...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-center">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            newsId={newsDetail.id}
                            userId={currentUserId}
                            onReply={handleReply}
                            isReplyingTo={replyingToCommentId}
                            onCancelReply={handleCancelReply}
                            isLoggedIn={isLoggedIn}
                            onLoginRequired={handleLoginRequired}
                        />
                    ))
                )}
            </div>

            <CommentLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginClick={handleLoginClick} />
        </div>
    )
}