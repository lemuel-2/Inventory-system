import { useState, useEffect, useCallback } from "react";
import StatCard from "../components/StatCard";
import api from "../services/api.js";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // fetch all products
      const productData = await api.get("/products");
      setProducts(productData);

      // fetch movement history for each product
      const movementRequest = productData.map(async (product) => {
        const movements = await api.get(
          `/inventory/products/${product.id}/movements`,
        );

        return movements.map((movement) => ({
          ...movement,
          product_name: product.name,
        }));
      });

      const movementResults = await Promise.all(movementRequest);

      // Combine all products movement arrays into one array
      const allowMovements = movementResults.flat();

      // Sort movements from newest to oldest
      allowMovements.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      // keeps the five most recent movement
      setRecentMovements(allowMovements.slice(0, 5));
    } catch (error) {
      setError(error.message || "Failed to load the dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <p>loading Dashboard...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  // only count active products
  const activeProducts = products.filter(
    (product) => product.is_active === 1 || product.is_active === true,
  );

  // Products that needs restocking
  const lowStockProducts = activeProducts.filter((product) => {
    return product.stock_quantity <= product.reorder_level;
  });

  // total quantity of all active inventory
  const totalUnits = activeProducts.reduce((total, product) => {
    return (total + Number(product.stock_quantity ?? 0), 0);
  });

  // calculate inventory value using prices stored in cents
  const totalStockValue = activeProducts.reduce((total, product) => {
    const qty = Number(product.stock_quantity ?? 0);
    const price = Number(product.price_cents ?? 0);
    return total + qty * price;
  }, 0);

  const formattedStockValue = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(totalStockValue / 100);

  function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard heading and refresh button */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your inventory.</p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Dashboard statistics */}
      <div className="dashboard-cards">
        <StatCard title="Active Products" value={activeProducts.length} />
        <StatCard title="Low Stock Products" value={lowStockProducts.length} />
        <StatCard title="Total Units" value={totalUnits} />
        <StatCard title="Total Stock Value" value={formattedStockValue} />
      </div>

      {/* Low-stock products */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Low Stock Products</h2>
          <span>{lowStockProducts.length} products</span>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="empty-message">All products have sufficient stock.</p>
        ) : (
          <div className="dashboard-table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent stock movements */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Stock Movements</h2>
          <span>Latest 5 movements</span>
        </div>

        {recentMovements.length === 0 ? (
          <p className="empty-message">No stock movements found.</p>
        ) : (
          <div className="dashboard-table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Movement Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDate(movement.created_at)}</td>
                    <td>{movement.product_name}</td>
                    <td>{movement.movement_type}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
