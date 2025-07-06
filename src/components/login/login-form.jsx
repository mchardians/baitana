"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useCallback} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useHandleDisplayError } from "@/hooks/useHandleDisplayError";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm({ className, ...props }) {
    const { user, login, authLoading, error } = useAuth();
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [logoutMessageDialogOpen, setLogoutMessageDialogOpen] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const handleDisplayError = useHandleDisplayError(setErrorMessage, setErrorDialogOpen, setFocus);

    useEffect(() => {
        if (error) {
            handleDisplayError(error);
        }
    }, [error, handleDisplayError]);

    const submit = async (data) => {
        setErrorDialogOpen(false);
        setErrorMessage("");
        toast.dismiss();

        try {
            const result = await login(data);

            if (result.success) {
                reset();
                toast.success(
                    (t) => (
                        <div
                            style={{
                                whiteSpace: "nowrap",
                                width: "fit-content",
                                maxWidth: "100%",
                            }}
                        >
                            {result.message}
                        </div>
                    ),
                    {
                        duration: 3000,
                        position: "top-right",
                    }
                );

                // await new Promise((resolve) => setTimeout(resolve, 1000));

                const roleName = result.user?.role?.name;

                if (roleName === "jamaah-umum") {
                    router.push("/");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (err) {
            setErrorMessage(err.message || "Terjadi kesalahan jaringan atau tak terduga.");
            setErrorDialogOpen(true);
            toast.error(err.message || "Terjadi kesalahan jaringan atau tak terduga.", {
                duration: 4000,
                position: "top-right",
                id: `error-network-${Date.now()}`,
                dismissible: true
            });
        }
    };

    // Efek untuk memeriksa query parameter 'logout_success' saat komponen dimuat
    useEffect(() => {
        const logoutReason = searchParams.get("logout");
        const logoutSuccess = searchParams.get("logout_success");
        const registerSuccess = searchParams.get("register_success");

        let messageToDisplay = "";
        let shouldOpenDialog = false;

        if (logoutReason === 'access_denied') {
            messageToDisplay = "Akses ditolak. Anda telah dikeluarkan dari sesi karena tidak memiliki izin.";
            shouldOpenDialog = true;
        } else if (logoutReason === 'refresh_failed' || logoutReason === 'initial_token_refresh_failed' || logoutReason === 'no_token_for_refresh' || logoutReason === 'invalid_refresh_response' || logoutReason === 'network_or_unexpected_refresh_error') {
            messageToDisplay = "Sesi Anda telah berakhir karena masalah otentikasi. Silakan masuk kembali.";
            shouldOpenDialog = true;
        } else if (logoutSuccess === 'true') {
            messageToDisplay = "Anda telah berhasil keluar dari akun Anda.";
            shouldOpenDialog = true;
        } else if (registerSuccess === 'true') {
            messageToDisplay = "Registrasi berhasil! Silakan masuk menggunakan akun Anda.";
            shouldOpenDialog = true;
        }

        if (shouldOpenDialog) {
            setLogoutMessage(messageToDisplay);
            setLogoutMessageDialogOpen(true);

            const newUrl = new URL(window.location.href);
            if (searchParams.has('logout')) {
                newUrl.searchParams.delete('logout');
            }
            if (searchParams.has('logout_success')) {
                newUrl.searchParams.delete('logout_success');
            }
            if (searchParams.has('register_success')) {
                newUrl.searchParams.delete('register_success');
            }
            router.replace(newUrl.pathname + newUrl.search);
        }
    }, [searchParams, router]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:py-16 md:px-8" onSubmit={handleSubmit(submit)}>
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{props.title}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {props.description}
                                </p>
                            </div>

                            {error && (
                                <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className={"text-center text-red-500"}>Gagal Login!</AlertDialogTitle>
                                            <AlertDialogDescription className={"text-center"}>
                                                {errorMessage}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction className={"mx-auto "} onClick={() => setErrorDialogOpen(false)}>
                                                OK
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            {logoutMessageDialogOpen && (
                                <AlertDialog open={logoutMessageDialogOpen} onOpenChange={setLogoutMessageDialogOpen}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className={`text-center ${logoutMessage.includes('berhasil') ? 'text-green-500' : 'text-orange-500'}`}>
                                                {logoutMessage.toLowerCase().includes("registrasi")
                                                    ? "Registrasi Berhasil"
                                                    : logoutMessage.toLowerCase().includes("berhasil")
                                                        ? "Informasi Logout"
                                                        : "Sesi Berakhir"}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className={"text-center"}>
                                                {logoutMessage}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction className={"mx-auto "} onClick={() => setLogoutMessageDialogOpen(false)}>
                                                OK
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/password/forgot" className="ml-auto text-sm underline-offset-2 hover:underline">
                                        Lupa password?
                                    </Link>
                                </div>
                                <div className="flex items-center justify-center relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={"password"}
                                        {...register("password")}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 rounded-md"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full bg-[#2C3E9E] hover:bg-[#3f51b5]" disabled={authLoading}>
                                {authLoading ? (
                                    <>
                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                Belum punya akun?{" "}
                                <Link href="/auth/register" className="underline underline-offset-4">
                                    Daftar
                                </Link>
                            </div>
                        </div>
                    </form>

                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/images/auth/login-image.png"
                            alt="Login Image"
                            fill
                            className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}