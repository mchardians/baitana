"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function BookingGuideModal({ isOpen, onClose }) {
    const bookingGuideItems = [
        {
            value: "item-1",
            question: "01. Login terlebih dahulu",
            answer:
                "Anda dapat memesan fasilitas dengan memilih tanggal dan sesi yang tersedia di formulir pemesanan, lalu klik 'Cek Ketersediaan' dan ikuti langkah selanjutnya.",
        },
        {
            value: "item-2",
            question: "02. Pilih Fasilitas",
            answer:
                "Pembatalan pemesanan dapat dilakukan melalui halaman riwayat pemesanan Anda. Harap perhatikan kebijakan pembatalan yang berlaku.",
        },
        {
            value: "item-3",
            question: "03. Pilih Hari dan Waktu",
            answer:
                "Kami menerima pembayaran melalui transfer bank, kartu kredit, dan dompet digital. Detail lebih lanjut akan diberikan saat proses checkout.",
        },
        {
            value: "item-4",
            question: "04. Isi formulir secara detail",
            answer:
                "Jika fasilitas tidak tersedia pada tanggal atau sesi yang Anda pilih, Anda dapat mencoba memilih tanggal atau sesi lain, atau mencari fasilitas serupa lainnya.",
        },
        {
            value: "item-5",
            question: "05. Konfirmasi Reservasi",
            answer:
                "Jika fasilitas tidak tersedia pada tanggal atau sesi yang Anda pilih, Anda dapat mencoba memilih tanggal atau sesi lain, atau mencari fasilitas serupa lainnya.",
        },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Panduan Pemesanan</DialogTitle>
                </DialogHeader>
                <div className="py-1">
                    <Accordion type="single" collapsible className="w-full">
                        {bookingGuideItems.map((item) => (
                            <AccordionItem key={item.value} value={item.value}>
                                <AccordionTrigger className="no-underline hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    )
}
