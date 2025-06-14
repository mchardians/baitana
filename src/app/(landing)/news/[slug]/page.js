"use client"

import Image from "next/image";
import Link from "next/link";
import NewsSection from "@/components/landing/NewsSection";
import useSiteContent from "@/hooks/useSiteContent";
import { useEffect, useMemo } from "react";
import React from 'react'
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NewsDetailPage({ params }) {
    const { news, isLoading } = useSiteContent()
    const resolvedParams = React.use(params);
    const slug = resolvedParams.slug;

    const post = useMemo(() => {
        if (news.length > 0 && slug) {
            return news.find((item) => item.slug === slug);
        }
        return null;
    }, [news, slug]);

    if (isLoading || !post) {
        return (
            <div className="flex justify-center items-center h-screen">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <p className="text-lg">Berita tidak ditemukan.</p>
                )}
            </div>
        );
    }


    return (
        <>
            <div className="relative h-[360px] lg:h-[575px] w-full px-6 py-8 lg:px-[86px] lg:py-[64px]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-70"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center text-white h-full">
                    <div className="flex items-start md:justify-center w-full">
                        <div className="hidden md:block md:w-1/3">
                            <Link href="/news" className="inline-block bg-transparent text-[16px] text-white border py-2 px-6 rounded-full">
                                Kembali
                            </Link>
                        </div>
                        <div className="md:w-2/3">
                            <h1 className="text-lg md:text-3xl">{post.title}</h1>
                            <p className="text-[16px] mt-8 md:mt-16">{post.published_at}, {post.author?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-8 lg:px-[86px] lg:pt-[64px] lg:pb-0 text-justify">
                <div className="flex items-center justify-center mb-8 md:mb-16">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={200}
                        height={200}
                        className="w-full md:w-[484px] h-auto rounded-3xl"
                        priority
                    />
                </div>
                <div className="flex flex-col gap-2 md:space-y-3 text-sm md:text-lg">
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                        <p className="text-sm md:text-lg text-gray-500">Konten berita tidak tersedia.</p>
                    )}
                </div>
            </div>
            <NewsSection currentSlug={slug} limit={3} />
        </>
    );
}