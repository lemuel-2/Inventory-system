import { NavLink } from "react-router-dom";

function SideBar({ isOpen, onClose }) {
    const links = [
        { name: "Dashboard", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Categories", path: "/categories" },
        { name: "Inventory", path: "/inventory" },
        { name: "Movement History", path: "/movements" },
    ];

    return (
        <>
        {isOpen && (
            <button
            className="Sidebar-overlay"
            onClick={onclose}
            aria-label="Close navigation menu"
            />
        )};

        <aside className={`sidebar ${isOpen} ? "sidebar-open" : ""`}>
            <div className="sidebar-heading">
                <h2 className="sidebar-title">Inventory System</h2>

                <button 
                    className="sidebar-close"
                    onClick={onclose}
                    aria-label="Close navigation menu"
                    >
                        x
                </button>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === "/"}
                        className={({ isActive }) => 
                            isActive ? "nav-link active" : "nav-link"
                        }

                        onClick={onClose}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    </>
    )
}

export default SideBar;