import { useEffect, useState } from "react";
import axios from 'axios';

import CurrencyInput from "react-currency-input-field";
import Toast from "../notifications/Toast";

import { Toy } from "../../pages/AdminPage";

type ModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    toyToEdit: Toy | null;
    addNewToy: (toy: Toy) => void;
    updateToy: (toy: Toy) => void;
};
const FormModal: React.FC<ModalProps> = ({ showModal, setShowModal, toyToEdit, addNewToy, updateToy }) => {
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('error');

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToastMessage(message);
        setToastType(type);
        setIsToastVisible(true);
    };

    const hideToast = () => {
        setIsToastVisible(false);
    };

    const [toyId, setToyId] = useState<string | null>("");
    const [description, setDescription] = useState<string | null>("");
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8080/toys/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Erro ao obter categorias:', error);
            }
        };

        fetchCategorias();
    }, []);
    const [details, setDetails] = useState<string | null>("");
    const [brand, setBrand] = useState<string | null>("");
    const [price, setPrice] = useState<string | null>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    const formReset = () => {
        setToyId("");
        setCategory("");
        setBrand("");
        setDescription("");
        setDetails("")
        setPrice("");
        setImage(null);
        setImageUrl("");
        setShowCustomCategory(false);
        setCustomCategory("")
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === 'custom') {
            setShowCustomCategory(true);
        } else {
            setShowCustomCategory(false);
            setCategory(selectedCategory);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setImageUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
            setImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (toyToEdit) {
            setToyId(toyToEdit.toyId);
            setDescription(toyToEdit.description);
            setCategory(toyToEdit.category);
            setDetails(toyToEdit.details);
            setBrand(toyToEdit.brand);
            setPrice(toyToEdit.price.toString());
            setImageUrl(toyToEdit.image);
        } else {
            formReset();
        }
    }, [toyToEdit]);

    if (!showModal) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!toyId || !description || (!category && !customCategory) || !details || !brand || !price || !image) {
            showToast('Todos os Campos são obrigatórios', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('toy_id', toyId);
        formData.append('description', description);
        formData.append('category', customCategory || category);
        formData.append('details', details);
        formData.append('brand', brand);
        formData.append('price', price.replace(",", "."));
        if (image) {
            formData.append('image', image);
        }

        try {
            if (toyToEdit === null) {
                const response = await axios.post('http://localhost:8080/toys/api/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                showToast(response.data.logs.message, `${response.data.logs.status == 201 ? 'success' : 'error'}`);
                addNewToy(response.data.toy);
                formReset();
                setTimeout(() => {
                    setShowModal(false);
                }, 1000);
            } else {
                const response = await axios.put(`http://localhost:8080/toys/api/toy/${toyId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                updateToy(response.data.toy);
                formReset();
                setShowModal(false);
                showToast(response.data.logs.message, `${response.data.logs.status == 200 ? 'success' : 'error'}`);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showToast(error.response.data.message, 'error')
                } else {
                    console.error('Error during insert:', error.message);
                }
            }
        }
    };

    return (
        <div>
            <Toast
                message={toastMessage}
                type={toastType}
                isToastVisible={isToastVisible}
                hideToast={hideToast}
            />
            {showModal && (
                <div className="fixed z-40 inset-0 overflow-y-auto mt-10">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowModal(false)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                        >
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toy_id">
                                            Código
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="toy_id"
                                            type="number"
                                            min="1" max="4294967295"
                                            placeholder="Código"
                                            value={toyId?.toString()}
                                            onChange={(e) => setToyId(e.target.value)}
                                            readOnly={toyToEdit !== null}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                            Descrição
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="description"
                                            type="text"
                                            placeholder="Descrição"
                                            value={description?.toString()}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                        Categoria
                                    </label>
                                    <select
                                        value={category}
                                        onChange={handleCategoryChange}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        {categories && (<option value="">Selecione uma categoria</option>)}
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                        <option value="custom">Inserir nova categoria</option>
                                    </select>
                                </div>
                                {showCustomCategory && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customCategory">
                                            Nova Categoria
                                        </label>
                                        <input
                                            type="text"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
                                        Detalhes
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="details"
                                        placeholder="Detalhes"
                                        value={details?.toString()}
                                        onChange={(e) => setDetails(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                                            Marca
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="brand"
                                            type="text"
                                            placeholder="Marca"
                                            value={brand?.toString()}
                                            onChange={(e) => setBrand(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                            Preço
                                        </label>
                                        <CurrencyInput
                                            id="price"
                                            name="price"
                                            placeholder="Preço"
                                            value={price || ''}
                                            decimalsLimit={2}
                                            onValueChange={(value) => setPrice(value || '')}
                                            prefix="R$"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Ajuste a largura conforme necessário
                                        />
                                    </div>
                                </div>
                                {imageUrl && (
                                    <div className="flex justify-center">
                                        <img src={imageUrl} />

                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                        Imagem
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="image"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        {toyToEdit ? 'Atualizar' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormModal;
