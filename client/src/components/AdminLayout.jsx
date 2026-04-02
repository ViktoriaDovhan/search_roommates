import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getNavClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

    return (
        <div className="app-shell">
            <header className="site-header admin-header">
                <div className="container">
                    <div className="topbar">
                        <div>
                            <h1 className="brand-title">Search Roommates — Адмінпанель</h1>
                            <p className="brand-subtitle">
                                Керування користувачами та оголошеннями
                            </p>
                        </div>

                        <nav className="nav-row">
                            <NavLink to="/admin" end className={getNavClass}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/admin/listings" className={getNavClass}>
                                Оголошення
                            </NavLink>
                            <NavLink to="/admin/users" className={getNavClass}>
                                Користувачі
                            </NavLink>
                            <NavLink to="/" className={getNavClass}>
                                На сайт
                            </NavLink>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Вийти
                            </button>
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