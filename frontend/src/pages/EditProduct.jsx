
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the product using its ID from the URL.
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        setError(error.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleUpdate(event) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name").trim();
    const sku = formData.get("sku").trim();
    const price = Number(formData.get("price"));
    const reorderLevel = Number(formData.get("reorder_level"));
    const unit = formData.get("unit").trim();

    const categoryInput = formData.get("category_id");
    const categoryValue =
      categoryInput.trim() === "" ? null : Number(categoryInput);

    // Validate required fields.
    if (!name || !sku || !unit) {
      setFormError("Name, SKU, and Unit are required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a non-negative number.");
      return;
    }

    if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
      setFormError("Reorder level must be a non-negative integer.");
      return;
    }

    if (
      categoryValue !== null &&
      (!Number.isInteger(categoryValue) || categoryValue <= 0)
    ) {
      setFormError("Category ID must be a positive integer.");
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

      const updated = await api.patch(
        `/products/${id}`,
        productData
      );

      setProduct(updated ?? { ...product, ...productData });
      setSuccess("Product updated successfully.");
    } catch (error) {
      setFormError(error.message || "Unable to update product.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error || !product) {
    return (
      <section>
        <p className="error-message">
          {error || "Product not found."}
        </p>
        <Link to="/products">Back to Products</Link>
      </section>
    );
  }

  return (
    <section className="product-details">
      <div className="product-details-header">
        <div>
          <h1>Edit Product</h1>
          <p>Product ID: {product.id}</p>
        </div>

        <Link to={`/products/${product.id}`}>
          Back to Product Details
        </Link>
      </div>

      <form className="product-form" onSubmit={handleUpdate}>
        <h2>Product Information</h2>

        {success && (
          <p className="success-message">{success}</p>
        )}

        {formError && (
          <p className="error-message">{formError}</p>
        )}

        <label>
          Product Name
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
          />
        </label>

        <label>
          SKU
          <input
            type="text"
            name="sku"
            defaultValue={product.sku}
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
            defaultValue={(product.price_cents / 100).toFixed(2)}
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
            defaultValue={product.reorder_level}
            required
          />
        </label>

        <label>
          Unit
          <input
            type="text"
            name="unit"
            defaultValue={product.unit}
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
            defaultValue={product.category_id ?? ""}
          />
        </label>

        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Product"}
        </button>

        <Link to={`/products/${product.id}`}>
          Cancel
        </Link>
      </form>
    </section>
  );
}

export default EditProduct;
