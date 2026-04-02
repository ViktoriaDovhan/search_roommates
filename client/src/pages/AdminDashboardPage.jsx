export default function AdminDashboardPage() {
    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Dashboard адміністратора</h2>
                <p className="page-subtitle">
                    Тут буде коротка статистика по користувачах, анкетах і предметах.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Користувачі</h3>
                    <p className="stat-value">12</p>
                </div>

                <div className="stat-card">
                    <h3>Анкети</h3>
                    <p className="stat-value">8</p>
                </div>

                <div className="stat-card">
                    <h3>Активні предмети</h3>
                    <p className="stat-value">5</p>
                </div>

                <div className="stat-card">
                    <h3>Неактивні предмети</h3>
                    <p className="stat-value">1</p>
                </div>
            </div>
        </div>
    );
}