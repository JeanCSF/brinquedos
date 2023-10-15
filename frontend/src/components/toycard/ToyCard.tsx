import React from "react";

interface ToyCardProps {
    brand: string;
    category: string;
    description: string;
    details: string;
    image: string;
    price: number;
    toyId: number;
}

const ToyCard: React.FC<ToyCardProps> = ({
    brand,
    category,
    description,
    details,
    image,
    price,
    toyId,
}) => {
    return (
        <div key={toyId} className="max-w-xs rounded overflow-hidden shadow-lg m-4 p-1 toy-card">
            <div className="toy-img">
                <img src={image} alt={description} />
            </div>
            <div className="px-4 py-2">
                <div className="font-bold text-xl mb-1">{description}</div>
                <p className="text-gray-700 text-base">{details}</p>
                <p className="text-gray-700 text-base">Marca: {brand}</p>
            </div>
            <div className="px-4 pt-4 pb-1">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {category}
                </span>
            </div>
            <span className="inline-block  rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                R$ {price.toFixed(2)}
            </span>
        </div>
    );
};

export default ToyCard;
