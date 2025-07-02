"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function ImageGalleryModal({ images, isOpen, onClose, initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
        }
    }, [isOpen, initialIndex])

    const totalImages = images.length

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages)
    }

    if (!isOpen || !images || images.length === 0) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full h-fit p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                <DialogTitle className="sr-only">Image Gallery</DialogTitle>
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={images[currentIndex] || "/placeholder.svg"}
                        alt={`Gallery image ${currentIndex + 1}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full object-cover rounded-lg"
                    />

                    {totalImages > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 z-10"
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 z-10"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}

                    {/*<Button*/}
                    {/*    variant="ghost"*/}
                    {/*    size="icon"*/}
                    {/*    className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full w-10 h-10 z-10"*/}
                    {/*    onClick={onClose}*/}
                    {/*    aria-label="Close gallery"*/}
                    {/*>*/}
                    {/*    <X className="w-6 h-6" />*/}
                    {/*</Button>*/}
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full w-10 h-10 z-10 cursor-pointer"
                            aria-label="Close gallery"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </DialogClose>

                    {totalImages > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
                            {currentIndex + 1} / {totalImages}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

