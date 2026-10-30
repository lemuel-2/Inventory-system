function Categories() {
    const categories = [
    {
      id: 1,
      name: "Beverages",
      description: "Coffee, juice, and other drinks",
    },
    {
      id: 2,
      name: "Food",
      description: "Roasted chicken and other meals",
    },
    {
      id: 3,
      name: "Snacks",
      description: "Banana chips and other snacks",
    },
    {
      id: 4,
      name: "Seafood",
      description: "Fish, shrimp, and other seafood",
    },
  ];

  return (
    <div className="categories-page">
        <div className="page-header">
            <div>
                <h1>Categories</h1>
                <p>Organize and manage product categories.</p>
            </div>

            <button className="add-categories-btn">
                + Add Category
            </button>
        </div>

        <div className="categories-table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Categories;