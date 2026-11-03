import { useState, useEffect } from "react";
import api from "../services/api.js";

function MovementHistory() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("all");
  const [selectedMovementType, setSelectedMovementType] = useState("all");
  const [searchReason, setSearchReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovements() {
      try {
        const products = await api.get("/products");
        setProducts(products);
        setCurrentPage(1);

        const movementRecords = await Promise.all(
          products.map(async (product) => {
            const productMovementURL = `/inventory/products/${product.id}/movements`;
            const productMovement = await api.get(productMovementURL);

            return productMovement.map((movement) => ({
              ...movement,
              product_id: product.id,
              product_name: product.name,
            }));
          }),
        );

        const allMovements = movementRecords.flat();

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

  const filteredMovements = movements.filter((movement) => {
    const matchesId = String(movement.product_id) === selectedProductId;
    const matchesType = movement.movement_type === selectedMovementType;
    const matchesProduct = selectedProductId === "all" || matchesId;
    const matchesMovementType = selectedMovementType === "all" || matchesType;
    const matchesReason = String(movement.reason ?? "")
      .toLowerCase()
      .includes(searchReason.toLowerCase().trim());
    return matchesProduct && matchesMovementType && matchesReason;
  });

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredMovements.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  if (loading) return <p>Loading movement history</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="movements-page">
      <div className="page-header">
        <div>
          <h1>Movement History</h1>
          <p>Track all inventory stock transactions.</p>
        </div>

        <div className="movement-filter">
          <label htmlFor="product-filter">Filter by Product</label>

          <select
            id="product-filter"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="all">All Products</option>
            {products.map((product) => (
              <option key={product.id} value={String(product.id)}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="movement-filter">
          <label htmlFor="movement-type-filter">Filter by Movement Type</label>

          <select
            id="movement-type-filter"
            value={selectedMovementType}
            onChange={(event) => {
              setSelectedMovementType(event.target.value);
            }}
          >
            <option value="all">All Movements</option>
            <option value="stock_in">Stock In</option>
            <option value="stock_out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>

        <div className="movement-filter">
          <label htmlFor="reason-search">Search by Reason</label>
          <input
            id="reason-search"
            type="text"
            placeholder="Search reason..."
            value={searchReason}
            onChange={(event) => {
              setSearchReason(event.target.value);
            }}
          />
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
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan="6">No movements found.</td>
                </tr>
              ) : (
                paginatedMovements.map((movement) => {
                  const quantity =
                    movement.quantity_change ?? movement.quantity ?? 0;

                  const movementType = String(movement.movement_type ?? "")
                    .toLowerCase()
                    .replace(/[_\s]+/g, "-");

                  return (
                    <tr key={movement.id}>
                      <td>{movement.id}</td>
                      <td>{movement.product_name}</td>
                      <td>
                        <span className={`movement-type ${movementType}`}>
                          {movement.movement_type}
                        </span>
                      </td>
                      <td
                        className={
                          quantity > 0
                            ? "quantity-in"
                            : quantity < 0
                              ? "quantity-out"
                              : ""
                        }
                      >
                        {quantity > 0 ? "+" : ""}
                        {quantity}
                      </td>
                      <td>{movement.reason || "-"}</td>
                      <td>
                        {movement.created_at
                          ? new Date(movement.created_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovementHistory;
