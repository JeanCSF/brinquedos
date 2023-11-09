import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { FaBars } from "react-icons/fa";

const HomePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-tdb-gray h-16">
                <Header />
            </header>
            <div className="flex-1 flex overflow-hidden">
                <div className={`flex w-1/5 bg-tdb-gray ${isOpen ? 'block translate-x-0 transition-transform duration-500 ease-in-out' : 'hidden -translate-x-full transition-transform duration-500 ease-in-out'}`}>
                    <Sidebar />
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:ml-0">
                    <div className={`fixed ${isOpen && isMobile ? 'ml-20' : ''}`}>
                        <FaBars onClick={handleToggle} style={{ cursor: "pointer" }} />
                    </div>
                    <Outlet />
                </div>
            </div>
            <footer className="bg-tdb-gray h-16 flex items-center justify-center">
                <Footer />
            </footer>
        </div>
    );
};
export default HomePage;
