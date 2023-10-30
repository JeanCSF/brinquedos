import { useContext } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";

import { AuthProvider, AuthContext } from "../contexts/auth";
import { ReactNode } from "react";

import AdminPage from "../pages/AdminPage";
import Error401Page from "../pages/Error401Page";

import HomePageContent from "../pages/HomePageContent";
import ToyPage from "../pages/ToyPage";
import CategoryPage from "../pages/category/CategoryPage";

const Private = ({ children }: { children: ReactNode }) => {
    const { authenticated, loading } = useContext(AuthContext);
    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

const Admin = ({ children }: { children: ReactNode }) => {
    const { loading, isAdm } = useContext(AuthContext);

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (isAdm != '1') {
        return <Navigate to="/unauthorized" />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route element={<Private> <HomePage /> </Private>}>
                        <Route path="/" element={<HomePageContent />} />
                        <Route path="/toy/:id" element={<ToyPage />} />
                        <Route path="/catalog" element={<CategoryPage />} />
                        <Route path="/unauthorized" element={<Error401Page />} />
                        <Route path="/admin" element={<Admin> <AdminPage /> </Admin>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
