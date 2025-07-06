/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http', // Atau 'https' jika Laravel Anda sudah menggunakan HTTPS
                hostname: '34.101.212.234',
                port: '8000', // Pastikan ini sesuai dengan port Laravel Anda
                pathname: '/storage/**', // Path di Laravel tempat gambar disimpan
            },
        ],
    },
    reactStrictMode: false,
    transpilePackages: ['quill'],
};

export default nextConfig;
