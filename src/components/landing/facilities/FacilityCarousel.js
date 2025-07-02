
"use client"

import useSiteContent from "@/hooks/useSiteContent";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FacilitiesCarousel() {
    const { facilities, isLoading } = useSiteContent()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const mappedFacilities = facilities.map((facility) => ({
        ...facility,
        isAvailable: facility.status === "available"
    }))

    if (isLoading) {
        return (
            <section>
                <div className="px-6 py-12 lg:px-[86px] lg:py-[92px] w-full text-center">
                    <LoadingSpinner/>
                </div>
            </section>
        );
    }

    return (
        <div className="w-full">
            {mounted && (
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                    }}
                    className="rounded-xl"
                >
                    {mappedFacilities.map((facility) => (
                        <SwiperSlide key={facility.id}>
                            <FacilityCard facility={facility} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}

function FacilityCard({ facility }) {
    return (
        <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-lg group py-0">
            <div className="relative w-full h-full">
                <Image
                    src={facility?.cover_image || "/placeholder.svg"}
                    alt={`Image of ${facility?.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 z-0"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex items-end justify-between z-20">
                    <div>
                        <h3 className="text-xl font-bold mb-1">{facility?.name}</h3>
                        <div className="flex items-center text-sm">
                            <div className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${facility?.isAvailable ? "bg-green-800" : "bg-red-800"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${facility?.isAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
                            </div>
                            <span>{facility?.isAvailable ? "Tersedia" : "Tidak Tersedia"}</span>
                        </div>
                    </div>
                    <Link
                        href={`/facilities/${facility?.id ?? ""}`}
                        className="rounded-lg w-10 h-10 bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                        aria-label={`View details for ${facility?.name}`}
                    >
                        <ArrowUpRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}