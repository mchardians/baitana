import {ResetPasswordForm} from "@/components/password/ResetPasswordForm";

export default function PasswordReset() {
    return (
        <div
            className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), /* Pola Vertikal (Lapisan Atas) */
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px), /* Pola Horizontal (Lapisan Atas) */
                    linear-gradient(to right, #e0e7ff, var(--muted))
                `,
                backgroundSize: `
                    30px 30px,    
                    30px 30px,    
                    100% 100%     
                `,
                backgroundRepeat: `
                    repeat,      
                    repeat,      
                    no-repeat     
                `,
                backgroundColor: 'var(--muted)',
            }}
        >
            <div className="flex w-full max-w-sm md:max-w-md justify-center">
                <ResetPasswordForm title={"Password Reset!"} description={"Enter your email and new password to reset."} />
            </div>
        </div>
    )
}