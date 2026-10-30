import { useLocation } from "react-router-dom";

function Header() {
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
            <h2>{currentPage}</h2>
            <p>Inventory Management System</p>
        </header>
    )
}

export default Header;