import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import SideBar from "../components/Sidebar";

function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function openSidebar() {
        setIsSidebarOpen(true);
    }

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

    return(
        <div className="main-layout">
            <SideBar 
                isOpen={isSidebarOpen}
                isClose={closeSidebar}
            />

            <div className="main-content">
                <Header onMenuClick={openSidebar} />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout;