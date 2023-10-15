import { useState, useContext } from "react";
import { AuthContext } from "../contexts/auth";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(userName, password)
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 bg-white rounded p-8 shadow">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Usuário
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Digite seu usuário"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="text-end">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

                        >
                            Entrar
                        </button>
                    </div>
                    <div className="mt-4">
                        <p>Não tem uma conta? <Link to="/signup" className="text-blue-500 hover:underline">Criar uma conta</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
