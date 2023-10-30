import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import img1 from './img1.svg';
import img2 from './img2.svg';
import img3 from './img3.svg';
import img4 from './img4.svg';

import BreadCrumb from "../../components/breadcrumb/BreadCrumb";

const CategoryPage: React.FC = () => {
    const paths = [
        { name: "Home", path: "/" },
        { name: "Catalogo de Brinquedos", path: "/catalog" },
    ];
    const images = useMemo(
        () => [img1, img2, img3, img4],
        []
    );
    const [randomImage, setRandomImage] = useState(images[0]);
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * images.length);
            setRandomImage(images[randomIndex]);
        }, 2500);

        return () => clearInterval(interval);
    }, [images]);

    const [categories, setCategories] = useState<any[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8080/toys/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching toys:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container">
            <BreadCrumb paths={paths} />
            <div className="flex flex-wrap gap-8 mt-5">
                {categories.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4" style={{maxWidth:250}}>
                            <img src={randomImage} alt="Category" className="w-full h-64 object-cover mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{category}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
