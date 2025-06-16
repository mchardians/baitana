/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http', // Atau 'https' jika Laravel Anda sudah menggunakan HTTPS
                hostname: 'localhost',
                port: '8000', // Pastikan ini sesuai dengan port Laravel Anda
                pathname: '/storage/**', // Path di Laravel tempat gambar disimpan
            },
            // Anda bisa menambahkan pola lain di sini jika ada domain gambar lain
        ],
    },
    reactStrictMode: false,
    transpilePackages: ['quill'],
};

export default nextConfig;
