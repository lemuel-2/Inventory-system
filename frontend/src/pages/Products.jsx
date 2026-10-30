function Products() {
    const products = [
    {
      id: 1,
      name: "Creamy White Coffee",
      sku: "COF-001",
      category: "Beverages",
      price: 150,
      stock: 25,
      status: "Active",
    },
    {
      id: 2,
      name: "Roasted Chicken",
      sku: "FOO-001",
      category: "Food",
      price: 250,
      stock: 5,
      status: "Active",
    },
    {
      id: 3,
      name: "Banana Chips",
      sku: "SNK-001",
      category: "Snacks",
      price: 80,
      stock: 0,
      status: "Inactive",
    },
  ];

  return (
    <div className="products-page">
        <div className="page-header">
            <div>
                <h1>Products</h1>
                <p>Manage inventory products</p>
            </div>

            <button className="add-products-btn">
                + Add Product
            </button>

            <div className="products-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <th>{product.name}</th>
                                <th>{product.sku}</th>
                                <th>{product.category}</th>
                                <th>{product.price.toFixed(2)}</th>
                                <th>{product.stock}</th>
                                <th>{product.status}</th>
                                <th>
                                    <button>Edit</button>
                                    <button>Deactivate</button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Products;