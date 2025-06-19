"use client"

import Image from "next/image"
import {useCallback, useEffect, useState} from "react"
import useSiteContent from "@/hooks/useSiteContent";
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import LoadingSpinner from "@/components/LoadingSpinner";

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

export default function HeroSection() {
    const { prayerTimes, isLoading, fetchPrayerTimes } = useSiteContent()
    const [mounted, setMounted] = useState(false)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [timeUntilNext, setTimeUntilNext] = useState("")
    const [currentDate, setCurrentDate] = useState("")
    const [expectedFormat, setExpectedFormat] = useState(2);

    useEffect(() => {
        setMounted(true)
        setCurrentDate(formatCurrentDate())
        fetchPrayerTimes()
    }, [fetchPrayerTimes])

    // Dengan Detik
    const calculateNextPrayer = useCallback(() => {
        if (!prayerTimes) return

        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()
        const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

        const prayers = [
            { name: 'Subuh', time: prayerTimes.subuh, displayName: 'Shalat Subuh' },
            { name: 'Dzuhur', time: prayerTimes.dzuhur, displayName: 'Shalat Dzuhur' },
            { name: 'Ashar', time: prayerTimes.ashar, displayName: 'Shalat Ashar' },
            { name: 'Maghrib', time: prayerTimes.maghrib, displayName: 'Shalat Maghrib' },
            { name: 'Isya', time: prayerTimes.isya, displayName: 'Shalat Isya' }
        ]

        // Konversi waktu sholat ke menit
        const prayerMinutes = prayers.map(prayer => {
            if (!prayer.time) {
                console.warn(`Waktu sholat untuk ${prayer.name} tidak terdefinisi.`);
                return {
                    ...prayer,
                    minutes: 0
                };
            }

            const [hours, minutes] = prayer.time.split(':').map(Number)
            return {
                ...prayer,
                minutes: hours * 60 + minutes
            }
        })

        // Cari sholat selanjutnya
        let nextPrayerData = null
        for (const prayer of prayerMinutes) {
            if (prayer.minutes > currentTime) {
                nextPrayerData = prayer
                break
            }
        }

        // Jika tidak ada sholat hari ini, maka sholat selanjutnya adalah Subuh besok
        if (!nextPrayerData) {
            nextPrayerData = prayerMinutes[0] // Subuh
            nextPrayerData.minutes += 24 * 60 // Tambah 24 jam
        }

        setNextPrayer(nextPrayerData)

        // Hitung waktu tersisa dengan lebih akurat (detik)
        const nextPrayerTimeInSeconds = nextPrayerData.minutes * 60

        let timeDiffInSeconds = nextPrayerTimeInSeconds - currentTimeInSeconds

        // Jika sholat sudah lewat hari ini, hitung untuk besok
        if (timeDiffInSeconds <= 0 && nextPrayerData.name === 'Subuh') {
            timeDiffInSeconds += 24 * 3600 // Tambah 24 jam dalam detik
        }

        const hours = Math.floor(timeDiffInSeconds / 3600)
        const minutes = Math.floor((timeDiffInSeconds % 3600) / 60)
        const seconds = timeDiffInSeconds % 60

        if (hours > 0) {
            setExpectedFormat(3);
            setTimeUntilNext(`${String(hours).padStart(2, '0')} jam : ${String(minutes).padStart(2, '0')} menit : ${String(seconds).padStart(2, '0')} detik`)
        } else if (minutes > 0) {
            setExpectedFormat(2);
            setTimeUntilNext(`${String(minutes).padStart(2, '0')} menit : ${String(seconds).padStart(2, '0')} detik`)
        } else {
            setExpectedFormat(1);
            setTimeUntilNext(`${String(seconds).padStart(2, '0')} detik`)
        }
    }, [prayerTimes])

    useEffect(() => {
        if (prayerTimes) {
            const interval = setInterval(() => {
                calculateNextPrayer();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [prayerTimes, calculateNextPrayer]);

    const formatCurrentDate = () => {
        const today = new Date()
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ]

        const dayName = days[today.getDay()]
        const day = today.getDate()
        const month = months[today.getMonth()]
        const year = today.getFullYear()

        return `${dayName}, ${day} ${month} ${year}`
    }

    const formatTime = (time) => {
        if (!time) return '--:--'
        return `${time} WIB`
    }

    const ScrambleSkeleton = ({ text = "Memuat...", interval = 50, length = 8 }) => {
        const [scrambled, setScrambled] = useState("");

        useEffect(() => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const scramble = () =>
                Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
            const timer = setInterval(() => {
                setScrambled(scramble());
            }, interval);
            return () => clearInterval(timer);
        }, [interval, length]);

        return <span className="font-mono text-gray-400">{scrambled}</span>;
    };

    const CountdownSkeleton = () => {
        const skeletonClass = "w-6 h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse inline-block";

        return (
            <span className="flex items-center mx-2 space-x-1">
                {expectedFormat === 3 && (
                    <>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">jam :</span>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">menit :</span>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">detik</span>
                    </>
                )}
                {expectedFormat === 2 && (
                    <>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">menit :</span>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">detik</span>
                    </>
                )}
                {expectedFormat === 1 && (
                    <>
                        <span className={skeletonClass}></span>
                        <span className="text-gray-400 font-bold">detik</span>
                    </>
                )}
            </span>
        );
    };

    const activities = [
        {
            title: "Al - Qur'an",
            time: "05.00 - 07.00",
        },
        {
            title: "Kajian Fiqih",
            time: "08.00 - 09.30",
        },
        {
            title: "Tahsin",
            time: "16.00 - 17.30",
        },
        {
            title: "Ceramah Umum",
            time: "19.30 - 21.00",
        },
    ]

    if (isLoading) {
        return (
            <main className="relative h-[440px] lg:h-[640px] w-full px-6 py-8 lg:px-[86px] lg:py-[64px]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
                    <Image
                        src="/images/landing/hero-background.png"
                        alt="Mosque background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
                <div className="relative z-10 flex items-center justify-center h-full text-white">
                    <div className="text-center">
                        <LoadingSpinner />
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="relative h-[440px] lg:h-[640px] w-full px-6 py-8 lg:px-[86px] lg:py-[64px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
                <Image
                    src="/images/landing/hero-background.png"
                    alt="Mosque background"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between text-white h-full">
                {/* Today's Activities */}
                <div>
                    <h2 className="mb-1 text-[18px] lg:text-[24px] font-medium">Kegiatan Hari Ini</h2>
                    <h1 className="mb-3 lg:mb-6 text-[24px] lg:text-4xl font-bold">
                        {currentDate}
                    </h1>

                    {/* Swiper Component */}
                    {mounted && (
                        <div data-aos="fade-down" className="bg-[#FFBD8D]/90 h-[100px] lg:h-[150px] w-full lg:max-w-xs rounded-lg overflow-hidden">
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                spaceBetween={0}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                // pagination={{ clickable: true }}
                                className="h-full w-full"
                            >
                                {activities.map((activity, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="flex h-full w-full flex-col justify-center rounded-lg p-2 lg:p-5 text-left text-black text-sm lg:text-[32px]">
                                            <h3 className="text-xl lg:text-2xl font-bold">{activity.title}</h3>
                                            <p className="text-xl lg:text-2xl font-bold">{activity.time}</p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>

                {/* Next Prayer */}
                <div className="mt-auto">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between">
                        <div data-aos="fade-right">
                            <h2 className="lg:mb-2 text-[16px] lg:text-[24px] font-medium">Jadwal Shalat Selanjutnya</h2>
                            <h1 className="lg:mb-2 text-[18px] lg:text-4xl font-bold">
                                {nextPrayer?.displayName || <ScrambleSkeleton length={10} />}
                            </h1>
                            <p className="mb-2 lg:mb-0 flex items-center text-[16px] lg:text-[24px]">
                                akan dimulai dalam {" "}
                                {timeUntilNext ? (
                                    <span className="mx-2 font-bold">{timeUntilNext}</span>
                                ) : (
                                    <CountdownSkeleton />
                                )}{" "} lagi
                            </p>
                        </div>
                        {/* Prayer Times */}
                        <div data-aos="fade-up" className="rounded-lg bg-[#FFBD8D]/90 p-2 lg:p-5 text-white w-full lg:w-1/2">
                            <div className="grid grid-cols-3 space-x-2 space-y-1 lg:space-x-14 lg:gap-3">
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Shalat Shubuh</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.subuh)}
                                    </p>
                                </div>
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Shalat Dzuhur</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.dzuhur)}
                                    </p>
                                </div>
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Shalat Maghrib</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.maghrib)}
                                    </p>
                                </div>
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Syuruk/Terbit</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.terbit)}
                                    </p>
                                </div>
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Shalat Ashar</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.ashar)}
                                    </p>
                                </div>
                                <div className="my-auto">
                                    <h3 className="text-sm lg:text-lg font-medium">Shalat Isya</h3>
                                    <p className="text-sm lg:text-lg font-normal text-[#2C3E9E]">
                                        {formatTime(prayerTimes?.isya)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
