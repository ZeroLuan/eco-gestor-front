import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PontosColeta from './pages/PontosColeta';
import Licencas from './pages/Licencas';
import Cooperativas from './pages/Cooperativas';
import Residuos from './pages/Residuos';
import Relatorios from './pages/Relatorios';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="pontos-coleta" element={<PontosColeta />} />
                        <Route path="licencas" element={<Licencas />} />
                        <Route path="cooperativas" element={<Cooperativas />} />
                        <Route path="residuos" element={<Residuos />} />
                        <Route path="relatorios" element={<Relatorios />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
