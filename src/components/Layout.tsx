import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="main-wrapper">
                <Header onToggleSidebar={toggleSidebar} />

                <main className="main-content" id="app-content">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Layout;
