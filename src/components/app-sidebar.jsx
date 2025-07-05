"use client"

import { useCallback, useMemo } from "react";
import {
    LayoutDashboardIcon,
    SquareTerminal,
    BookOpen,
    Settings2,
    PieChart
} from "lucide-react";

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useAuth} from "@/context/AuthContext";

const ROLES = {
    ADMIN: "administrator",
    BENDAHARA: "bendahara",
    SEKRETARIS: "sekretaris",
};

const data = {
    navGroups: [
        {
            label: "Dashboard",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboardIcon,
                    allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA, ROLES.SEKRETARIS],
                },
            ],
        },
        {
            label: "Master Data",
            items: [
                {
                    title: "Master Data",
                    url: "#",
                    icon: SquareTerminal,
                    allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA, ROLES.SEKRETARIS],
                    isActive: true,
                    subItems: [
                        { title: "Fasilitas", url: "/master/facilities", allowedRoles: [ROLES.ADMIN] },
                        { title: "Kategori Berita", url: "/master/news/categories", allowedRoles: [ROLES.ADMIN, ROLES.SEKRETARIS] },
                        { title: "Kategori Keuangan", url: "/master/finance/categories", allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA] },
                        { title: "Role", url: "/master/roles", allowedRoles: [ROLES.ADMIN] },
                        { title: "User", url: "/master/users", allowedRoles: [ROLES.ADMIN] },
                    ],
                },
            ],
        },
        {
            label: "Transaksi Keuangan",
            items: [
                {
                    title: "Transaksi Keuangan",
                    url: "#",
                    icon: SquareTerminal,
                    allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA],
                    subItems: [
                        { title: "Keuangan Masuk", url: "/finance/transaction/incomes", allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA] },
                        { title: "Keuangan Keluar", url: "/finance/transaction/expenses", allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA] },
                        { title: "Rekapitulasi Keuangan", url: "/finance/recapitulations", allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA] },
                    ],
                },
            ],
        },
        {
            label: "Jadwal dan Acara",
            items: [
                {
                    title: "Jadwal dan Acara",
                    url: "/events/schedule",
                    icon: BookOpen,
                    allowedRoles: [ROLES.ADMIN, ROLES.SEKRETARIS],
                },
            ],
        },
        {
            label: "Berita",
            items: [
                {
                    title: "Berita",
                    url: "/master/news",
                    icon: Settings2,
                    allowedRoles: [ROLES.ADMIN, ROLES.SEKRETARIS],
                },
            ],
        },
        {
            label: "Laporan",
            items: [
                {
                    title: "Laporan",
                    url: "/reports",
                    icon: PieChart,
                    allowedRoles: [ROLES.ADMIN, ROLES.BENDAHARA, ROLES.SEKRETARIS],
                },
            ],
        },
    ],
};

export function AppSidebar({
    ...props
}) {
    const { user, authLoading } = useAuth();

    const filterMenuItemsByRole = useCallback((navGroups, userRole) => {
        if (!userRole) return [];

        return navGroups.map(group => {
            const filteredItems = group.items
                .map(item => {
                    if (item.subItems && item.subItems.length > 0) {
                        // Filter sub-items berdasarkan role user
                        const filteredSubItems = item.subItems.filter(subItem =>
                            subItem.allowedRoles?.includes(userRole)
                        );

                        // Menu induk muncul hanya jika ada minimal 1 sub-item yang bisa diakses
                        if (filteredSubItems.length > 0) {
                            return { ...item, subItems: filteredSubItems };
                        }
                        return null;
                    }

                    // Untuk item tanpa subItems, periksa permission
                    return item.allowedRoles?.includes(userRole) ? item : null;
                })
                .filter(item => item !== null);

            // Grup muncul jika ada item yang terlihat
            return filteredItems.length > 0 ? { ...group, items: filteredItems } : null;
        })
            .filter(group => group !== null);
    }, []);

    const filteredNavData = useMemo(() => {
        if (authLoading || !user) {
            return { navGroups: [] };
        }

        const userRoleName = user.role?.name?.toLowerCase().trim()
        if (!userRoleName) {
            return { navGroups: [] };
        }

        const filteredGroups = filterMenuItemsByRole(data.navGroups, userRoleName);
        return { navGroups: filteredGroups };
    }, [authLoading, user, filterMenuItemsByRole]);

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="bg-gradient-to-b from-[#2C3E9E] via-[#2C3E9E] to-[#1e2b6b] shadow-xl"
        >
            <SidebarHeader className="bg-gradient-to-r from-[#2C3E9E] to-[#3d4fb8] border-b border-blue-200/20">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex justify-center items-center rounded-xl p-2 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                            <img
                                src="/images/logo-baitana-temp-white.png"
                                alt="Logo Baitana"
                                width={80}
                                height={80}
                                className="w-40 md:w-48 h-auto drop-shadow-sm"
                            />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="gap-0 bg-gradient-to-b from-[#2C3E9E] via-[#2C3E9E] to-[#1e2b6b] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-0">
                <NavMain data={filteredNavData}/>
            </SidebarContent>
            <SidebarFooter className="bg-gradient-to-r from-[#1e2b6b] to-[#2C3E9E] border-t border-blue-200/20">
                {!authLoading && user ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-md">
                        <NavUser user={user}/>
                    </div>
                ) : (
                    <div className="h-16 flex items-center justify-center text-white/70 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Loading user...</span>
                        </div>
                    </div>
                )}
            </SidebarFooter>
            <SidebarRail className="bg-blue-300/20" />
        </Sidebar>
    );
}


