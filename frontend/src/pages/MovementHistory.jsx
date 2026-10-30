function MovementHistory() {
    const movements = [
    {
      id: 1,
      product: "Creamy White Coffee",
      type: "STOCK_IN",
      quantity: 20,
      reason: "New stock delivery",
      date: "2026-10-29 09:30",
    },
    {
      id: 2,
      product: "Roasted Chicken",
      type: "STOCK_OUT",
      quantity: 5,
      reason: "Customer purchase",
      date: "2026-10-29 10:15",
    },
    {
      id: 3,
      product: "Banana Chips",
      type: "ADJUSTMENT",
      quantity: -2,
      reason: "Damaged products",
      date: "2026-10-29 11:00",
    },
  ];

  return (
    <div className="movements-page">
        <div className="page-header">
            <div>
                <h1>Movement History</h1>
                <p>Track all inventory stock transactions.</p>
            </div>

            <div className="movement-table-container">

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Movement Type</th>
                            <th>Quantity</th>
                            <th>Reason</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movements.map((movement) => (
                            <tr key={movement.id}>
                                <td>{movement.id}</td>
                                <td>{movement.product}</td>
                                <td>{movement.type}</td>
                                <td>
                                    {movement.quantity > 0 ? "+" : ""}
                                    {movement.quantity}
                                </td>
                                <td>{movement.reason}</td>
                                <td>{movement.date}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  )
}

export default MovementHistory;