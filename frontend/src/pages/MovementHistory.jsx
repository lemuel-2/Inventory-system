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

                const movementRecords = await Promise.all(
                    products.map(async (product) => {
                        const productMovementURL = `/inventory/products/${product.id}/movements`;
                        const productMovement = await api.get(productMovementURL);

                        return productMovement.map((movement) => ({
                            ...movement,
                            product_name: product.name
                        }))
                    })
                );

                const allMovements = movementRecords.flat()

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
                                        <td>
                                            <span className={`movement-type ${String(movement.movement_type)}
                                                .toLowerCase().replace(/\s+/&, "-")`}>
                                            {movement.movement_type}
                                            </span>
                                        </td>
                                        <td className={quantity > 0 ? "quantity-in" 
                                                     : quantity < 0 ? "quantity-out" : ""}>
                                            {quantity > 0 ? "+" : ""}
                                            {quantity}
                                        </td>
                                        <td>{movement.reason || "-"}</td>
                                        <td>
                                            {
                                            movement.created_at 
                                            ? new Date(movement.created_at).toLocaleString() 
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