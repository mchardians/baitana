"use client"

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {LayoutDashboardIcon, LogOut, User} from "lucide-react";
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export function ProfileDropdownUser({ user, authLoading }) {
    const { logout } = useAuth();
    const [confirmLogoutDialogOpen, setConfirmLogoutDialogOpen] = useState(false);

    const handleLogout = async () => {
        setConfirmLogoutDialogOpen(true);
    }

    const handleConfirmLogout = async () => {
        setConfirmLogoutDialogOpen(false);
        await logout();
    }

    if (authLoading) {
        return (
            <Button variant='ghost' className='relative w-fit p-0 rounded-full cursor-pointer'>
                <div className="flex justify-center items-center gap-2 rounded-xl border py-0.5 px-2 animate-pulse">
                    <Avatar className='h-8 w-8'>
                        <AvatarFallback className="bg-gray-200"></AvatarFallback> {/* Lighter loading state */}
                    </Avatar>
                    <span className="bg-gray-200 h-4 w-20 rounded"></span> {/* Placeholder for name */}
                </div>
            </Button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    className="rounded-2xl bg-[#2C3E9E] px-4 py-5 text-sm font-medium text-white hover:bg-[#3f51b5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer flex items-center gap-2"
                >
                    <Avatar className='h-8 w-8 border border-gray-300'>
                        <AvatarImage src={user.photo || ''} alt={user.name || 'User Avatar'} />
                        <AvatarFallback className="font-bold border border-gray-200 text-black">
                            {user.name
                                ? user.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                : <User className="h-5 w-5" />}
                        </AvatarFallback>
                    </Avatar>
                    <span>{user.name || 'Guest'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm leading-none font-medium'>{user.name || 'Guest User'}</p> {/* Use user.name */}
                        <p className='text-muted-foreground text-xs leading-none'>
                            {user.email || 'No email provided'} {/* Use user.email */}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href='/dashboard'>
                            <LayoutDashboardIcon />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>

            {confirmLogoutDialogOpen && (
                <AlertDialog open={confirmLogoutDialogOpen} onOpenChange={setConfirmLogoutDialogOpen}>
                    <AlertDialogContent className="!max-w-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className={"text-center"}>Konfirmasi Logout</AlertDialogTitle>
                            <AlertDialogDescription className={"text-center"}>
                                Apakah Anda yakin ingin keluar dari akun Anda?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex w-full justify-center gap-4">
                                <AlertDialogCancel onClick={() => setConfirmLogoutDialogOpen(false)}>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmLogout} className={"bg-red-500 hover:bg-red-600"}>
                                    Logout
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </DropdownMenu>
    )
}