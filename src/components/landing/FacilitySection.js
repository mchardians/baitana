"use client"

import {useEffect, useState} from "react";
import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import Image from "next/image";
import useSiteContent from "@/hooks/useSiteContent";

export default function FacilitySection() {
    const { facilities, isLoading, fetchFacilities } = useSiteContent()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetchFacilities()
    }, [fetchFacilities])

    const mappedFacilities = facilities.map((facility) => ({
        ...facility,
        isAvailable: facility.status === "available"
    }))

    return (
        <section id="facilities" className="px-6 py-12 lg:px-[86px] lg:pt-[92px] lg:pb-0">
            <div className="container">
                <h1 className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Fasilitas Masjid</h1>
                <h1 className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-12">Beberapa layanan yang dapat dinikmati oleh para pengunjung.</h1>

                <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-7 justify-between">
                    <div data-aos="fade-up" className="bg-white border border-black rounded-[30px] p-4 text-[#2C3E9E]">
                        <h1 className="text-xl lg:text-[28px] mb-3 lg:mb-6">Cara Reservasi</h1>
                        <div className="flex flex-col items-center gap-1 lg:gap-3">
                            <div className="flex items-center justify-between gap-2 lg:gap-5">
                                <div className="relative">
                                    <div className="bg-[#2C3E9E] w-5 h-5 lg:w-7 lg:h-7 rounded-full relative text-white">
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm lg:text-lg">1</span>
                                    </div>
                                </div>
                                <div
                                    className="p-2 rounded-[16px] text-white w-full flex-grow"
                                    style={{
                                        backgroundImage: 'linear-gradient(to bottom right, rgba(39, 53, 158, 1) 0%, rgba(44, 73, 158, 0.55) 100%)',
                                    }}
                                >
                                    <h1 className="text-sm lg:text-lg">Memilih fasilitas</h1>
                                    <p className="text-xs lg:text-sm text-justify">Accumsan accumsan lacus maximus ex maximus elementum bibendum cursus molestie felis.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 lg:gap-5">
                                <div className="relative">
                                    <div className="bg-[#2C3E9E] w-5 h-5 lg:w-7 lg:h-7 rounded-full relative text-white">
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm lg:text-lg">2</span>
                                    </div>
                                </div>
                                <div
                                    className="p-2 rounded-[16px] text-white w-full flex-grow"
                                    style={{
                                        backgroundImage: 'linear-gradient(to bottom right, rgba(39, 53, 158, 1) 0%, rgba(44, 73, 158, 0.55) 100%)',
                                    }}
                                >
                                    <h1 className="text-sm lg:text-lg">Mengisi formulir</h1>
                                    <p className="text-xs lg:text-sm text-justify">Accumsan accumsan lacus maximus ex maximus elementum bibendum cursus molestie felis.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 lg:gap-5">
                                <div className="relative">
                                    <div className="bg-[#2C3E9E] w-5 h-5 lg:w-7 lg:h-7 rounded-full relative text-white">
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm lg:text-lg">3</span>
                                    </div>
                                </div>
                                <div
                                    className="p-2 rounded-[16px] text-white w-full flex-grow"
                                    style={{
                                        backgroundImage: 'linear-gradient(to bottom right, rgba(39, 53, 158, 1) 0%, rgba(44, 73, 158, 0.55) 100%)',
                                    }}
                                >
                                    <h1 className="text-sm lg:text-lg">Menunggu konfirmasi admin</h1>
                                    <p className="text-xs lg:text-sm text-justify">Accumsan accumsan lacus maximus ex maximus elementum bibendum cursus molestie felis.</p>
                                </div>
                            </div>
                            <Link href="" className="text-sm lg:text-[16px] text-[#2C3E9E] border border-[#2C3E9E] hover:bg-[#2C3E9E] hover:text-white transition-colors duration-300 py-1 px-4 lg:px-6 rounded-2xl w-fit mt-2 lg:mt-4">Reservasi Fasilitas</Link>
                        </div>
                    </div>
                    <div data-aos="fade-left" className="w-full lg:w-1/2">
                        {mounted && (
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={30}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false,
                                }}
                                className="h-full w-full rounded-3xl shadow-lg"
                            >
                                {mappedFacilities.map((facility, index) => (
                                    <SwiperSlide key={facility.id}>
                                        <div className={`overflow-hidden bg-white h-full relative ${facility.isAvailable ? "group" : ""}`}>
                                            {/*/!* Hover Overlay with Reservation Button - Only for Available Facilities *!/*/}
                                            {/*{facility.isAvailable && (*/}
                                            {/*    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 ease-in-out z-20">*/}
                                            {/*        <Link*/}
                                            {/*            href={`/reservasi/${facility.id}`}*/}
                                            {/*            className="bg-[#2C3E9E] hover:bg-[#1A237E] text-white font-bold py-2 px-6 rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out"*/}
                                            {/*        >*/}
                                            {/*            Reservasi Sekarang*/}
                                            {/*        </Link>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}

                                            {/* Reservation Button Solutions for Both Desktop and Mobile */}
                                            {facility.isAvailable && (
                                                <>
                                                    {/* Desktop: Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transition-all duration-300 ease-in-out z-20">
                                                        <Link
                                                            href={`/reservasi/${facility.id}`}
                                                            className="bg-[#2C3E9E] hover:bg-[#3f51b5] text-white font-bold py-2 px-6 rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out"
                                                        >
                                                            Reservasi Sekarang
                                                        </Link>
                                                    </div>

                                                    {/* Mobile: Always Visible Button */}
                                                    {/*<div className="absolute bottom-4 right-4 md:hidden z-20">*/}
                                                    {/*    <Link*/}
                                                    {/*        href={`/reservasi/${facility.id}`}*/}
                                                    {/*        className="bg-[#2C3E9E] hover:bg-[#3f51b5] text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg"*/}
                                                    {/*    >*/}
                                                    {/*        Reservasi*/}
                                                    {/*    </Link>*/}
                                                    {/*</div>*/}
                                                </>
                                            )}

                                            {/* Card Image Section */}
                                            <div className="relative h-52 lg:h-74 w-full">
                                                {/* Background Image */}
                                                <Image
                                                    src={facility.cover_image}
                                                    alt="Aula serbaguna"
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                />

                                                {/* Overlay for better text readability */}
                                                <div className="absolute inset-0 bg-[#2C3E9E]/45"></div>

                                                {/* Title */}
                                                <div className="absolute left-6 top-6 right-6">
                                                    <div className="flex items-center justify-between">
                                                        <h1 className="text-lg lg:text-2xl font-bold text-white">{facility.name}</h1>
                                                        <span className={`rounded-full 
                                                            ${facility.isAvailable ? "bg-emerald-500" : "bg-red-500"} px-2 lg:px-4 py-1 text-xs lg:text-sm font-medium text-white`}>
                                                                {facility.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                                                            </span>
                                                    </div>
                                                </div>

                                                {/* Capacity */}
                                                <div className="absolute bottom-6 right-6">
                                                    <p className="text-sm lg:text-lg font-semibold text-white">Kapasitas {facility.capacity} orang</p>
                                                </div>
                                            </div>

                                            {/* Card Content Section */}
                                            <div className="p-4 lg:p-6 lg:w-full">
                                                <h3 className="mb-1 lg:mb-3 text-sm lg:text-xl font-bold text-[#2C3E9E]">Deskripsi</h3>
                                                <p className="text-black text-sm lg:text-[16px] text-justify">
                                                    {facility.description}
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}