import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        setError(error.message || "Unable to load product details");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [id]);

  if (loading) return <p>Loading products details</p>;

  if (error) {
    return (
      <section>
        <p>{error}</p>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <p>Product not found.</p>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  return (
    <section className="product-details">
      <div className="product-details-header">
        <div>
          <h1>{product.name}</h1>
          <p>Product ID: {product.id}</p>
        </div>

        <Link to="/products">Back to products</Link>
      </div>

      <div className="product-details-card">
        <h2>Product Information</h2>

        <p>
          <strong>SKU:</strong> {product.sku}
        </p>

        <p>
          <strong>Price:</strong> {(product.price_cents / 100).toFixed(2)}
        </p>

        <p>
          <strong>Unit:</strong> {product.unit}
        </p>

        <p>
          <strong>Reorder Level:</strong>
          {product.reorder_level}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {product.category_name || product.category_id || "N/A"}
        </p>

        <p>
          <strong>Status:</strong>
          {product.is_active ? "Active" : "Inactive"}
        </p>
      </div>
    </section>
  );
}

export default ProductDetails;
