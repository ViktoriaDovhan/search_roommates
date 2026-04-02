import { getCurrentUser } from '../services/authService';

export default function MyProfilePage() {
    const user = getCurrentUser();

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Мій профіль</h2>
                <p className="page-subtitle">
                    Тут показуються базові дані авторизованого користувача.
                </p>
            </div>

            <div className="card form-card">
                {user ? (
                    <>
                        <div className="meta-row">
                            <span className="badge badge-active">{user.role}</span>
                            <span className="badge badge-warning">{user.email}</span>
                        </div>

                        <p>
                            <strong>Ім’я:</strong> {user.firstName}
                        </p>
                        <p>
                            <strong>Прізвище:</strong> {user.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                    </>
                ) : (
                    <p className="muted">Користувач не авторизований.</p>
                )}
            </div>
        </div>
    );
}