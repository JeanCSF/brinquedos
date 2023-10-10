import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa'

import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

const Home: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="flex main-container">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-grow">
                <Header />
                <button className="text-l absolute top-12 mt-5" onClick={toggleSidebar}><FaBars /></button>
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
