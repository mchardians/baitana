"use client"

import { useState } from "react"
import Image from "next/image"
import ImageGalleryModal from "@/components/landing/facilities/ImageGalleryModal";

export default function FacilityGallery({ facility }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialImageIndex, setInitialImageIndex] = useState(0)

    if (!facility) return null

    const allImages = [
        ...(facility.cover_image ? [facility.cover_image] : []),
        ...(Array.isArray(facility.image_previews) ? facility.image_previews.map(img => img.image_path) : [])
    ];

    const openModal = (index) => {
        setInitialImageIndex(index)
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Main Image */}
                <div
                    className="relative col-span-1 md:col-span-2 lg:col-span-2 h-full rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => openModal(0)} // Index 0 for the cover image
                >
                    <Image
                        src={facility.cover_image || "/placeholder.svg"}
                        alt={`Main image of ${facility.name}`}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Thumbnail Images */}
                <div className="grid grid-cols-2 gap-4">
                    {facility.image_previews &&
                        facility.image_previews?.map((img, index) => (
                            <div
                                key={img.id}
                                className="relative h-[220px] rounded-xl overflow-hidden cursor-pointer"
                                onClick={() => openModal(index + 1)}
                            >
                                <Image
                                    src={img.image_path || "/placeholder.svg"}
                                    alt={`Thumbnail ${index + 1} of ${facility.name}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                </div>
            </div>

            {/* Image Gallery Modal */}
            <ImageGalleryModal
                images={allImages}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialIndex={initialImageIndex}
            />
        </>
    )
}
