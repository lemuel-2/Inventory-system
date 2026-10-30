import { NavLink } from "react-router-dom";

function SideBar() {
    const links = [
        { name: "Dashboard", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Categories", path: "/categories" },
        { name: "Inventory", path: "/inventory" },
        { name: "Movement History", path: "/movements" },
    ];

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Inventory System</h2>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => 
                            isActive ? "nav-link active" : "nav-link"
                        }
                        end={link.path === "/"}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default SideBar;