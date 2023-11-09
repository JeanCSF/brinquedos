import { useState, useEffect } from "react";
import axios from "axios";

import { BsFillGearFill, BsFillPencilFill, BsTrash3, BsPlus } from "react-icons/bs";
import Pagination from "../components/pagination/Pagination";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import FormUsersModal from "../components/modal/FormUsersModal";
import DeleteModal from "../components/modal/DeleteModal";
import Toast from "../components/notifications/Toast";

export interface User {
    userId: number;
    userName: string;
    password: string;
    isAdm: string;
    userImg: string;
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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


    const [filter, setFilter] = useState("");
    const filteredUsers = users.filter((user) =>
        user.userId.toString().includes(filter.toLowerCase()) ||
        user.userName.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/toys/api/user/${userToDelete}`);

            if (response.status !== 200) {
                const errorResponse = response.data;
                throw new Error(`Erro na requisição: ${errorResponse.message}`);
            }

            const responseData = response.data;
            showToast(responseData.message, `${responseData.status === 200 ? 'success' : 'error'}`);
            setUserToDelete(null);
            setShowDeleteModal(false);
            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userToDelete));
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="container">
            <BreadCrumb paths={paths} />
            <Toast
                message={toastMessage}
                type={toastType}
                isToastVisible={isToastVisible}
                hideToast={hideToast}
            />
            <FormUsersModal
                showModal={showModal}
                setShowModal={setShowModal}
                userToEdit={userToEdit}
                addNewUser={addNewUser}
                updateUser={updateUser}
            />
            <DeleteModal
                showModal={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseModal}
            />
            <div className="flex justify-between mt-3">
                <input
                    className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Buscar Registro"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button
                    onClick={() => {
                        setShowModal(true);
                        setUserToEdit(null);
                    }}
                    title="Adicionar Usuário"
                    className="text-lime-700 flex items-center bg-tdb-gray hover:bg-lime-500 hover:text-zinc-50 p-2 rounded-lg shadow-lg text-3xl">
                    <BsPlus /><span className="text-xl font-semibold">Adicionar Usuário</span>
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
                    {filter ?
                        filteredUsers.map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={user.userImg} alt={user.userName} className="h-10 w-10 rounded-full" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.isAdm === "1" ? 'Sim' : 'Não'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            className="text-blue-500"
                                            onClick={() => {
                                                setUserToEdit(user);
                                                setShowModal(true);
                                            }}
                                        ><BsFillPencilFill /></button>
                                        <button
                                            className="text-red-500"
                                            onClick={() => {
                                                setUserToDelete(user.userId);
                                                setShowDeleteModal(true);
                                            }}>
                                            <BsTrash3 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        :
                        currentUsers.map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={user.userImg} alt={user.userName} className="h-10 w-10 rounded-full" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.isAdm === "1" ? 'Sim' : 'Não'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            className="text-blue-500"
                                            onClick={() => {
                                                setUserToEdit(user);
                                                setShowModal(true);
                                            }}
                                        ><BsFillPencilFill /></button>
                                        <button
                                            className="text-red-500"
                                            onClick={() => {
                                                setUserToDelete(user.userId);
                                                setShowDeleteModal(true);
                                            }}>
                                            <BsTrash3 />
                                        </button>
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
