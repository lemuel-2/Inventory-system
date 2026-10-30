import StatCard from "../components/StatCard";

function Dashboard() {
    return (
        <div className="dashboard">
            <h1>DashBoard</h1>
            <p>Welcome to inventory management system</p>

            <div className="stats-container">
                <StatCard
                    title="Total Products"
                    value="120"
                    description="Products Registered"
                />

                <StatCard
                    title="Total Categories"
                    value="8"
                    description="Categories Registered"
                />

                <StatCard
                    title="Low Stock"
                    value="5"
                    description="Products need restocking"
                />

                <StatCard
                    title="Inventory Value"
                    value="45,000"
                    description="Estimated inventory value"
                />
            </div>

        </div>
    )
}

export default Dashboard;