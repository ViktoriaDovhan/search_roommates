import { useEffect, useState } from 'react';
import { getPublicListings } from '../services/listingsService';

export default function ListingsPage() {
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('');
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isCancelled = false;

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);

                const data = await getPublicListings({
                    search,
                    genderPreference: gender,
                });

                if (!isCancelled) {
                    setListings(data);
                    setError('');
                }
            } catch (err) {
                if (!isCancelled) {
                    setListings([]);
                    setError(err.message);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }, 300);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [search, gender]);

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Оголошення</h2>
                <p className="page-subtitle">
                    Тут показуються активні оголошення про пошук сусідів.
                </p>
            </div>

            <div className="card">
                <div className="row g-3 align-items-end">
                    <div className="col-md-8">
                        <input
                            className="input form-control"
                            type="text"
                            placeholder="Пошук за містом, районом або заголовком"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <select
                            className="select form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Будь-яка стать</option>
                            <option value="female">Тільки дівчина</option>
                            <option value="male">Тільки хлопець</option>
                            <option value="any">Без різниці</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="card section-space empty-state">
                    Завантаження оголошень...
                </div>
            )}

            {!isLoading && error && (
                <div className="card section-space empty-state">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <div className="row g-4 section-space">
                        {listings.map((listing) => (
                            <div key={listing.id} className="col-lg-4 col-md-6">
                                <article className="card tutor-card h-100">
                                    <h3>{listing.title}</h3>

                                    <div className="meta-row">
                                        <span className="badge badge-warning">{listing.city}</span>

                                        {listing.district && (
                                            <span className="badge badge-warning">
                                                {listing.district}
                                            </span>
                                        )}

                                        <span className="badge badge-active">
                                            {listing.price} грн
                                        </span>
                                    </div>

                                    <p className="muted">
                                        Побажання:{' '}
                                        {listing.genderPreference === 'female'
                                            ? 'тільки дівчина'
                                            : listing.genderPreference === 'male'
                                                ? 'тільки хлопець'
                                                : 'без різниці'}
                                    </p>

                                    {listing.User && (
                                        <p className="muted">
                                            Автор: {listing.User.firstName} {listing.User.lastName}
                                        </p>
                                    )}

                                    <p className="muted mb-0">{listing.description}</p>
                                </article>
                            </div>
                        ))}
                    </div>

                    {listings.length === 0 && (
                        <div className="card section-space empty-state">
                            За цими фільтрами нічого не знайдено.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}