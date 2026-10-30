function Inventory() {
    const inventory = [
    {
      id: 1,
      name: "Creamy White Coffee",
      sku: "COF-001",
      stock: 25,
      reorderLevel: 10,
      unit: "piece",
    },
    {
      id: 2,
      name: "Roasted Chicken",
      sku: "FOO-001",
      stock: 5,
      reorderLevel: 10,
      unit: "piece",
    },
    {
      id: 3,
      name: "Banana Chips",
      sku: "SNK-001",
      stock: 0,
      reorderLevel: 5,
      unit: "pack",
    },
  ];

  return (
    <div className="inventory-page">
        <div className="page-header">
            <div>
                <h1>Inventory</h1>
                <p>Monitor and manage product stock</p>
            </div>
        </div>

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
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.sku}</td>
                            <td>
                                {item.stock} {item.unit}
                            </td>
                            <td>{item.reorderLevel}</td>
                            <td>
                                {item.stock === 0 
                                ? "Out of stock" 
                                : item.stock <= item.reorderLevel
                                ? "Low Stock"
                                : "In Stock"
                                }
                            </td>
                            <td>
                                <button>Stock In</button>
                                <button>Stock Out</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Inventory;