"use client"

import { cn } from "@/lib/utils"
import { toast } from "sonner";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { useAuth } from "@/context/AuthContext";
import { useHandleDisplayError } from "@/hooks/useHandleDisplayError";
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/schemas/auth-schema";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}) {
    const router = useRouter();
    const { register, authLoading, error } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const form = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange", // Validasi saat ada perubahan input
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    const {
        formState: { errors },
        reset,
        setFocus,
    } = form;

    const handleDisplayError = useHandleDisplayError(setErrorMessage, setErrorDialogOpen, setFocus);

    useEffect(() => {
        if (error) {
            handleDisplayError(error);
        }
    }, [error, handleDisplayError]);

    const handleRegistrationSubmit = async (dataToRegister) => {
        setErrorDialogOpen(false);
        setErrorMessage("");
        toast.dismiss();

        try {
            const result = await register(dataToRegister);

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
                router.push("/auth/login?register_success=true");
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

    return (
        <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/images/auth/register-image.png"
                            alt="Login Image"
                            fill
                            className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                    <div className="p-6 md:py-16 md:px-12">
                        <div className="flex flex-col gap-14">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{props.title}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {props.description}
                                </p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleRegistrationSubmit)}>
                                    <div className="grid gap-6">
                                        {error && (
                                            <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className={"text-center text-red-500"}>Gagal Registrasi!</AlertDialogTitle>
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

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input type="text" placeholder="Masukkan nama lengkap..." disabled={authLoading} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="email@example.com" disabled={authLoading} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center justify-center relative">
                                                                <Input
                                                                    id="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder={"Masukkan password..."}
                                                                    {...field}
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
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="password_confirmation"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Konfirmasi Password <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center justify-center relative">
                                                                <Input
                                                                    id="password_confirmation"
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    placeholder={"Masukkan konfirmasi password..."}
                                                                    {...field}
                                                                    className={`pr-10 ${errors.password_confirmation ? "border-red-500" : ""}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={toggleConfirmPasswordVisibility}
                                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 rounded-md"
                                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full bg-[#2C3E9E] hover:bg-[#3f51b5]" disabled={authLoading}>
                                            {authLoading ? (
                                                <>
                                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                    Mendaftar...
                                                </>
                                            ) : (
                                                "Daftar Sekarang"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>

                            <div className="text-center text-sm">
                                Sudah punya akun?{" "}
                                <Link href="/auth/login" className="underline underline-offset-4">
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                Dengan mengklik lanjutkan, Anda menyetujui <a href="#">Persyaratan Layanan</a>{" "}
                dan <a href="#">Kebijakan Privasi</a> kami.
            </div>
        </div>
    );
}
