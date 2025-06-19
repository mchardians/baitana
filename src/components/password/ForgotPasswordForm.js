"use client"

import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ForgotPasswordForm() {
    const { forgotPassword, authLoading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const result = await forgotPassword(email);

        if (result.success) {
            setMessage(result.message);
            setEmail("");
        } else {
            setMessage(result.message);
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
        </>
    )
}