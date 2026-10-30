function StatCard({ title, value, description }) {
    return (
        <div className="stat-card">
            <h1>{title}</h1>
            <h2>{value}</h2>
            <p>{description}</p>
        </div>
    );
}

export default StatCard;