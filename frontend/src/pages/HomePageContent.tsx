import { useState, useEffect } from "react";
import axios from "axios";
import ToyCard from "../components/toycard/ToyCard";
import Pagination from "../components/pagination/Pagination";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";

const HomePageContent: React.FC = () => {
    const paths = [{ name: "Home", path: "/" },];
    const [toys, setToys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [toysPerPage] = useState(12);

    const fetchToys = async () => {
        try {
            const response = await axios.get("http://localhost:8080/toys/api/all");
            setToys(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching toys:", error);
        }
    };

    useEffect(() => {
        fetchToys();
    }, []);

    const indexOfLastToy = currentPage * toysPerPage;
    const indexOfFirstToy = indexOfLastToy - toysPerPage;
    const currentToys = toys.slice(indexOfFirstToy, indexOfLastToy);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />
            <BreadCrumb paths={paths} />

            <div className="flex flex-wrap">
                {currentToys.map((toy, index) => (
                    <ToyCard
                        key={index}
                        brand={toy.brand}
                        category={toy.category}
                        description={toy.description}
                        details={toy.details}
                        image={toy.image}
                        price={toy.price}
                        toyId={toy.toyId}
                    />
                ))}
                {loading && <p>Loading...</p>}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />
        </div>
    );
};

export default HomePageContent;
