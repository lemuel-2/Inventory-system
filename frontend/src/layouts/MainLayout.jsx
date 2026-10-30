import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";

function MainLayout() {
    return(
        <div className="main-layout">
            <SideBar />

            <div className="main-content">
                <Header />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout;