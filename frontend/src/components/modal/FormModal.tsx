import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

type ModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
};

const FormModal: React.FC<ModalProps> = ({ showModal, setShowModal }) => {
    const [toyId, setToyId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [details, setDetails] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState<string>('');

    if (!showModal) {
        return null;
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    return (
        <div>
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
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
                                            Toy ID
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="toy_id"
                                            type="text"
                                            placeholder="Código"
                                            value={toyId}
                                            onChange={(e) => setToyId(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                            Description
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="description"
                                            type="text"
                                            placeholder="Descrição"
                                            value={description}
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
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        <option value="category1">Categoria 1</option>
                                        <option value="category2">Categoria 2</option>
                                        <option value="category3">Categoria 3</option>
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
                                        value={details}
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
                                            value={brand}
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
                                            className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Ajuste a largura conforme necessário
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
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Enviar
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
