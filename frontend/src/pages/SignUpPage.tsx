import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/notifications/Toast';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [userImage, setUserImage] = useState<File | null>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        const regex = /^[a-zA-Z0-9_]*$/;

        if (regex.test(userInput)) {
            setUser(userInput);
        } else {
            showToast('O nome de usuário não pode conter caracteres especiais!', 'warning');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !password || !userImage) {
            showToast('Todos os Campos são obrigatórios', 'warning');
            return;
        }
        const formData = new FormData();
        formData.append('user', user);
        formData.append('password', password);
        formData.append('adm', "0");
        if (userImage) {
            formData.append('user_img', userImage);
        }

        try {
            const response = await axios.post('http://localhost:8080/toys/api/user-new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'

                }
            });
            showToast(response.data.message, 'success');
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    showToast(error.response.data.message, 'error')
                } else {
                    console.error('Error during signup:', error.message);
                }
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 bg-white rounded p-8 shadow">
                <h2 className="text-2xl font-bold mb-4">Criar Conta</h2>
                <Toast
                    message={toastMessage}
                    type={toastType}
                    isToastVisible={isToastVisible}
                    hideToast={hideToast} />
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user">
                            Usuário
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="user"
                            name="user"
                            type="text"
                            placeholder="Digite seu usuário"
                            value={user}
                            onChange={handleInputChange}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_image">
                            Imagem
                        </label>
                        <input
                            type="file"
                            id="user_image"
                            name="user_image"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setUserImage(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                    <div className='flex justify-between'>
                        <button
                            className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            <Link to="javascript:history.go(-1)">Voltar</Link>
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
