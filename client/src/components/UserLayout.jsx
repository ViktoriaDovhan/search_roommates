import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

export default function UserLayout() {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getNavClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

    return (
        <div className="app-shell">
            <header className="site-header">
                <div className="container">
                    <div className="topbar">
                        <div>
                            <h1 className="brand-title">Search Roommates</h1>
                            <p className="brand-subtitle">
                                Пошук сусідів і створення власних оголошень
                            </p>
                        </div>

                        <nav className="nav-row">
                            <NavLink to="/" className={getNavClass}>
                                Головна
                            </NavLink>
                            <NavLink to="/listings" className={getNavClass}>
                                Оголошення
                            </NavLink>
                            <NavLink to="/add-listing" className={getNavClass}>
                                Додати оголошення
                            </NavLink>

                            {user ? (
                                <>
                                    <NavLink to="/my-profile" className={getNavClass}>
                                        Мій профіль
                                    </NavLink>

                                    {user.role === 'admin' && (
                                        <NavLink to="/admin" className={getNavClass}>
                                            Адмінка
                                        </NavLink>
                                    )}

                                    <button className="btn btn-danger" onClick={handleLogout}>
                                        Вийти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className={getNavClass}>
                                        Вхід
                                    </NavLink>
                                    <NavLink to="/register" className={getNavClass}>
                                        Реєстрація
                                    </NavLink>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}