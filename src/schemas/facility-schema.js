// schemas/facilitySchemas.js (atau .ts jika menggunakan TypeScript)
import { z } from 'zod';

const baseFacilitySchema = z.object({
    name: z.string()
        .min(1, { message: "Nama fasilitas wajib diisi." })
        .max(255, { message: "Nama fasilitas terlalu panjang." }),
    description: z.string()
        .min(1, { message: "Deskripsi wajib diisi." }),
    capacity: z.coerce.number()
        .min(0, { message: "Kapasitas tidak boleh kurang dari 0." })
        .int({ message: "Kapasitas harus bilangan bulat." }),
    price_per_hour: z.coerce.number()
        .min(0, { message: "Harga per jam tidak boleh kurang dari 0." }),
    status: z.enum(["available", "maintenance", "unavailable"], {
        errorMap: () => ({ message: "Status tidak valid. Pilihan: tersedia, perawatan, tidak tersedia." })
    }),
});

export const addFacilitySchema = baseFacilitySchema.extend({
    cover_image: z.union([
        z.instanceof(File).refine(file => file.size <= 2 * 1024 * 1024, `Ukuran gambar cover maksimal 2MB.`)
            .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), `Format gambar cover harus JPG, PNG, JPEG, atau WEBP.`),
        z.literal(null)
    ]).nullable().optional(),

    // facility_previews: Array of files, nullable/optional
    facility_previews: z.array(
        z.instanceof(File).refine(file => file.size <= 2 * 1024 * 1024, `Ukuran gambar preview maksimal 2MB.`)
            .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), `Format gambar preview harus JPG, PNG, JPEG, atau WEBP.`)
    ).nullable().optional(),
});

export const editFacilitySchema = baseFacilitySchema.extend({
    cover_image: z.union([
        z.instanceof(File).refine(file => file.size <= 2 * 1024 * 1024, `Ukuran gambar cover maksimal 2MB.`)
            .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), `Format gambar cover harus JPG, PNG, JPEG, atau WEBP.`),
        z.string().url({ message: "URL gambar cover tidak valid." }),
        z.literal(null)
    ]).nullable().optional(),

    // facility_previews: Array of Files (baru) atau array of objects (gambar yang sudah ada), nullable/optional
    facility_previews: z.array(
        z.union([
            z.instanceof(File).refine(file => file.size <= 2 * 1024 * 1024, `Ukuran gambar preview maksimal 2MB.`)
                .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), `Format gambar preview harus JPG, PNG, JPEG, atau WEBP.`),
            // Representasi gambar preview yang sudah ada dari backend (misalnya, { id: 1, image_path: 'url' })
            z.object({
                id: z.number().int(),
                image_path: z.string().url(),
                // Anda bisa menambahkan properti lain dari objek facility_preview di sini jika relevan
            })
        ])
    ).nullable().optional(),

    // Properti tambahan khusus untuk edit: Array ID gambar preview yang akan dihapus
    remove_facility_preview_id: z.array(z.coerce.number().int()) // Array of integers (IDs)
        .nullable()
        .optional(), // Bersifat opsional, hanya dikirim saat ada yang dihapus
    // Catatan: Validasi 'exists' (apakah ID preview memang ada di DB) harus di backend
    // karena ini melibatkan query database.
});