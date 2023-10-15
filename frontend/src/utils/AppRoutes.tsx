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

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route element={<Private> <HomePage /> </Private>}>
                        <Route path="/" element={<HomePageContent/>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
