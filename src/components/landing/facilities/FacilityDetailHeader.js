"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, CircleHelpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookingGuideModal from "@/components/landing/facilities/BookingGuideModal";

export default function FacilityDetailHeader({ facility }) {
    const [isBookingGuideModalOpen, setIsBookingGuideModalOpen] = useState(false);
    if (!facility) return null

    return (
        <header className="bg-white py-4 px-6 lg:px-[86px] border-b flex items-center justify-between sticky top-0 z-10">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
            </Link>
            <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className={`w-4 h-4 mr-1 ${facility.isAvailable ? "text-green-500" : "text-red-500"}`} />
                    <span>{facility.isAvailable ? "Tersedia" : "Tidak Tersedia"}</span>
                </div>
                <Button variant="outline"
                    className="bg-[#2C3E9E] hover:bg-[#3f51b5] text-white hover:text-white"
                    onClick={() => setIsBookingGuideModalOpen(true)}>
                        <CircleHelpIcon className="w-4 h-4" />
                        <span>Panduan Pemesanan</span>
                </Button>
            </div>
            {/* Booking Guide Modal */}
            <BookingGuideModal isOpen={isBookingGuideModalOpen} onClose={() => setIsBookingGuideModalOpen(false)} />
        </header>
    )
}