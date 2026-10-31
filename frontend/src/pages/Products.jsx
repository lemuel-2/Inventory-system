import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await api.get("/products");
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) return <p>Loading products...</p>
    if (error) return <p className="error-message">Error: {error}</p>

  return (
    <div className="products-page">
        <div className="page-header">
            <div>
                <h1>Products</h1>
                <p>Manage inventory products</p>
            </div>

            <button className="add-products-btn">
                + Add Product
            </button>

            <div className="products-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7">No products found.</td>
                            </tr>
                        ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <th>{product.id}</th>
                                <th>{product.name}</th>
                                <th>{product.sku}</th>
                                <th>{product.category_name || "Uncategorized"}</th>
                                <th>{(product.price_cents / 100).toFixed(2)}</th>
                                <th>{product.stock_quantity}</th>
                                <th>{product.is_active? "Active" : "Inactive"}</th>
                            </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Products;