import { useEffect, useState } from "react";
import { User } from "../../pages/AdminUsersPage";
import axios from 'axios';

import Toast from "../notifications/Toast";

type UserModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    userToEdit: User | null;
    addNewUser: (user: User) => void;
    updateUser: (user: User) => void;
}

const FormUsersModal: React.FC<UserModalProps> = ({ showModal, setShowModal, userToEdit, addNewUser, updateUser }) => {
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

    const [userId, setUserId] = useState<string | null>("");
    const [userName, setUserName] = useState<string | null>("");
    const [password, setPassword] = useState<string | null>("");
    const [isAdm, setIsAdm] = useState<string | null>("");
    const [userImg, setUserImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");


    const formReset = () => {
        setUserId("");
        setUserName("");
        setPassword("");
        setIsAdm("")
        setUserImage(null);
        setImageUrl("");
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
            setUserImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (userToEdit) {
            setUserId(userToEdit.userId.toString());
            setUserName(userToEdit.userName);
            setPassword(userToEdit.password);
            setIsAdm(userToEdit.isAdm);
            setImageUrl(userToEdit.userImg);
        } else {
            formReset();
        }
    }, [userToEdit]);

    if (!showModal) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userName || !password || !isAdm || !userImg) {
            showToast('Todos os Campos são obrigatórios', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('user', userName);
        formData.append('password', password);
        formData.append('adm', isAdm);
        if (userImg) {
            formData.append('user_img', userImg);
        }

        try {
            if (userToEdit === null) {
                const response = await axios.post('http://localhost:8080/toys/api/user-new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                showToast(response.data.logs.message, `${response.data.logs.status == 201 ? 'success' : 'error'}`);
                addNewUser(response.data.user);
                formReset();
                setTimeout(() => {
                    setShowModal(false);
                }, 500);
            } else {
                const response = await axios.put(`http://localhost:8080/toys/api/user/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'

                    }
                });
                updateUser(response.data.user);
                formReset();
                showToast(response.data.logs.message, `${response.data.logs.status == 200 ? 'success' : 'error'}`);
                setTimeout(() => {
                    setShowModal(false);
                }, 500);
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
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user">
                                        Usuário
                                    </label>
                                    <input
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="user"
                                        name="user"
                                        type="text"
                                        placeholder="Digite o usuário"
                                        value={userName?.toString()}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Senha
                                    </label>
                                    <input
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="**********"
                                        value={password?.toString()}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                        Usuário Administrador
                                    </label>
                                    <select
                                        value={isAdm?.toString()}
                                        onChange={(e) => setIsAdm(e.target.value)}
                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="1">Sim</option>
                                        <option value="0">Não</option>
                                    </select>
                                </div>
                                {imageUrl && (
                                    <div className="flex justify-center">
                                        <img src={imageUrl} />

                                    </div>
                                )}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_image">
                                        Imagem
                                    </label>
                                    <input
                                        type="file"
                                        id="user_image"
                                        name="user_image"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className='text-end'>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        {userToEdit ? 'Atualizar' : 'Salvar'}
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

export default FormUsersModal;
