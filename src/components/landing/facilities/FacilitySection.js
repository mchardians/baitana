"use client"

import FacilitiesCarousel from "@/components/landing/facilities/FacilityCarousel";

export default function FacilitySection() {
    return (
        <section id="facilities" className="px-6 py-12 lg:px-[86px] lg:pt-[92px] lg:pb-0">
            <h1 className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Fasilitas Masjid</h1>
            <h1 className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-12">Beberapa layanan yang dapat dinikmati oleh para pengunjung.</h1>

            <FacilitiesCarousel />
        </section>
    )
}