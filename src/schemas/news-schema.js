import { z } from 'zod';

export const NewsSchema = z.object({
    title: z.string()
        .min(1, { message: "Judul berita wajib diisi." })
        .max(255, { message: "Judul berita tidak boleh lebih dari 255 karakter." }),

    content: z.string()
        .min(1, { message: "Konten berita wajib diisi." }), // Konten dari Quill adalah string HTML

    category_id: z.array(z.number().int().positive())
        .min(1, { message: "Pilih setidaknya satu kategori." })
        .refine((val) => val.every(id => typeof id === 'number' && id > 0), {
            message: "Setiap kategori ID harus berupa angka positif.",
        }),

    status: z.enum(["drafted", "published", "archived"], {
        errorMap: () => ({ message: "Status berita tidak valid. Pilihan: drafted, published, archived." })
    }),

    thumbnail: z.union([
        z.instanceof(File, { message: "Thumbnail harus berupa file gambar." })
            .refine((file) => file.size <= 2 * 1024 * 1024, `Ukuran gambar thumbnail maksimal 2MB.`)
            .refine((file) => ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type), {
                message: "Format gambar thumbnail tidak valid. Hanya JPG, PNG, dan GIF yang diizinkan."
            }),
        z.string(),
        z.null(),
    ]).optional(),
});