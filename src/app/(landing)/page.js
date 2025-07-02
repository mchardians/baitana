"use client"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

import HeroSection from "@/components/landing/hero/HeroSection";
import FacilitySection from "@/components/landing/facilities/FacilitySection";
import FacilitiesCarousel from "@/components/landing/facilities/FacilityCarousel";
import EventSection from "@/components/landing/event/EventSection";
import DonationSection from "@/components/landing/donation/DonationSection";
import NewsSection from "@/components/landing/news/NewsSection";

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
