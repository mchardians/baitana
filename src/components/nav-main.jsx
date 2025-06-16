"use client"

import {ArrowLeftCircle, ChevronRight} from "lucide-react";
import { usePathname } from "next/navigation";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    data
}) {
    const { navGroups } = data;
    const pathname = usePathname();

    const isActiveItem = (url) => {
        if (url === '#') return false;
        return pathname === url || pathname.startsWith(url + '/');
    };

    const hasActiveSubItem = (subItems) => {
        if (!subItems) return false;
        return subItems.some(subItem => isActiveItem(subItem.url));
    };

    return (
        <>
            {navGroups.map((group) => (
                <SidebarGroup className="py-2" key={group.label}>
                    <SidebarGroupLabel className="text-white/90 font-semibold text-xs tracking-wider uppercase mb-2 px-2">
                        {group.label}
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                        {group.items.map((item) => {
                            const isItemActive = isActiveItem(item.url);
                            const hasActiveSub = hasActiveSubItem(item.subItems);
                            const shouldOpenCollapsible = item.isActive || hasActiveSub;

                            return item.subItems && item.subItems.length > 0 ? (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={shouldOpenCollapsible}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className={`
                                                    transition-all duration-200 rounded-lg font-medium group
                                                    ${hasActiveSub
                                                        ? 'bg-white/25 text-white border-l-4 border-white shadow-md'
                                                        : 'text-white/90 hover:text-white hover:bg-white/15'
                                                    } data-[state=open]:bg-white/20 data-[state=open]:text-white
                                                `}
                                            >
                                                {item.icon && (
                                                    <item.icon className={`
                                                        w-5 h-5 transition-colors duration-200
                                                        ${hasActiveSub
                                                            ? 'text-white'
                                                            : 'text-white/80 group-hover:text-white'
                                                        }
                                                    `} />
                                                )}
                                                <span className="flex-1">{item.title}</span>
                                                <ChevronRight className={`
                                                    ml-auto w-4 h-4 transition-all duration-300
                                                    group-data-[state=open]/collapsible:rotate-90
                                                    ${hasActiveSub
                                                        ? 'text-white'
                                                        : 'text-white/60 group-hover:text-white/90'
                                                    }
                                                `} />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                                            <SidebarMenuSub className="ml-6 mt-1 space-y-1">
                                                {item.subItems.map((subItem) => {
                                                    const isSubItemActive = isActiveItem(subItem.url);

                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={`
                                                                    transition-all duration-200 rounded-md py-2 font-normal group relative
                                                                    before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
                                                                    before:w-2 before:h-0.5 before:rounded-full before:transition-colors before:duration-200
                                                                    ${isSubItemActive
                                                                        ? 'text-white bg-white/15 border-l-2 border-white before:bg-white shadow-sm'
                                                                        : 'text-white/70 hover:text-white hover:bg-white/10 before:bg-white/40 hover:before:bg-white/80'
                                                                    }
                                                                `}
                                                            >
                                                                <a href={subItem.url} className="flex items-center w-full pl-4">
                                                                    <span className="text-sm font-medium">{subItem.title}</span>
                                                                    {isSubItemActive && (
                                                                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"></div>
                                                                    )}
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className={`
                                            transition-all duration-200 rounded-lg font-medium group
                                            ${isItemActive
                                                ? 'bg-white/25 text-white border-l-4 border-white shadow-md'
                                                : 'text-white/90 hover:text-white hover:bg-white/15'
                                            }
                                        `}
                                    >
                                        <a href={item.url} className="flex items-center gap-3 w-full py-2.5 px-3">
                                            {item.icon && (
                                                <item.icon className={`
                                                    w-5 h-5 transition-colors duration-200
                                                    ${isItemActive
                                                        ? 'text-white'
                                                        : 'text-white/80 group-hover:text-white'
                                                    }
                                                `} />
                                            )}
                                            <span className="flex-1">{item.title}</span>
                                            {isItemActive && (
                                                <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}

            {/* Separator line dengan gradient */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="text-white/90 hover:text-white hover:bg-white/15 hover:border-white/30 border border-white/10 py-2 px-3 transition-all duration-300 rounded-lg font-medium group bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-md"
                            asChild
                            tooltip="Halaman Utama"
                        >
                            <a href="/" className="flex items-center gap-3 w-full">
                                <ArrowLeftCircle className="w-5 h-5 text-white/80 group-hover:text-white transition-all duration-200 group-hover:scale-110" />
                                <span>Halaman Utama</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
