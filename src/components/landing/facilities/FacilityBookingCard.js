"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function FacilityBookingCard({ facility }) {
    if (!facility) return null

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>{facility.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="tanggal-mulai" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Mulai
                        </label>
                        <Input id="tanggal-mulai" type="date" defaultValue={today} />
                    </div>
                    <div>
                        <label htmlFor="tanggal-selesai" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Selesai
                        </label>
                        <Input id="tanggal-selesai" type="date" defaultValue={today} />
                    </div>
                </div>
                <div>
                    <label htmlFor="sesi" className="block text-sm font-medium text-gray-700 mb-1">
                        Sesi
                    </label>
                    <Select>
                        <SelectTrigger className="w-full" id="sesi">
                            <SelectValue placeholder="Pilih Sesi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sesi1">08:00 - 10:00</SelectItem>
                            <SelectItem value="sesi2">10:00 - 12:00</SelectItem>
                            <SelectItem value="sesi3">13:00 - 15:00</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full bg-[#2C3E9E] hover:bg-[#3f51b5] text-white">Cek Ketersediaan</Button>
            </CardContent>
        </Card>
    )
}
