import { useLocation } from "react-router-dom";

function Header({ onMenuClick }) {
    const location = useLocation();

    const pageTitles = {
        "/": "Dashboard",
        "/products": "Products",
        "/categories": "Categories",
        "/inventory": "Inventory",
        "/movements": "Movement History",
    };

    const currentPage = pageTitles[location.pathname] || "Inventory System";

    return (
        <header className="header">
            <div>
                <button 
                    className="menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                >
                    ☰
                </button>
            </div>

            <h2>{currentPage}</h2>
            <p>Inventory Management System</p>
        </header>
    )
}

export default Header;