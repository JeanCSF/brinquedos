import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { FaBars } from "react-icons/fa";

const HomePage: React.FC = () => {
    const { isAdm } = useContext(AuthContext);
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
            <header className="bg-gray-200 h-16">
                <Header />
            </header>
            <div className="flex-1 flex overflow-hidden">
                {isOpen && (
                    <div className="flex w-1/5 bg-gray-200">
                        <Sidebar isAdm={isAdm} isOpen={isOpen} handleToggle={handleToggle} />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6 lg:ml-0">
                    <div className={`fixed ${isOpen && isMobile ? 'ml-20' : ''}`} onClick={handleToggle}>
                        <FaBars />
                    </div>
                    <Outlet />
                </div>
            </div>
            <footer className="bg-gray-200 h-16 flex items-center justify-center">
                <Footer />
            </footer>
        </div>
    );
};
export default HomePage;
