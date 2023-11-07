import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { BsFillGearFill, BsFillPencilFill, BsTrash3, BsPlus } from "react-icons/bs";
import Pagination from "../components/pagination/Pagination";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import FormUsersModal from "../components/modal/FormUsersModal";

export interface User {
    userId: number;
    userName: string;
    password: string;
    isAdm: string;
    userImg: File | null;
}

const AdminUsersPage: React.FC = () => {
    const paths = [
        { name: "Home", path: "/" },
        { name: "Administração - Usuários", path: "/admin" },
    ];
    const [users, setUsers] = useState<User[]>([]);
    const addNewUser = (newUser: User) => {
        setUsers([...users, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        const updatedUsers = users.map((user) => {
            if (user.userId === updatedUser.userId) {
                return updatedUser;
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/toys/api/user-all");
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching toys:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto p-6">
            <BreadCrumb paths={paths} />
            <FormUsersModal
                showModal={showModal}
                setShowModal={setShowModal}
                userToEdit={userToEdit}
                addNewUser={addNewUser}
                updateUser={updateUser}
            />
            <div className="text-end">
                <button
                    onClick={() => {
                        setShowModal(true);
                        setUserToEdit(null);
                    }}
                    title="Adicionar Usuário"
                    className="text-lime-700 text-3xl">
                    <BsPlus />
                </button>
            </div>
            {loading && <p>Loading...</p>}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(users.length / usersPerPage)}
                onPageChange={paginate}
            />
            <table className="min-w-full divide-y divide-gray-200 mt-1">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADM.</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center justify-center">
                                <BsFillGearFill />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={user.userImg} alt={user.userName} className="h-10 w-10 rounded-full" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"><Link to={`../toy/${user.userName}`}>{user.userName}</Link></td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.isAdm === "1"? 'Sim' : 'Não'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => {
                                            setUserToEdit(user);
                                            setShowModal(true);
                                        }}
                                    ><BsFillPencilFill /></button>
                                    <button className="text-red-500"><BsTrash3 /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(users.length / usersPerPage)}
                onPageChange={paginate}
            />
        </div>
    );
};

export default AdminUsersPage;
