import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

const HomePage: React.FC = () => {
    return (
        <main className="h-screen">
            <header className='bg-gray-200 h-16'>
                <Header />
            </header>
            <div className='containerNavAndComponent flex flex-row gap-24'>
                <div className='navBar w-1/5'>
                    <Sidebar />
                </div>
                <div className='component w-4/5 mt-12'>
                    <Outlet />
                </div>
            </div>
            <footer className="bg-gray-200 h-16 flex items-center justify-center">
                <Footer />
            </footer>
        </main>
    );
};
export default HomePage;