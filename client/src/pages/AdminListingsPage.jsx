import { useState } from 'react';

const initialListings = [
    {
        id: 1,
        title: 'Шукаю сусідку в 2-кімнатну квартиру',
        city: 'Київ',
        price: 8000,
        isActive: true,
    },
    {
        id: 2,
        title: 'Шукаю сусіда для спільної оренди',
        city: 'Львів',
        price: 6500,
        isActive: true,
    },
    {
        id: 3,
        title: 'Кімната для сусіда або сусідки',
        city: 'Харків',
        price: 5000,
        isActive: false,
    },
];

export default function AdminListingsPage() {
    const [listings, setListings] = useState(initialListings);

    const toggleStatus = (id) => {
        setListings((prev) =>
            prev.map((listing) =>
                listing.id === id ? { ...listing, isActive: !listing.isActive } : listing
            )
        );
    };

    const deleteListing = (id) => {
        setListings((prev) => prev.filter((listing) => listing.id !== id));
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Керування оголошеннями</h2>
                <p className="page-subtitle">
                    Адміністратор може активувати, деактивувати та видаляти оголошення.
                </p>
            </div>

            <div className="card table-card">
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Заголовок</th>
                            <th>Місто</th>
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
                                <td>{listing.price} грн</td>
                                <td>
                    <span
                        className={`badge ${
                            listing.isActive ? 'badge-active' : 'badge-inactive'
                        }`}
                    >
                      {listing.isActive ? 'Активне' : 'Неактивне'}
                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => toggleStatus(listing.id)}
                                        >
                                            {listing.isActive ? 'Деактивувати' : 'Активувати'}
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteListing(listing.id)}
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
            </div>
        </div>
    );
}