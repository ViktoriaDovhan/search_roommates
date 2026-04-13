import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import ApiModeSwitch from './ApiModeSwitch';

export default function UserLayout() {
    const user = getCurrentUser();
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <NavLink to="/" className="navbar-brand fw-bold">
                        Search Roommates
                    </NavLink>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
                            <li className="nav-item">
                                <NavLink to="/" end className={getNavClass}>
                                    Головна
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/listings" className={getNavClass}>
                                    Оголошення
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/add-listing" className={getNavClass}>
                                    Додати оголошення
                                </NavLink>
                            </li>

                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/my-profile" className={getNavClass}>
                                            Мій профіль
                                        </NavLink>
                                    </li>

                                    {user.role === 'admin' && (
                                        <li className="nav-item">
                                            <NavLink to="/admin" className={getNavClass}>
                                                Адмінка
                                            </NavLink>
                                        </li>
                                    )}
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/login" className={getNavClass}>
                                            Вхід
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/register" className={getNavClass}>
                                            Реєстрація
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-3">
                            <ApiModeSwitch />

                            {user && (
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    Вийти
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container py-4">
                <h1 className="h3 mb-4">Пошук сусідів і створення власних оголошень</h1>
                <Outlet />
            </main>
        </>
    );
}