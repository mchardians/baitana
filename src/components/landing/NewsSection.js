"use client"


import Image from 'next/image';
import Link from 'next/link';
import useSiteContent from "@/hooks/useSiteContent";
import {useEffect} from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NewsSection({currentSlug = null, limit}) {
    const { news, isLoading, fetchNews } = useSiteContent()

    useEffect(() => {
        fetchNews()
        console.log(news)
    }, [fetchNews])

    const filteredNews = news.filter(item => item.slug !== currentSlug);

    const newsToDisplay = (limit === undefined || limit === null)
        ? filteredNews
        : filteredNews.slice(0, limit);

    if (isLoading || newsToDisplay.length === 0) {
        <section>
            <div className="px-6 py-12 lg:px-[86px] lg:py-[92px] text-center">
                <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Berita Terkait</h1>
                <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">Update Lengkap Tentang Berita Terkait Kegiatan Masjid</h1>
                <LoadingSpinner/>
            </div>
        </section>
    }

    return (
        <section>
            <div className="px-6 py-12 lg:px-[86px] lg:py-[92px] ">
                <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">Berita Terkait</h1>
                <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">Update Lengkap Tentang Berita Terkait Kegiatan Masjid</h1>

                <div className="space-y-4 md:space-y-8">
                    {!isLoading && newsToDisplay.map((item) => (
                        <NewsCard key={item.id} news={item} />
                    ))}
                </div>

                {limit !== undefined && limit !== null && (
                    <div className="flex justify-center mt-8 md:mt-10">
                        <Link href="/news" className="bg-[#2C3E9E] text-sm md:text-lg text-white px-10 py-2 rounded-full font-medium hover:bg-[#3f51b5] transition-colors">
                            Lihat berita lainnya
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

function NewsCard({news}) {
    const categories = Array.isArray(news.news_category) ? news.news_category : [];
    return (
        <div data-aos="fade-up" className="bg-white rounded-xl shadow-md overflow-hidden p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <div className="relative h-[200px] md:h-[270px] rounded-lg overflow-hidden">
                        <Image
                            src={news?.thumbnail}
                            alt={news.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                </div>
                <div className="w-full md:w-2/3 space-y-3">
                    <Link href={`/news/${news.slug}`} className="group">
                        <h1 className="text-lg md:text-3xl font-medium text-[#2C3E9E] text-justify  group-hover:text-[#4050c0] transition-colors duration-300">
                            {news.title}
                        </h1>
                    </Link>
                    <h6 className="text-sm md:text-[16px] text-[#FFBD8D] mt-1">{news.published_at}, {news?.author?.name}</h6>
                    <div className="flex gap-2">
                        {categories.map((category, index) => (
                            <span key={index} className="px-2 md:px-4 py-1 text-xs text-[#2C3E9E] border border-[#2C3E9E] rounded-full hover:bg-[#2C3E9E] hover:text-white transition-colors duration-300 cursor-pointer">
                                {category?.name}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm md:text-lg text-black text-justify overflow-hidden text-ellipsis">
                        {news.excerpt}
                    </p>
                    <div className="flex justify-end">
                        <Link href={`/news/${news.slug}`} className="group flex items-center text-[#2C3E9E] font-medium">
                            <span className="text-sm md:text-[16px] relative after:absolute after:bottom-0 after:left-0 after:bg-current after:h-0.5 after:w-0 group-hover:after:w-full after:transition-all after:duration-300">
                                Baca Selengkapnya
                                <Image
                                    src="/icons/chevron-up-outline.png"
                                    alt="Chevron Up"
                                    width={30}
                                    height={30}
                                    className="w-4 md:w-5 h-auto inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                    priority
                                />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}