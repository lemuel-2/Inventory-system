import { useState, useEffect } from "react";
import api from "../services/api.js"

function Categories() {    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await api.get("/categories");
                setCategories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, [])

    if (loading) return <p>Loading categories...</p>
    if (error) return <p className="error-message">Error: {error}</p>

  return (

    <div className="categories-page">
        <div className="page-header">
            <div>
                <h1>Categories</h1>
                <p>Organize and manage product categories.</p>
            </div>

            <button className="add-categories-btn">
                Add Category
            </button>
        </div>

        <div className="categories-table-container">
            <table>
                
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Description</th>
                    </tr>
                </thead>
                
                <tbody>
                    { categories.length === 0 ? (
                        <tr>
                            <td colSpan="3">No categories found</td>
                        </tr>
                    ) : (
                    categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description || "No description"}</td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Categories;