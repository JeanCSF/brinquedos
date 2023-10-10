import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../utils/UserContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { user, setUser } = useUserContext();

    const [formData, setFormData] = useState({
        user: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/toys/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }
            if (response.ok) {
                const responseData = await response.json();
                const authenticatedUser = {
                    isAdm: responseData.isAdm == 1? true : false,
                    userImg: `${responseData.userImg}`, 
                    userName: `${responseData.userName}`, 
                    userId: responseData.userId,
                };

                setUser(authenticatedUser);
                navigate('/home');
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl mb-4">Login</h2>
                <div className="mb-4">
                    <label htmlFor="user" className="block text-gray-700">Usuário</label>
                    <input
                        type="text"
                        id="user"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Senha</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
