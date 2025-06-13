"use client"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

import HeroSection from "@/components/landing/HeroSection";
import FacilitySection from "@/components/landing/FacilitySection";
import EventSection from "@/components/landing/EventSection";
import DonationSection from "@/components/landing/DonationSection";
import NewsSection from "@/components/landing/NewsSection";

export default function Home() {

    return (
        <>
            <HeroSection />
            <FacilitySection />
            <EventSection />
            <DonationSection />
            <NewsSection limit={3} />
        </>
    );
}
