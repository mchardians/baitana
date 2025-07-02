import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    RockingChairIcon as Chair,
    Monitor,
    Table,
    Wifi,
    AirVent,
    Clipboard,
    Lightbulb,
    Power,
    MapPin,
} from "lucide-react"
import Image from "next/image"

const iconMap = {
    Chair: Chair,
    Monitor: Monitor,
    Table: Table,
    Wifi: Wifi,
    AirVent: AirVent,
    Clipboard: Clipboard,
    Lightbulb: Lightbulb,
    Power: Power,
}

export default function FacilityInfoTabs({ facility }) {
    if (!facility) return null

    return (
        <Tabs defaultValue="deskripsi" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="deskripsi">Deskripsi</TabsTrigger>
                <TabsTrigger value="fasilitas">Fasilitas</TabsTrigger>
                <TabsTrigger value="lokasi">Lokasi</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>
            <TabsContent value="deskripsi" className="py-4">
                <h2 className="text-2xl font-bold mb-4">Tentang {facility.name}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">{facility.description}</p>
            </TabsContent>
            <TabsContent value="fasilitas" className="py-4">
                <h2 className="text-2xl font-bold mb-4">Fasilitas</h2>
                <div className="grid grid-cols-2 gap-4">
                    {facility.amenities &&
                        facility.amenities.map((amenity, index) => {
                            const IconComponent = iconMap[amenity.icon]
                            return (
                                <div key={index} className="flex items-center gap-2 text-gray-700">
                                    {IconComponent && <IconComponent className="w-5 h-5 text-gray-500" />}
                                    <span>{amenity.name}</span>
                                </div>
                            )
                        })}
                </div>
            </TabsContent>
            <TabsContent value="lokasi" className="py-4">
                <h2 className="text-2xl font-bold mb-4">Lokasi</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-4">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>{facility.location?.floor}</span>
                    </div>
                    {facility.location?.map && (
                        <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
                            <Image
                                src={facility.location.map || "/placeholder.svg"}
                                alt="Floor plan"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="faqs" className="py-4">
                <h2 className="text-2xl font-bold mb-4">Pertanyaan Umum</h2>
                <p className="text-gray-700">Konten FAQ akan ditampilkan di sini.</p>
            </TabsContent>
        </Tabs>
    )
}
