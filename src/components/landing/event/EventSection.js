"use client"

import Image from "next/image";
import {useState} from "react";

const todayEvents = [
    {
        title: 'Shalat Subuh Berjamaah',
        time: '05.00 - 06.00',
        date: '20 Mei 2025',
    },
    {
        title: 'Kajian Pagi: Akhlak Muslim',
        time: '07.00 - 08.30',
        date: '20 Mei 2025',
    },
    {
        title: 'Belajar Tahsin Al-Qur\'an',
        time: '09.00 - 10.30',
        date: '20 Mei 2025',
    },
    {
        title: 'Pengajian Remaja Masjid',
        time: '13.00 - 14.30',
        date: '20 Mei 2025',
    },
    {
        title: 'Buka Puasa Sunnah & Tausiyah',
        time: '17.30 - 19.00',
        date: '20 Mei 2025',
    },
];

const upcomingEvents = [
    {
        title: 'Kajian Kitab Riyadhus Shalihin',
        time: '08.00 - 09.30',
        date: '21 Mei 2025',
    },
    {
        title: 'Shalat Jumat & Khutbah',
        time: '11.30 - 13.00',
        date: '21 Mei 2025',
    },
    {
        title: 'Santunan Anak Yatim',
        time: '16.30 - 18.00',
        date: '21 Mei 2025',
    },
    {
        title: 'Kerja Bakti Masjid',
        time: '07.00 - 10.00',
        date: '24 Mei 2025',
    },
    {
        title: 'Pengajian Akbar Bulanan',
        time: '19.00 - 21.00',
        date: '24 Mei 2025',
    },
];

export default function EventSection() {
    const [activeTab, setActiveTab] = useState('today');

    const selectedEvents = activeTab === 'today' ? todayEvents : upcomingEvents;

    const groupedEvents = selectedEvents.reduce((acc, event) => {
        if (!acc[event.date]) {
            acc[event.date] = [];
        }
        acc[event.date].push(event);
        return acc;
    }, {});

    return(
        <>
            <section id="events" className="px-6 py-12 lg:px-[86px] lg:py-[92px]">
                <div className="container">
                    <h1 data-aos="fade-down" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Kegiatan Masjid</h1>
                    <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">Agenda rutin harian dan juga agenda yang diadakan oleh organisasi masyarakat</h1>

                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div data-aos="fade-right" className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFBD8D]/0 to-[#997155]/10 text-[#2C3E9E] border border-black rounded-2xl p-5 lg:p-4 shadow-lg">
                            <Image
                                src="/icons/calendar-light.png"
                                alt="Logo Baitana"
                                width={130}
                                height={130}
                                className="w-24 md:w-48 h-auto"
                                priority
                            />

                            <h2 className="text-sm lg:text-lg font-semibold text-[#2C3E9E]">Agenda kegiatan hari ini</h2>
                            <p className="text-xs lg:text-sm text-black text-center mb-3 lg:mb-6">Silakan lihat agenda akan datang atau lihat kegiatan lainnya.</p>

                            {/* Tombol Switch */}
                            <div className="flex bg-[#E2E2E2] rounded-full overflow-hidden w-full shadow-inner border border-gray-300 text-sm lg:text-lg p-[2px]">
                                <button
                                    onClick={() => setActiveTab('today')}
                                    className={`w-1/2 py-3 transition-all duration-200 ${
                                        activeTab === 'today'
                                            ? 'bg-white text-[#2C3E9E] font-semibold shadow'
                                            : 'bg-transparent text-gray-600'
                                    } rounded-full`}
                                >
                                    Hari ini
                                </button>
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`w-1/2 py-3 transition-all duration-200 ${
                                        activeTab === 'upcoming'
                                            ? 'bg-white text-[#2C3E9E] font-semibold shadow'
                                            : 'bg-transparent text-gray-600'
                                    } rounded-full`}
                                >
                                    Akan Datang
                                </button>
                            </div>
                        </div>
                        <div data-aos="fade-up-left" className="w-full border border-black rounded-2xl p-4 bg-white">
                            { activeTab === 'today' ? (
                                <>
                                    {Object.entries(groupedEvents).map(([date, events], idx) => (
                                        <div key={idx}>
                                            {/* Header tanggal dengan icon */}
                                            <div className="flex items-center justify-end gap-1">
                                                <Image
                                                    src="/icons/calendar-light.png"
                                                    alt="Logo Baitana"
                                                    width={30}
                                                    height={30}
                                                    className="w-4 md:w-5 h-auto"
                                                    priority
                                                />
                                                <h2 className="text-sm lg:text-lg text-[#2C3E9E]">{date}</h2>
                                            </div>

                                            {/* Daftar event pada tanggal tersebut */}
                                            <div className="flex flex-col w-full mt-2 lg:mt-4 gap-2 lg:gap-4">
                                                {events.map((event, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gradient-to-r from-[#101638]/90 to-[#2C3E9E]/70 rounded-xl px-2 lg:px-3 py-2"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h1 className="text-sm lg:text-lg text-white">{event.title}</h1>
                                                            <span className="bg-[#FFBD8D] text-xs lg:text-sm text-black p-1 rounded-lg w-fit">
                                                                {event.time}
                                                            </span>
                                                        </div>
                                                        <h1 className="text-xs lg:text-lg text-white">{event.date}</h1>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {Object.entries(groupedEvents).map(([date, events], idx) => (
                                        <div key={idx}>
                                            {/* Header tanggal dengan icon */}
                                            <div className={`flex items-center justify-end gap-1 ${idx !== 0 ? "mt-3 lg:mt-6" : "mt-0"}`}>
                                                <Image
                                                    src="/icons/calendar-light.png"
                                                    alt="Logo Baitana"
                                                    width={30}
                                                    height={30}
                                                    className="w-4 md:w-5 h-auto"
                                                    priority
                                                />
                                                <h2 className="text-sm lg:text-lg text-[#2C3E9E]">{date}</h2>
                                            </div>

                                            {/* Daftar event pada tanggal tersebut */}
                                            <div className="flex flex-col w-full mt-2 lg:mt-4 gap-2 lg:gap-4">
                                                {events.map((event, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gradient-to-r from-[#101638]/90 to-[#2C3E9E]/70 rounded-xl px-2 lg:px-3 py-2"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h1 className="text-sm lg:text-lg text-white">{event.title}</h1>
                                                            <span className="bg-[#FFBD8D] text-xs lg:text-sm text-black p-1 rounded-lg">
                                                                {event.time}
                                                            </span>
                                                        </div>
                                                        <h1 className="text-xs lg:text-lg text-white">{event.date}</h1>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}