"use client"

import { useState, useEffect } from 'react';
import useSiteContent from "@/hooks/useSiteContent";
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from "@/components/LoadingSpinner";
import PaginationControls from '@/components/PaginationControls';

function formatCategorySlug(name) {
    if (!name) return '';
    return name
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

const ITEMS_PER_PAGE = 5;

export default function NewsSection({categorySlug = null, currentSlug = null, limit, isStandalonePage = false}) {
    const { news, isLoading } = useSiteContent()
    const [currentPage, setCurrentPage] = useState(1);

    const categoryFilteredNews = categorySlug
        ? news.filter(item =>
                Array.isArray(item.news_category) && item.news_category.some(category =>
                    category.slug === categorySlug
                )
        )
        : news;

    const fullNewsList = currentSlug
        ? categoryFilteredNews.filter(item => item.slug !== currentSlug)
        : categoryFilteredNews;

    const shouldPaginate = limit === undefined || limit === null;

    // Calculate totalPages. This is always calculated.
    const totalPages = Math.ceil(fullNewsList.length / ITEMS_PER_PAGE);

    // --- Move useEffect outside of conditional rendering ---
    useEffect(() => {
        // Only run this logic if pagination is actually enabled for this component instance
        if (shouldPaginate) {
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            } else if (currentPage <= 0 && totalPages > 0) {
                setCurrentPage(1);
            } else if (totalPages === 0 && currentPage !== 1) {
                setCurrentPage(1);
            }
        } else {
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }
    }, [fullNewsList.length, totalPages, currentPage, shouldPaginate]);


    let newsToRender = [];

    if (shouldPaginate) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        newsToRender = fullNewsList.slice(startIndex, endIndex);
    } else {
        newsToRender = fullNewsList.slice(0, limit);
    }

    const mainHeading = categorySlug
        ? `Berita Kategori: ${formatCategorySlug(categorySlug)}`
        : (currentSlug ? 'Berita Terkait' : 'Berita Terbaru');

    const subHeading = categorySlug
        ? `Update Lengkap Tentang Berita di Kategori ${formatCategorySlug(categorySlug)}`
        : (currentSlug ? 'Update Lengkap Tentang Berita Terkait Kegiatan Masjid' : 'Update Lengkap Tentang Berita Kegiatan Masjid');

    const sectionWrapperClasses = isStandalonePage
        ? "flex-grow flex flex-col justify-center items-center h-full"
        : "";

    const contentDivClasses = isStandalonePage
        ? "px-6 py-12 lg:px-[86px] lg:py-[92px] w-full text-center"
        : "px-6 py-12 lg:px-[86px] lg:py-[92px] w-full";

    if (isLoading) {
        return (
            <section className={sectionWrapperClasses}>
                <div className={contentDivClasses}>
                    <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">{mainHeading}</h1>
                    <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">{subHeading}</h1>
                    <LoadingSpinner/>
                </div>
            </section>
        );
    }

    if (!isLoading && fullNewsList.length === 0) {
        return (
            <section className={sectionWrapperClasses}>
                <div className={contentDivClasses}>
                    <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">{mainHeading}</h1>
                    <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">{subHeading}</h1>
                    <p className="text-lg text-gray-500">Tidak ada berita ditemukan untuk kategori ini.</p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="px-6 py-12 lg:px-[86px] lg:py-[92px] ">
                <h1 data-aos="fade-right" className="text-[#2C3E9E] text-2xl lg:text-[36px] font-bold">{mainHeading}</h1>
                <h1 data-aos="fade-up" className="text-black text-sm lg:text-2xl text-justify lg:text-left font-extralight mb-6 lg:mb-6">{subHeading}</h1>

                <div className="space-y-4 md:space-y-8">
                    {newsToRender.map((item) => (
                        <NewsCard key={item.id} news={item} />
                    ))}
                </div>

                {shouldPaginate && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {!shouldPaginate && fullNewsList.length > limit && (
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
                            <Link
                                key={index}
                                href={`/news/category/${encodeURIComponent(category.slug)}`}
                                className="px-2 md:px-4 py-1 text-xs text-[#2C3E9E] border border-[#2C3E9E] rounded-full hover:bg-[#2C3E9E] hover:text-white transition-colors duration-300 cursor-pointer"
                            >
                                {category?.name}
                            </Link>
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