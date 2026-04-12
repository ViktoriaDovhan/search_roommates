import { useEffect, useState } from 'react';
import { getAdminUsers } from '../services/listingsService';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                const data = await getAdminUsers();
                setUsers(data);
                setError('');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, []);

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Користувачі</h2>
                <p className="page-subtitle">
                    Список зареєстрованих користувачів і їхніх ролей.
                </p>
            </div>

            {isLoading && (
                <div className="card section-space empty-state">
                    Завантаження користувачів...
                </div>
            )}

            {!isLoading && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="card table-card">
                    <div className="table-wrap">
                        <table className="data-table table table-hover align-middle mb-0">
                            <thead>
                            <tr>
                                <th>Ім’я</th>
                                <th>Email</th>
                                <th>Роль</th>
                                <th>Активний</th>
                                <th>Підтверджений</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    user.role === 'admin'
                                                        ? 'badge-warning'
                                                        : 'badge-active'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                    </td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    user.isActive
                                                        ? 'badge-active'
                                                        : 'badge-inactive'
                                                }`}
                                            >
                                                {user.isActive ? 'Так' : 'Ні'}
                                            </span>
                                    </td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    user.isVerified
                                                        ? 'badge-active'
                                                        : 'badge-inactive'
                                                }`}
                                            >
                                                {user.isVerified ? 'Так' : 'Ні'}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="section-space empty-state">
                            У базі ще немає користувачів.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}