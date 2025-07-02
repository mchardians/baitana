"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Re-use iconMap from facility-info-tabs for consistency
import {
    RockingChairIcon as Chair,
    Monitor,
    Table,
    Wifi,
    AirVent,
    Clipboard,
    Lightbulb,
    Power,
    Mic,
} from "lucide-react"

const iconMap = {
    Chair: Chair,
    Monitor: Monitor,
    Table: Table,
    Wifi: Wifi,
    AirVent: AirVent,
    Clipboard: Clipboard,
    Lightbulb: Lightbulb,
    Power: Power,
    Mic: Mic,
}

export default function SimilarFacilityCard({ facility }) {
    if (!facility) return null

    const swiperNavPrevId = `swiper-button-prev-${facility.id}`
    const swiperNavNextId = `swiper-button-next-${facility.id}`
    const swiperPaginationId = `swiper-pagination-${facility.id}`

    return (
        <Card className="w-full rounded-xl overflow-hidden shadow-md mb-4 py-0 gap-4">
            <div className="relative h-[240px] overflow-hidden">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        prevEl: `.${swiperNavPrevId}`,
                        nextEl: `.${swiperNavNextId}`,
                    }}
                    pagination={{
                        el: `.${swiperPaginationId}`,
                        clickable: true,
                    }}
                    className="w-full h-full"
                >
                    {facility.allImages?.length > 0 && (
                        facility.allImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`${facility.name} image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
                <div className={`absolute inset-0 flex items-center justify-between z-10 pointer-events-none`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`${swiperNavPrevId} bg-white/80 hover:bg-white rounded-full w-8 h-8 ml-2 pointer-events-auto`}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`${swiperNavNextId} bg-white/80 hover:bg-white rounded-full w-8 h-8 mr-2 pointer-events-auto`}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
                <div className={`absolute bottom-2 left-0 right-0 flex justify-center z-10 ${swiperPaginationId} swiper-pagination-custom`} />
            </div>

            <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{facility.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(facility.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                fill={i < Math.floor(facility.rating) ? "currentColor" : "none"}
                            />
                        ))}
                    </div>
                    <span className="text-green-600">Rekomendasi untuk Kelas Praktikum</span>
                </div>

                <h4 className="font-semibold mb-2">Fasilitas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    {facility.amenities &&
                        facility.amenities.slice(0, 6).map((amenity, index) => {
                            const IconComponent = iconMap[amenity.icon]
                            return (
                                <div key={index} className="flex items-center gap-2 text-gray-700">
                                    {IconComponent && <IconComponent className="w-4 h-4 text-gray-500" />}
                                    <span>{amenity.name}</span>
                                </div>
                            )
                        })}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                        <div className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${facility?.isAvailable ? "bg-green-600" : "bg-red-600"}`}>
                            <div className={`w-1 h-1 rounded-full ${facility?.isAvailable ? "bg-green-400" : "bg-red-400"}`}></div>
                        </div>
                        <span>{facility?.isAvailable ? "Tersedia" : "Tidak Tersedia"}</span>
                    </div>
                    <Link href={`/facilities/${facility.id}`} passHref>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Pesan</Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
