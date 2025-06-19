import { ForgotPasswordForm } from "@/components/password/ForgotPasswordForm";

export default function ForgotPassword() {
    return (
        <div className={"flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950"}>
            <div className="mx-auto w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                    </p>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}