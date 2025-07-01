"use client"

import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export function ForgotPasswordForm() {
    const { forgotPassword, authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const result = await forgotPassword(email);

        if (result.success) {
            setMessage(result.message);
            setEmail("");
            setSuccessDialogOpen(true)
        } else {
            setMessage(result.message);
            setErrorDialogOpen(true);
        }
    };

    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email" className="sr-only">
                        Email address
                    </Label>
                    <Input id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required placeholder="Email address"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           disabled={authLoading}
                    />
                </div>
                <Button type="submit" className="w-full bg-[#2C3E9E] hover:bg-[#3f51b5]">
                    {authLoading ? "Sending..." : "Reset password"}
                </Button>
            </form>
            <div className="flex justify-center">
                <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    prefetch={false}
                >
                    Back to login
                </Link>
            </div>

            {/* Success Modal */}
            {message && (
                <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-green-600">
                                Success!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                {message}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                className="mx-auto"
                                onClick={() => setSuccessDialogOpen(false)}
                            >
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Error Modal */}
            {error && (
                <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-red-500">
                                Password Reset Failed
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                                {error}
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
        </>
    )
}