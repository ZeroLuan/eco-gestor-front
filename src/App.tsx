import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

import PontosColeta from './pages/PontosColeta';
import Licencas from './pages/Licencas';
import Cooperativas from './pages/Cooperativas';
import Residuos from './pages/Residuos';
import Relatorios from './pages/Relatorios';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="pontos-coleta" element={<PontosColeta />} />
                    <Route path="licencas" element={<Licencas />} />
                    <Route path="cooperativas" element={<Cooperativas />} />
                    <Route path="residuos" element={<Residuos />} />
                    <Route path="relatorios" element={<Relatorios />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
