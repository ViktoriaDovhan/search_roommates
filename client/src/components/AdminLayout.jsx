import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import ApiModeSwitch from './ApiModeSwitch';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getNavClass = ({ isActive }) =>
        `nav-link px-3 py-2 ${
            isActive
                ? 'fw-semibold text-dark bg-white rounded-pill'
                : 'text-light bg-transparent'
        }`;

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <NavLink to="/admin" className="navbar-brand fw-bold">
                        Search Roommates — Адмінпанель
                    </NavLink>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adminNavbar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="adminNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                            <li className="nav-item">
                                <NavLink to="/admin" end className={getNavClass}>
                                    Dashboard
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/admin/listings" className={getNavClass}>
                                    Оголошення
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/admin/users" className={getNavClass}>
                                    Користувачі
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/" className={getNavClass}>
                                    На сайт
                                </NavLink>
                            </li>
                        </ul>

                        <div className="d-flex align-items-center gap-3">
                            <ApiModeSwitch />

                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Вийти
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container py-4">
                <h1 className="h3 mb-4">Керування користувачами та оголошеннями</h1>
                <Outlet />
            </main>
        </>
    );
}