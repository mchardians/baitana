import Image from "next/image"

export default function DonationSection() {
    return (
        <section className="relative h-[620px] lg:h-[410px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/landing/donation-background.png"
                    alt="Background Donation Section"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>
            <div className="relative z-10 text-white text-center w-full">
                <div className="px-6 lg:px-[86px]">
                    <h1 className="text-xl lg:text-3xl">Infaq & Sedekah</h1>
                    <h1 className="text-lg lg:text-4xl font-bold mt-2">Berkontribusi untuk kemaslahatan umat</h1>

                    <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-24 mt-6 lg:mt-8">
                        <div className="flex flex-col items-center justify-center gap-4 lg:gap-12">
                            <div>
                                <h3 className="lg:text-lg">Bank Syariah Indonesia</h3>
                                <h1 className="text-3xl font-bold">1420 5789 3000</h1>
                            </div>
                            <div>
                                <h3 className="text-lg">Bank Syariah Indonesia</h3>
                                <h1 className="text-3xl font-bold">1420 5789 3000</h1>
                            </div>
                        </div>
                        {/*<div className="flex flex-col items-center justify-between">*/}
                        {/*    <div>*/}
                        {/*        <h3 className="text-lg">Bank Syariah Indonesia</h3>*/}
                        {/*        <h1 className="text-3xl font-bold">1420 5789 3000</h1>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <h3 className="text-lg">Bank Syariah Indonesia</h3>*/}
                        {/*        <h1 className="text-3xl font-bold">1420 5789 3000</h1>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="flex flex-col items-center justify-between gap-4">
                            <h3 className="text-lg">QRIS</h3>
                            <div className="bg-white rounded-md p-2">
                                <Image
                                    src="/images/landing/qris.png"
                                    alt="Logo Baitana"
                                    width={100}
                                    height={100}
                                    className="w-48 lg:w-32 h-auto"
                                    priority
                                />
                            </div>
                            <h6 className="text-lg">Scan untuk berinfaq melalui QRIS</h6>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}