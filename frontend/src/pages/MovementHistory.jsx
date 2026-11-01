import { useState, useEffect } from "react";
import api from "../services/api.js";
function MovementHistory() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMovements() {
            try {
                const products = await api.get("/products");

                const movementsRecords = await Promise.all(
                    products.map(async (product) => {
                        const productMovement = await api.get(
                            `/inventory/products/${product.id}/movements`
                        );

                        return productMovement.map((movement) => ({
                            ...movement,
                            product_name: product.name
                        }))
                    })
                );

                const allMovements = movementsRecords.flat()

                allMovements.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                setMovements(allMovements);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadMovements();
    }, []);

    if (loading) return <p>Loading movement history</p>
    if (error) return <p className="error-message">Error: {error}</p>

  return (
    <div className="movements-page">
        <div className="page-header">
            <div>
                <h1>Movement History</h1>
                <p>Track all inventory stock transactions.</p>
            </div>

            <div className="movement-table-container">

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Movement Type</th>
                            <th>Quantity</th>
                            <th>Reason</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movements.length === 0 ? (
                            <tr>
                                <td colSpan="6">No movements found.</td>
                            </tr>                           
                        ) : (
                            movements.map((movement) =>{
                                const quantity = movement.quantity_change ?? 
                                                 movement.quantity ?? 0;

                                return (
                                    <tr key={movement.id}>
                                        <td>{movement.id}</td>
                                        <td>{movement.product_name}</td>
                                        <td>{movement.movement_type}</td>
                                        <td>
                                            {quantity > 0 ? "+" : ""}
                                            {quantity}
                                        </td>
                                        <td>{movement.reason || "-"}</td>
                                        <td>
                                            {
                                            movement.created_at 
                                            ? new Date(movement.created_at).toLocaleDateString() 
                                            : "-"
                                            }
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default MovementHistory;