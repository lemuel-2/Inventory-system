import { useState, useEffect } from "react";
import api from "../services/api.js";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAction, setStockAction] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  async function LoadInventory() {
    try {
      const products = await api.get("/products");
      const stockRecord = await Promise.all(
        products.map(async (product) => {
          const stock = await api.get(
            `/inventory/products/${product.id}/stock`,
          );

          return { ...product, ...stock };
        }),
      );
      setInventory(stockRecord);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    LoadInventory();
  }, []);

  function openStockForm(product, action) {
    setSelectedProduct(product);
    setStockAction(action);
    setQuantity("");
    setReason("");
    setFormError("");
    setSuccess("");
  }

  function closeStockForm() {
    setSelectedProduct(null);
    setStockAction("");
    setQuantity("");
    setReason("");
    setFormError("");
  }

  async function handleStockSubmit(event) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const parseQuantity = Number(quantity);

    if (!Number.isInteger(parseQuantity) || parseQuantity <= 0) {
      const message = "Quantity must be a positive whole number.";
      return setFormError(message);
    }

    try {
      setSaving(true);

      const stockIn = `/inventory/products/${selectedProduct.id}/stock-in`;
      const stockOut = `/inventory/products/${selectedProduct.id}/stock-out`;
      const endpoint = stockAction === "stock-in" ? stockIn : stockOut;

      await api.post(endpoint, {
        quantity: parseQuantity,
        reason: reason.trim() || null,
      });

      const actionLabel = stockAction === "stock-in" ? "stock In" : "stock Out";
      setSuccess(`${actionLabel} completed for ${selectedProduct.name}.`);
      closeStockForm();
      await LoadInventory();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading inventory</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor and manage product stock</p>
        </div>
      </div>

      {success && <p className="success-message">{success}</p>}

      {selectedProduct && (
        <div className="stock-form-container">
          <h2>
            {stockAction === "stock-in" ? "stock In" : "stock Out"} -{" "}
            {selectedProduct.name}
          </h2>

          {formError && <p className="error-message">{formError}</p>}

          <form onSubmit={handleStockSubmit}>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                }}
                required
              />
            </label>

            <label>
              Reason
              <input
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={
                  stockAction === "stock-in"
                    ? "e.g. New delivery"
                    : "e.g. Sold to customer"
                }
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Submit"}
            </button>

            <button type="button" onClick={closeStockForm} disabled={saving}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="inventory-table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="6">No inventory record found.</td>
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
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          openStockForm(item, "stock-in");
                        }}
                      >
                        Stock In
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          openStockForm(item, "stock-out");
                        }}
                      >
                        Stock Out
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
