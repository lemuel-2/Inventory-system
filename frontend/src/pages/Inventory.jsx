import { useState, useEffect } from "react";
import api from "../services/api.js";

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function LoadInventory() {
            try {
                const products = await api.get("/products")
                const stockRecord = await Promise.all(
                    products.map(async (product) => {
                        const stock = await api.get(
                            `/inventory/products/${product.id}/stock`
                        );

                        return {
                            ...product,
                            ...stock
                        }
                    })
                )
            setInventory(stockRecord)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        LoadInventory();
    }, []);

    if (loading) return <p>Loading inventory</p>
    if (error) return <p className="error-message">Error: {error}</p>

  return (
    <div className="inventory-page">
        <div className="page-header">
            <div>
                <h1>Inventory</h1>
                <p>Monitor and manage product stock</p>
            </div>
        </div>

        <div className="inventory-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Current Stock</th>
                        <th>Reorder Level</th>
                        <th>Stock Status</th>
                    </tr>
                </thead>

                <tbody>
                    {inventory.length === 0 ? (
                        <tr>
                            <td colSpan="5">No inventory record found.</td>
                        </tr>
                    ) : (
                    inventory.map((item) => {
                        const stock = item.stock_quantity ?? 0;
                        const reorderLevel = item.reorder_level ?? 0;

                        let status = "In stock";

                        if (stock === 0) {
                            status = "Out of stock";
                        } else if (stock <= reorderLevel) {
                            status = "Low stock";
                        }

                        return (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.sku}</td>
                            <td>{stock}</td>
                            <td>{reorderLevel}</td>
                            <td>{status}</td>
                        </tr>
                    )}))}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Inventory;