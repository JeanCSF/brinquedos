import { useEffect, useState } from "react";
import axios from 'axios';
import { Toy } from "../../pages/AdminPage";

import CurrencyInput from "react-currency-input-field";
import Toast from "../notifications/Toast";



type ModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    toyToEdit: Toy | null;
};


const FormModal: React.FC<ModalProps> = (props: ModalProps) => {
    const [toyData, setToyData] = useState<Toy>({
        toyId: '',
        description: '',
        category: '',
        details: '',
        brand: '',
        price: 0,
        image: ''
    });

    useEffect(() => {
        if (props.toyToEdit) {
            setToyData(props.toyToEdit);
        } else {
            setToyData({
                toyId: '',
                description: '',
                category: '',
                details: '',
                brand: '',
                price: 0,
                image: ''
            });
        }
    }, [props.toyToEdit]);

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

    const [toyId, setToyId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [details, setDetails] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    if (!props.showModal) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setToyData({
            ...toyData,
            [name]: value,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setToyData({
            ...toyData,
            [name]: value,
        });
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setToyData({
            ...toyData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!toyId || !description || !category || !details || !brand || !price || !image) {
            showToast('Todos os Campos são obrigatórios', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('toy_id', toyId);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('details', details);
        formData.append('brand', brand);
        formData.append('price', price.replace(",", "."));
        if (image) {
            formData.append('image', image);
        }

        try {
            if (props.toyToEdit === null) {
                const response = await axios.post('http://localhost:8080/toys/api/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                showToast(response.data.message, 'success');
                props.setShowModal(false);
            } else {
                const response = await axios.put(`http://localhost:8080/toys/api/toy/${toyData.toyId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                showToast(response.data.message, 'success');
                props.setShowModal(false);
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
            {props.showModal && (
                <div className="fixed z-40 inset-0 overflow-y-auto mt-10">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => props.setShowModal(false)}
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
                                            type="text"
                                            placeholder="Código"
                                            value={toyData.toyId?.toString()}
                                            onChange={handleChange}
                                            readOnly={props.toyToEdit !== undefined}
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
                                            value={toyData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                        Categoria
                                    </label>
                                    <select
                                        value={toyData.category}
                                        onChange={handleSelectChange}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        <option value="Educativos">Educativos</option>
                                        <option value="Pelúcia">Pelúcia</option>
                                        <option value="Jogos de tabuleiro">Jogos de tabuleiro</option>
                                        <option value="Veículos de brinquedo">Veículos de brinquedo</option>
                                        <option value="Jogos de tabuleiro">Jogos de tabuleiro</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
                                        Detalhes
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="details"
                                        placeholder="Detalhes"
                                        value={toyData.details}
                                        onChange={handleTextareaChange}
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
                                            value={toyData.brand}
                                            onChange={handleChange}
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
                                            value={toyData.price || ''}
                                            decimalsLimit={2}
                                            onValueChange={(value) => setPrice(value || '')}
                                            prefix="R$"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Ajuste a largura conforme necessário
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                        Imagem
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="image"
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        {props.toyToEdit ? 'Atualizar' : 'Salvar'}
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
