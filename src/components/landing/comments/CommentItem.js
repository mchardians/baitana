"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentForm } from "@/components/landing/comments/CommentForm";

export function CommentItem({
    comment,
    newsId,
    userId,
    onReply,
    isReplyingTo,
    onCancelReply,
    isLoggedIn,
    onLoginRequired,
}) {
    const [showReplyForm, setShowReplyForm] = useState(false)

    const handleReplyClick = () => {
        if (!isLoggedIn) {
            onLoginRequired()
            return
        }
        onReply(comment.id)
        setShowReplyForm(true)
    }

    const handleCancelReply = () => {
        setShowReplyForm(false)
        onCancelReply()
    }

    const handleCommentAdded = () => {
        setShowReplyForm(false)
        onCancelReply()
    }

    const isCurrentCommentBeingRepliedTo = isReplyingTo === comment.id

    return (
        <div className="flex gap-3 py-4 border-b last:border-b-0">
            <Avatar className="w-10 h-10 border">
                <AvatarImage src={comment.user.photo || "/placeholder-user.jpg"} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 grid gap-1">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">{comment.user.name}</div>
                    {comment.created_at_human && <div className="text-xs text-gray-500">{comment.created_at_human}</div>}
                </div>
                {comment.created_at && <div className="text-xs text-gray-500">{comment.created_at}</div>}
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: comment.content }} />
                <button
                    onClick={handleReplyClick}
                    className="text-sm text-[#2C3E9E] hover:underline justify-self-start"
                >
                    Balas
                </button>

                {isCurrentCommentBeingRepliedTo && (
                    <div className="mt-4 pl-4 border-l-2 border-[#2C3E9E]">
                        <CommentForm
                            newsId={newsId}
                            userId={userId}
                            parentId={comment.id}
                            onCommentAdded={handleCommentAdded}
                            onCancelReply={handleCancelReply}
                            isLoggedIn={isLoggedIn}
                            onLoginRequired={onLoginRequired}
                        />
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                newsId={newsId}
                                userId={userId}
                                onReply={onReply}
                                isReplyingTo={isReplyingTo}
                                onCancelReply={onCancelReply}
                                isLoggedIn={isLoggedIn}
                                onLoginRequired={onLoginRequired}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
