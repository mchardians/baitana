"use client"

import React from 'react'
import { useMemo } from "react";
import useSiteContent from "@/hooks/useSiteContent";
import FacilityDetailHeader from "@/components/landing/facilities/FacilityDetailHeader";
import FacilityGallery from "@/components/landing/facilities/FacilityGallery";
import FacilityInfoTabs from "@/components/landing/facilities/FacilityInfoTabs";
import FacilityBookingCard from "@/components/landing/facilities/FacilityBookingCard";
import SimilarFacilitiesCarousel from "@/components/landing/facilities/SimilarFacilityCarousel";
import { Star } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FacilityDetailPage({ params }) {
    const { facilities, isLoading } = useSiteContent()
    const resolvedParams = React.use(params);
    const facilityId = Number(resolvedParams.id);

    const facility = useMemo(() => {
        if (facilities.length > 0 && facilityId) {
            const foundFacility = facilities.find((item) => item.id === facilityId);

            if (foundFacility) {
                return {
                    ...foundFacility,
                    isAvailable: foundFacility.status === "available",
                    amenities: [
                        { icon: "Chair", name: "Kursi" },
                        { icon: "Monitor", name: "Layar Proyektor" },
                        { icon: "Wifi", name: "Wifi" },
                        { icon: "AirVent", name: "Ac" },
                        { icon: "Clipboard", name: "Papan Tulis" },
                        { icon: "Lightbulb", name: "Lampu" },
                        { icon: "Power", name: "Stopkontak" },
                    ],
                };
            }
        }
        return null;
    }, [facilities, facilityId]);

    const otherFacilities = facilities
        .filter((item) => item.id !== facilityId)
        .map((item) => {
            const cover = item.cover_image ? [item.cover_image] : []
            const previews = (item.image_previews || [])
                .map((img) => img.image_path)
                .filter(Boolean)

            return {
                ...item,
                isAvailable: item.status === "available",
                amenities: [
                    { icon: "Chair", name: "Kursi" },
                    { icon: "Monitor", name: "Layar Proyektor" },
                    { icon: "Wifi", name: "Wifi" },
                    { icon: "AirVent", name: "Ac" },
                    { icon: "Clipboard", name: "Papan Tulis" },
                    { icon: "Lightbulb", name: "Lampu" },
                    { icon: "Power", name: "Stopkontak" },
                ],
                allImages: [...cover, ...previews],
            }
        })

    if (isLoading) {
        return (
            <section>
                <div className="flex-grow flex flex-col justify-center items-center h-full">
                    <div className="px-6 py-12 lg:px-[86px] lg:py-[92px] w-full text-center">
                        <LoadingSpinner/>
                    </div>
                </div>
            </section>
        );
    }

    if (!isLoading && !facility) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center h-full">
                <p className="text-xl text-gray-600">Fasilitas tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="flex-grow bg-gray-50">
            <FacilityDetailHeader facility={facility} />

            <main className="px-6 py-8 lg:px-[86px]">
                <nav className="text-sm text-gray-500 mb-4">Home &gt; {facility.name}</nav>

                <div className="flex flex-col">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(facility.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                        fill={i < Math.floor(facility.rating) ? "currentColor" : "none"}
                                    />
                                ))}
                            </div>
                            <span>Rekomendasi untuk Kelas Teori</span>
                            <span className="mx-1">•</span>
                            <span>{facility.reviews}x dipinjam</span>
                        </div>

                        <FacilityGallery facility={facility} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-8">
                    <div className="flex-1">
                        <FacilityInfoTabs facility={facility} />
                    </div>

                    <div className="w-full lg:w-[420px]">
                        <FacilityBookingCard facility={facility} />
                    </div>
                </div>

                {otherFacilities.length > 0 && (
                    <div className="mt-12">
                        <SimilarFacilitiesCarousel facilities={otherFacilities} />
                    </div>
                )}
            </main>
        </div>
    )
}
