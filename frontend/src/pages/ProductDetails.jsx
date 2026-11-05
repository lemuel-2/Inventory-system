import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Products from "./Products";

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

        const response = await api.get(`/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError(
          error.response?.date?.message || "Unable to load product details",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <p>Loading products details</p>;
  if (error) {
    <section>
      <p>{error}</p>
      <link to="/products">Back to products</link>
    </section>;
  }

  if (!product) {
    return;
    <section>
      <p>Product not found.</p>
      <link to="/products">Back to products</link>
    </section>;
  }

  return (
    <section className="product-details">
      <div className="product-details-header">
        <div>
          <h1>{product.name}</h1>
          <p>Product ID: {product.id}</p>
        </div>

        <link to="/products">Back to products</link>
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
          {product.is_active ? "Active" : "false"}
        </p>
      </div>
    </section>
  );
}

export default ProductDetails;