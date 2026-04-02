import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

export default function HomePage() {
    const user = getCurrentUser();

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Знайди потрібний ресурс або створи власну анкету</h2>
            </div>

            <div className="hero-grid">
                <section className="card">
                    <h3 className="mini-title">Що є в системі</h3>
                    <ul className="info-list">
                        <li>перегляд анкет</li>
                        <li>пошук і фільтрація</li>
                        <li>додавання власної анкети</li>
                        <li>окрема адмінська частина</li>
                    </ul>

                    <div className="button-row section-space">
                        <Link to="/listings" className="btn btn-primary">
                            Переглянути анкети
                        </Link>

                        <Link to="/add-listing" className="btn btn-secondary">
                            Додати анкету
                        </Link>
                    </div>
                </section>

                <aside className="card card-soft">
                    <h3 className="mini-title">Поточний стан входу</h3>

                    {user ? (
                        <>
                            <p>
                                У системі зараз увійшли:
                                <br />
                                <strong>
                                    {user.firstName} {user.lastName}
                                </strong>
                            </p>

                            <div className="meta-row">
                                <span className="badge badge-active">{user.role}</span>
                                <span className="badge badge-warning">{user.email}</span>
                            </div>
                        </>
                    ) : (
                        <p className="muted">Зараз користувач не авторизований.</p>
                    )}
                </aside>
            </div>

            <section className="section-space">
                <div className="card-grid">
                    <article className="card tutor-card">
                        <h3>Перегляд анкет</h3>
                        <p className="muted">
                            Користувач бачить активні анкети та може знайти потрібний варіант.
                        </p>

                        <Link to="/listings" className="btn btn-ghost">
                            Відкрити
                        </Link>
                    </article>

                    <article className="card tutor-card">
                        <h3>Додати анкету</h3>
                        <p className="muted">
                            Авторизований користувач може створити власну анкету через форму.
                        </p>

                        <Link to="/add-listing" className="btn btn-ghost">
                            Перейти
                        </Link>
                    </article>

                    <article className="card tutor-card">
                        <h3>Адміністрування</h3>
                        <p className="muted">
                            Адміністратор керує контентом, користувачами та статусами.
                        </p>

                        <Link to="/admin" className="btn btn-ghost">
                            В адмінку
                        </Link>
                    </article>
                </div>
            </section>
        </div>
    );
}