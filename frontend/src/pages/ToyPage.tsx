import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import BreadCrumb from "../components/breadcrumb/BreadCrumb";

const ToyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [toy, setToy] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchToy = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/toys/api/toy/${id}`);
            setToy(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching toys:", error);
        }
    };

    useEffect(() => {
        fetchToy();
    }, []);
    const paths = [
        { name: "Home", path: "/" },
        { name: `Brinquedo - ${toy.description}`, path: `/toy/${id}` },
    ];
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <BreadCrumb paths={paths} />
            <div className="flex flex-wrap items-center justify-start gap-12 my-12">
                <div className="max-w-md">
                    <img src={toy.image} alt={toy.name} className="mx-auto" style={{ maxWidth: '100%' }} />
                </div>
                <div className="max-w-md">
                    <p className="text-gray-500 mb-2">Código: {toy.toyId}</p>
                    <h1 className="text-3xl font-bold mb-4">{toy.description}</h1>
                    <p className="text-xl font-semibold mb-4">R$ {toy.price.toFixed(2).replace(".", ",")}</p>
                    <p className="text-gray-700 mb-4">Categoria: {toy.category}</p>
                </div>
            </div>
            <p className="text-gray-700 font-semibold">Detalhes:</p>
            <div className="border-2 rounded-md p-1 h-64">
                {toy.details}
            </div>
        </div>
    );
};

export default ToyPage;
