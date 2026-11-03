import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import api from "../services/api.js";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        // load all products
        const productList = await api.get("/products");
        setProducts(productList);

        // load movement history for each product
        const movementRecords = await Promise.all(
          productList.map(async (product) => {
            const movements = await api.get(
              `/inventory/products/${product.id}/movements`,
            );

            return movements.map((movement) => ({
              ...movement,
              product_name: product.name,
            }));
          }),
        );

        // combine movement array into one array
        const allMovements = movementRecords.flat();

        // sort new movement array
        allMovements.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        // keep the latest 5 movements
        setRecentMovements(allMovements.slice(0, 5));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <p>loading Dashboard...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  // only count active products
  const activeProducts = products.filter((product) => product.is_active);

  // Products that needs restocking
  const lowStockProduct = products.filter(
    (product) =>
      Number(product.stock_quantity ?? 0) <= Number(product.reorder_level ?? 0),
  );

  // total quantity of all active inventory
  const totalStockUnits = activeProducts.reduce(
    (total, product) => total + Number(product.stock_quantity ?? 0),
    0,
  );

  // calculate inventory value using prices stored in cents
  const inventoryValue = activeProducts.reduce(
    (total, product) =>
      total +
      Number(product.stock_quantity ?? 0) * Number(product.price_cents ?? 0),
    0,
  );

  const formatTedInventoryValue = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(inventoryValue / 100);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>DashBoard</h1>
          <p>Overview of your inventory and stock level.</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">📦</div>

          <div>
            <p>Total products</p>
            <h2>{activeProducts.length}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">⚠️</div>

          <div>
            <p>Low Stock Items</p>
            <h2>{lowStockProduct.length}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">📊</div>

          <div>
            <p>Total Stock Units</p>
            <h2>{totalStockUnits}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">💰</div>

          <div>
            <p>Inventory Value</p>
            <h2>{formatTedInventoryValue}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Low Stock Products</h2>
        {lowStockProduct.length === 0 ? (
          <p>All Products have sufficient stock</p>
        ) : (
          <div className="dashboard-table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>

              <tbody>
                {lowStockProduct.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.stock_quantity ?? 0}</td>
                    <td>{product.reorder_level ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="dashboard-section">
          <h2>Recent Stock movements</h2>
          {recentMovements.length === 0 ? (
            <p>No stock movement found.</p>
          ) : (
            <div className="dashboard-container-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Movement Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.map((movement) => (
                    <tr key={movement.id}>
                      <td>{movement.product_name}</td>
                      <td>{movement.movement_type}</td>
                      <td>{movement.quantity}</td>
                      <td>{movement.reason || "-"}</td>
                      <td>{new Date(movement.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
