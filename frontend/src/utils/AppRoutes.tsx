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
import HomePageContent from "../pages/HomePageContent";
import AdminPage from "../pages/AdminPage";

const Private = ({ children }: { children: ReactNode }) => {
    const { authenticated, loading} = useContext(AuthContext);
    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

const Admin = ({ children }: { children: ReactNode }) => {
    const { authenticated, loading, isAdm} = useContext(AuthContext);
    console.log('admin '+isAdm)
    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (isAdm != '1') {
        return <Navigate to="/" />;
    }
    return children;
};

const AppRoutes = () => {
    const { isAdm } = useContext(AuthContext);
    console.log('routes'+isAdm)
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route element={<Private> <HomePage /> </Private>}>
                        <Route path="/" element={<HomePageContent />} />
                        <Route path="/admin" element={<Admin> <AdminPage /> </Admin>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
