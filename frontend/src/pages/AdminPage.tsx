import { useState, useEffect } from "react";
import axios from "axios";

import { BsFillGearFill, BsFillPencilFill, BsTrash3, BsPlus } from "react-icons/bs";
import Pagination from "../components/pagination/Pagination";
import FormModal from "../components/modal/FormModal";

const AdminPage: React.FC = () => {
    const [toys, setToys] = useState<any[]>([]);
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
            <FormModal showModal={showModal} setShowModal={setShowModal} />
            <div className="text-end">
                <button onClick={() => setShowModal(true)} title="Adicionar Brinquedo" className="text-lime-700 text-3xl"><BsPlus /></button>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
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
                            <td className="px-6 py-4 whitespace-nowrap">{toy.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{toy.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{toy.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{toy.details}</td>
                            <td className="px-6 py-4 whitespace-nowrap">R$ {toy.price.toFixed(2).replace(".", ",")}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-blue-500"><BsFillPencilFill /></button>
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
