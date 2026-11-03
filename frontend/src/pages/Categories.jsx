import { useState, useEffect } from "react";
import api from "../services/api.js";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    try {
      setError("");
      const data = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name").trim();
    const description = formData.get("description").trim();

    if (!name) {
      setFormError("Category name is required");
      return;
    }

    try {
      setSaving(true);
      await api.post("/categories", { name, description });
      form.reset();
      setShowForm(false);
      setSuccess("Category created successfully.");
      await loadCategories();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize and manage product categories.</p>
        </div>

        <button
          className="add-categories-btn"
          onClick={() => {
            setShowForm(!showForm);
            setFormError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "Add category"}
        </button>
      </div>

      {success && <p className="success-message">{success}</p>}

      {showForm && (
        <form className="category-form" onSubmit={handleSubmit}>
          <h2>Add New Category</h2>

          {formError && <p className="error-message">{formError}</p>}

          <label>
            Category Name
            <input type="text" name="name" placeholder="Beverages" required />
          </label>

          <label>
            Description
            <input
              type="text"
              name="description"
              placeholder="Coffee, juice, and other drinks"
              rows="3"
            />
          </label>

          <button className="add-category-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Category"}
          </button>
        </form>
      )}

      <div className="categories-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3">No categories found</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description || "No description"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
