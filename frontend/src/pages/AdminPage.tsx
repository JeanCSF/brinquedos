import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { BsFillGearFill, BsFillPencilFill, BsTrash3, BsPlus } from "react-icons/bs";
import Pagination from "../components/pagination/Pagination";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import FormModal from "../components/modal/FormModal";

export interface Toy {
    toyId: string;
    description: string;
    category: string;
    details: string;
    brand: string;
    price: number;
    image: string;
}

const AdminPage: React.FC = () => {
    const paths = [
        { name: "Home", path: "/" },
        { name: "Administração", path: "/admin" },
    ];
    const [toys, setToys] = useState<Toy[]>([]);
    const addNewToy = (newToy: Toy) => {
        setToys([...toys, newToy]);
    };

    const updateToy = (updatedToy: Toy) => {
        const updatedToys = toys.map((toy) => {
            if (toy.toyId === updatedToy.toyId) {
                return updatedToy;
            }
            return toy;
        });
        setToys(updatedToys);
    };

    const [toyToEdit, setToyToEdit] = useState<Toy | null>(null);
    const [toyToDelete, setToyToDelete] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [toysPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);

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
        <div className="container mx-auto p-6">
            <BreadCrumb paths={paths} />
            <FormModal
                showModal={showModal}
                setShowModal={setShowModal}
                toyToEdit={toyToEdit}
                addNewToy={addNewToy}
                updateToy={updateToy}
            />
            <div className="text-end">
                <button
                    onClick={() => {
                        setShowModal(true);
                        setToyToEdit(null);
                    }}
                    title="Adicionar Brinquedo"
                    className="text-lime-700 text-3xl">
                    <BsPlus />
                </button>
            </div>
            {loading && <p>Loading...</p>}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />
            <table className="min-w-full divide-y divide-gray-200 mt-1">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center justify-center">
                                <BsFillGearFill />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentToys.map((toy, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={toy.image} alt={toy.brand} className="h-10 w-10 rounded-full" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"><Link to={`../toy/${toy.toyId}`}>{toy.description}</Link></td>
                            <td className="px-6 py-4 whitespace-nowrap">{toy.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{toy.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">R$ {toy.price.toFixed(2).replace(".", ",")}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => {
                                            setToyToEdit(toy);
                                            setShowModal(true);
                                        }}
                                    ><BsFillPencilFill /></button>
                                    <button className="text-red-500"><BsTrash3 /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(toys.length / toysPerPage)}
                onPageChange={paginate}
            />
        </div>
    );
};

export default AdminPage;
