import { z } from "zod";

export const commentSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Konten komentar wajib diisi." })
        .max(1000, { message: "Konten komentar tidak boleh lebih dari 1000 karakter." }),

    // user_id: z.coerce.number().int().positive({ message: "ID pengguna wajib diisi dan harus angka positif." }),
    // news_id: z.coerce.number().int().positive({ message: "ID berita wajib diisi dan harus angka positif." }),
    // parent_id: z.coerce
    //     .number()
    //     .int()
    //     .positive({ message: "ID komentar induk harus angka positif jika ada." })
    //     .nullable()
    //     .optional(),
})
