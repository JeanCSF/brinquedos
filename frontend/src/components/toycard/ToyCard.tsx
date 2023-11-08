import { Link } from "react-router-dom";


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
    image,
    price,
    toyId,
}) => {
    return (
        <div key={toyId} className="max-w-md rounded overflow-hidden shadow-lg m-2 p-2 toy-card flex flex-col justify-between">
            <Link to={`../toy/${toyId}`}>
                <div className="toy-img">
                    <img src={image} alt={description} />
                </div>
                <div className="px-4 py-2">
                    <div className="font-bold text-xl mb-1">{description.length > 50 ? `${description.slice(0, 50)}...`: description}</div>
                </div>
            </Link>
            <div>
                <p className="text-gray-700 text-base px-4 py-2">Marca: {brand}</p>
                <Link to={`../category/${category}`}>
                    <div className="px-2 pt-2 pb-1">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                            {category}
                        </span>
                    </div>
                </Link>
                <p className="inline-block bottom-0 rounded-full px-3 py-1 text-lg font-semibold text-gray-700">
                    R$ {price.toFixed(2).replace(".", ",")}
                </p>
            </div>
        </div>
    );
};

export default ToyCard;
