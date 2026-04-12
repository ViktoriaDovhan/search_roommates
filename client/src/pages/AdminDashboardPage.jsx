import { useEffect, useState } from 'react';
import { getAdminStats } from '../services/listingsService';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalListings: 0,
        activeListings: 0,
        inactiveListings: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadStats() {
            try {
                setIsLoading(true);
                const data = await getAdminStats();
                setStats(data);
                setError('');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadStats();
    }, []);

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Dashboard адміністратора</h2>
                <p className="page-subtitle">
                    Тут показується реальна статистика по користувачах і оголошеннях.
                </p>
            </div>

            {isLoading && (
                <div className="card empty-state">
                    Завантаження статистики...
                </div>
            )}

            {!isLoading && error && (
                <div className="card empty-state">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Користувачі</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Усі оголошення</h3>
                        <p className="stat-value">{stats.totalListings}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Активні оголошення</h3>
                        <p className="stat-value">{stats.activeListings}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Неактивні оголошення</h3>
                        <p className="stat-value">{stats.inactiveListings}</p>
                    </div>
                </div>
            )}
        </div>
    );
}