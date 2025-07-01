import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().trim().min(1, {message: "Email tidak boleh kosong."}).email({ message: "Email tidak valid" }),
    password: z.string().min(8, { message: "Password minimal 8 karakter." }),
});

export const registerSchema = z
    .object({
        name: z
            .string({
                required_error: "Nama wajib diisi",
                invalid_type_error: "Nama harus berupa teks",
            })
            .min(1, "Nama wajib diisi"), // Minimal 1 karakter untuk memastikan tidak kosong

        email: z
            .string({
                required_error: "Email wajib diisi",
            })
            .email("Format email tidak valid"), // Validasi format email

        password: z
            .string({
                required_error: "Password wajib diisi",
            })
            .min(8, "Password minimal 8 karakter") // Minimal 8 karakter
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password harus mengandung huruf besar, huruf kecil, dan angka"
            ), // Memastikan password kuat

        password_confirmation: z
            .string({
                required_error: "Konfirmasi password wajib diisi",
            }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Password dan konfirmasi password tidak cocok",
        path: ["password_confirmation"],
    });

export const resetPasswordSchema = z.object({
    email: z
        .string({
            required_error: "Email wajib diisi",
        })
        .email("Format email tidak valid"),
    password: z
        .string({
            required_error: "Password wajib diisi",
        })
        .min(8, "Password minimal 8 karakter")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password harus mengandung huruf besar, huruf kecil, dan angka"
        ),
    password_confirmation: z
        .string({
            required_error: "Konfirmasi password wajib diisi",
        }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["password_confirmation"],
});
