"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useHandleDisplayError } from "@/hooks/useHandleDisplayError";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/auth-schema";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Eye, EyeOff, Loader2} from "lucide-react";

export function ResetPasswordForm({
    className,
    ...props
}) {
    const { resetPassword, authLoading, error } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get("token");
    const emailFromQuery = searchParams.get("email");

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromQuery || "",
            password: "",
            password_confirmation: "",
        }
    });

    const handleDisplayError = useHandleDisplayError(setErrorMessage, setErrorDialogOpen, setFocus);

    useEffect(() => {
        if (error) {
            handleDisplayError(error);
        }
    }, [error, handleDisplayError]);

    const onSubmit = async (data) => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!token || !emailFromQuery) {
            setErrorMessage("Link tidak valid atau token/email tidak ditemukan.");
            setErrorDialogOpen(true);
            return;
        }

        try {
            const result = await resetPassword(data);

            if (result.success) {
                setSuccessMessage(result.message);
                setSuccessDialogOpen(true);
            }
        } catch (err) {
            setErrorMessage(err?.message || "Terjadi kesalahan jaringan atau tak terduga.");
            setErrorDialogOpen(true);
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full" {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="p-0">
                    <div className="p-6 md:py-12 md:px-8">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{props.title}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {props.description}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} disabled={authLoading} />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <div className="flex items-center justify-center relative">
                                        <Input id="password"
                                               type={showPassword ? "text" : "password"}
                                               {...register("password")}
                                               disabled={authLoading}
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
                                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <div className="flex items-center justify-center relative">
                                        <Input id="password_confirmation"
                                               type={showConfirmPassword ? "text" : "password"}
                                               {...register("password_confirmation")}
                                               disabled={authLoading} />
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
                                    {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>}
                                </div>

                                <Button type="submit" className="w-full bg-[#2C3E9E] hover:bg-[#3f51b5]" disabled={authLoading}>
                                    {authLoading ? (
                                        <>
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Success Modal */}
            {successMessage && (
                <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-green-600 text-center">
                                Password Reset Successful!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                {successMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                className="mx-auto"
                                onClick={() => {
                                    setSuccessDialogOpen(false);
                                    router.push("/auth/login");
                                }}
                            >
                                Login Now
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Error Modal */}
            {errorMessage && (
                <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500 text-center">
                                Password Reset Failed
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                {errorMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                className="mx-auto"
                                onClick={() => setErrorDialogOpen(false)}
                            >
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
