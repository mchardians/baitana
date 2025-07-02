"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import SimilarFacilityCard from "@/components/landing/facilities/SimilarFacilityCard"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function SimilarFacilitiesCarousel({ facilities }) {
    if (!facilities || facilities.length === 0) {
        return null
    }

    return (
        <div className="w-full py-8 relative">
            <h2 className="text-3xl font-bold mb-6">Fasilitas Lainnya</h2>
            {/* Custom navigation buttons */}
            <button
                className="swiper-prev-btn absolute top-1/2 left-[-50px] -translate-y-1/2 z-20 bg-white border shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                aria-label="Previous"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                className="swiper-next-btn absolute top-1/2 right-[-50px] -translate-y-1/2 z-20 bg-white border shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                aria-label="Next"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <div className={`absolute top-24 left-0 right-0 flex justify-center z-10 swiper-pagination facility-carousel-pagination`} />
            <div className="py-4">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".swiper-next-btn",
                        prevEl: ".swiper-prev-btn",
                    }}
                    pagination={{
                        el: ".swiper-pagination",
                        clickable: true
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
                    }}
                    className="rounded-xl"
                >
                    {facilities.map((facility) => (
                        <SwiperSlide key={facility.id} className="rounded-xl">
                            <SimilarFacilityCard facility={facility} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
