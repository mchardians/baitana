import '../globals.css';

import {AuthProvider} from "@/context/AuthContext";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AOSInit from "@/components/AOSInit";

export default function LandingLayout({ children }) {
    return (
        <>
        <AuthProvider>
            <AOSInit />
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow flex flex-col">
                    {children}
                </main>
                <Footer />
            </div>
        </AuthProvider>
        </>
    );
}
