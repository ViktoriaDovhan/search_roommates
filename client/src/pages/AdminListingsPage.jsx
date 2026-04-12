import { useEffect, useState } from 'react';
import {
    deleteListing,
    getAdminListings,
    toggleListingActive,
} from '../services/listingsService';

export default function AdminListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeId, setActiveId] = useState(null);

    const loadListings = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminListings();
            setListings(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

    const handleToggleStatus = async (id) => {
        try {
            setActiveId(id);
            const updatedListing = await toggleListingActive(id);

            setListings((prev) =>
                prev.map((listing) =>
                    listing.id === id
                        ? { ...listing, isActive: updatedListing.isActive }
                        : listing
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setActiveId(null);
        }
    };

    const handleDeleteListing = async (id) => {
        try {
            setActiveId(id);
            await deleteListing(id);
            setListings((prev) => prev.filter((listing) => listing.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setActiveId(null);
        }
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Керування оголошеннями</h2>
                <p className="page-subtitle">
                    Адміністратор може активувати, деактивувати та видаляти оголошення.
                </p>
            </div>

            {isLoading && (
                <div className="card section-space empty-state">
                    Завантаження оголошень...
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
                                <th>Заголовок</th>
                                <th>Місто</th>
                                <th>Автор</th>
                                <th>Ціна</th>
                                <th>Статус</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {listings.map((listing) => (
                                <tr key={listing.id}>
                                    <td>{listing.title}</td>
                                    <td>{listing.city}</td>
                                    <td>
                                        {listing.User
                                            ? `${listing.User.firstName} ${listing.User.lastName}`
                                            : '—'}
                                    </td>
                                    <td>{listing.price} грн</td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    listing.isActive
                                                        ? 'badge-active'
                                                        : 'badge-inactive'
                                                }`}
                                            >
                                                {listing.isActive ? 'Активне' : 'Неактивне'}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleToggleStatus(listing.id)}
                                                disabled={activeId === listing.id}
                                            >
                                                {listing.isActive
                                                    ? 'Деактивувати'
                                                    : 'Активувати'}
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteListing(listing.id)}
                                                disabled={activeId === listing.id}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {listings.length === 0 && (
                        <div className="section-space empty-state">
                            У базі ще немає оголошень.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}