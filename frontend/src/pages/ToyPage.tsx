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
        <div className="container mx-auto mt-8">
            <BreadCrumb paths={paths}/>
            <h1 className="text-3xl font-bold text-center mb-8">{toy.description}</h1>
            <div className="bg-white shadow-md rounded-md p-6">
                <img src={toy.image} alt={toy.name} className="mt-4 mx-auto" style={{ maxWidth: '300px' }} />
                <div className="p-6">
                <p className="text-gray-700">Código: {toy.toyId}</p>
                <p className="text-gray-700">Categoria: {toy.category}</p>
                <p className="text-gray-700">Marca: {toy.brand}</p>
                <p className="text-gray-700">Detalhes: {toy.details}</p>
                <p className="text-gray-700">Preço: R$ {toy.price.toFixed(2).replace(".", ",")}</p>
                </div>
            </div>
        </div>
    );
};

export default ToyPage;
