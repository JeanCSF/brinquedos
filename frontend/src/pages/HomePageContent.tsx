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

    const [filter, setFilter] = useState("");
    const filteredToys = toys.filter((toy) =>
        toy.toyId.toString().includes(filter.toLowerCase()) ||
        toy.description.toLowerCase().includes(filter.toLowerCase()) ||
        toy.brand.toLowerCase().includes(filter.toLowerCase()) ||
        toy.category.toLowerCase().includes(filter.toLowerCase()) ||
        toy.price.toString().includes(filter.toLowerCase())
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container">
                <BreadCrumb paths={paths} />
            <div className="text-end">
                <input
                    className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Buscar Brinquedo"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={filter ? Math.ceil(filteredToys.length / toysPerPage) : Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />

            <div className="flex flex-wrap">
                {filter ?
                    filteredToys.map((toy, index) => (
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
                    ))
                    :
                    currentToys.map((toy, index) => (
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
                    ))
                }
                {loading && <p>Loading...</p>}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={filter ? Math.ceil(filteredToys.length / toysPerPage) : Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />
        </div>
    );
};

export default HomePageContent;
