"use client"

import React from 'react'
import NewsSection from "@/components/landing/news/NewsSection";
import useSiteContent from "@/hooks/useSiteContent";
import LoadingSpinner from "@/components/LoadingSpinner";

function formatCategorySlug(name) {
    if (!name) return '';
    return name
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function NewsDetailPage({ params }) {
    const { news, isLoading} = useSiteContent()

    const resolvedParams = React.use(params);
    const categorySlugFromUrl = decodeURIComponent(resolvedParams.categorySlug);

    const formattedCategorySlug = formatCategorySlug(categorySlugFromUrl);

    if (isLoading && news.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    const hasMatchingNews = news.some(item =>
        Array.isArray(item.news_category) && item.news_category.some(cat => cat.slug === categorySlugFromUrl)
    );

    if (!isLoading && !hasMatchingNews) {
        return (
            <NewsSection categorySlug={categorySlugFromUrl} isStandalonePage={true} />
        );
    }

    return (
        <NewsSection categorySlug={categorySlugFromUrl} isStandalonePage={true} />
    );
}