import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.get("/products");
        setError("");
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name").trim();
    const sku = formData.get("sku").trim();
    const price = Number(formData.get("price"));
    const reorderLevel = Number(formData.get("reorder_level"));
    const unit = formData.get("unit").trim();
    const categoryValue = formData.get("category_id");

    if (!name || !sku || !unit) {
      setFormError("Name, SKU, and Unit are required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
      setFormError("Reorder level must be a non-negative integer.");
      return;
    }

    const productData = {
      name,
      sku,
      price_cents: Math.round(price * 100),
      reorder_level: reorderLevel,
      unit,
    };

    if (categoryValue) productData.category_id = Number(categoryValue);

    try {
      setSaving(true);

      const created = await api.post("/products", productData);

      form.reset();
      setSuccess("Product created successfully");
      setProducts((prev) => [...prev, created]);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name").trim();
    const sku = formData.get("sku").trim();
    const price = Number(formData.get("price"));
    const reorderLevel = Number(formData.get("reorder_level"));
    const unit = formData.get("unit").trim();
    const categoryInput = formData.get("category_id");
    const categoryValue =
      categoryInput === null || categoryInput.trim() === ""
        ? null
        : Number(categoryInput);

    if (!name || !sku || !unit) {
      setFormError("Name, sku, unit are required");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a non-negative number");
      return;
    }

    if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
      setFormError("Reorder Level must be a non-negative integer");
      return;
    }

    if (
      categoryValue !== null &&
      (!Number.isInteger(categoryValue) || categoryValue <= 0)
    ) {
      setFormError("Category ID must be a positive integer");
      return;
    }

    const productData = {
      name,
      sku,
      price_cents: Math.round(price * 100),
      reorder_level: reorderLevel,
      unit,
      category_id: categoryValue,
    };

    try {
      setUpdating(true);

      const updated = await api.patch(`/products/${editingProduct.id}`, productData);

      setEditingProduct(null);
      setSuccess("Product updated successfully");
      setProducts((prev) =>
        prev.map((product) => (product.id === updated.id ? updated : product)),
      );
    } catch (error) {
      setFormError(error.message);
    } finally {
      setUpdating(false);
    }
  }

  // search products by name and sku
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const productName = product.name?.toLowerCase() || "";
    const productSku = product.sku?.toLowerCase() || "";

    return productName.includes(search) || productSku.includes(search);
  });

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage inventory products</p>
        </div>

        <button
          className="add-products-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setFormError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {success && <p className="success-message">{success}</p>}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Add new Product</h2>

          {formError && <p className="error-message">{formError}</p>}

          <label>
            Product Name
            <input
              type="text"
              name="name"
              placeholder="Creamy white coffee"
              required
            />
          </label>

          <label>
            SKU
            <input type="text" name="sku" placeholder="COF-001" required />
          </label>

          <label>
            Price
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              placeholder="150.00"
              required
            />
          </label>

          <label>
            Reorder Level
            <input
              type="number"
              name="reorder_level"
              min="0"
              step="1"
              defaultValue="0"
              required
            />
          </label>

          <label>
            Unit
            <input
              type="text"
              name="unit"
              placeholder="piece, pack, bottle"
              required
            />
          </label>

          <label>
            Category ID
            <input
              type="number"
              name="category_id"
              min="1"
              step="1"
              placeholder="Enter existing Category ID"
            />
          </label>

          <button className="add-product-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      )}

      {editingProduct && (
        <form className="product-form" onSubmit={handleUpdate}>
          <h2>Edit Product</h2>

          {formError && <p className="error-message">{formError}</p>}

          <label>
            Product Name
            <input
              type="text"
              name="name"
              defaultValue={editingProduct.name}
              required
            />
          </label>

          <label>
            SKU
            <input
              type="text"
              name="sku"
              defaultValue={editingProduct.sku}
              required
            />
          </label>

          <label>
            Price
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              defaultValue={(editingProduct.price_cents / 100).toFixed(2)}
              required
            />
          </label>

          <label>
            Reorder Level
            <input
              type="number"
              name="reorder_level"
              min="0"
              step="1"
              defaultValue={editingProduct.reorder_level}
              required
            />
          </label>

          <label>
            Unit
            <input
              type="text"
              name="unit"
              defaultValue={editingProduct.unit}
              required
            />
          </label>

          <label>
            Category
            <input
              type="number"
              name="category_id"
              min="1"
              step="1"
              defaultValue={editingProduct.category_id ?? ""}
            />
          </label>

          <button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Updated Product"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormError("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="product-search">
        <input
          type="search"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm("")}>
            Clear
          </button>
        )}
      </div>

      <p className="product-count">
        Showing {filteredProducts.length} of {products.length} products
      </p>

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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8">
                  {searchTerm
                    ? "No products match your term."
                    : "No products found."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td><Link to={`/products/${product.id}`}>{product.name}</Link></td>
                  <td>{product.sku}</td>
                  <td>{product.category_name || "Uncategorized"}</td>
                  <td>{(product.price_cents / 100).toFixed(2)}</td>
                  <td>{product.stock_quantity}</td>
                  <td>{product.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(false);
                        setFormError("");
                        setSuccess("");
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
