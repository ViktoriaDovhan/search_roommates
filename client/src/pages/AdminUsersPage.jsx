const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user' },
];

export default function AdminUsersPage() {
    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Користувачі</h2>
                <p className="page-subtitle">
                    Список зареєстрованих користувачів і їхніх ролей.
                </p>
            </div>

            <div className="card table-card">
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Ім’я</th>
                            <th>Email</th>
                            <th>Роль</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-active'}`}>
                      {user.role}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}