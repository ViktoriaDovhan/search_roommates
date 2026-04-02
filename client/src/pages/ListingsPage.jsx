import { useMemo, useState } from 'react';

const initialListings = [
    {
        id: 1,
        title: 'Шукаю сусідку в 2-кімнатну квартиру',
        city: 'Київ',
        district: 'Оболонь',
        price: 8000,
        genderPreference: 'female',
        description: 'Окрема кімната, поруч метро, без тварин.',
        isActive: true,
    },
    {
        id: 2,
        title: 'Шукаю сусіда для спільної оренди',
        city: 'Львів',
        district: 'Сихів',
        price: 6500,
        genderPreference: 'male',
        description: 'Спокійний район, новий ремонт.',
        isActive: true,
    },
    {
        id: 3,
        title: 'Кімната для сусіда або сусідки',
        city: 'Харків',
        district: 'Салтівка',
        price: 5000,
        genderPreference: 'any',
        description: 'Можна студентам, є пральна машина й Wi-Fi.',
        isActive: false,
    },
];

export default function ListingsPage() {
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('');

    const visibleListings = useMemo(() => {
        return initialListings.filter((listing) => {
            const matchesSearch =
                listing.title.toLowerCase().includes(search.toLowerCase()) ||
                listing.city.toLowerCase().includes(search.toLowerCase()) ||
                listing.district.toLowerCase().includes(search.toLowerCase());

            const matchesGender = gender ? listing.genderPreference === gender : true;

            return listing.isActive && matchesSearch && matchesGender;
        });
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
                <div className="search-panel">
                    <input
                        className="input"
                        type="text"
                        placeholder="Пошук за містом, районом або заголовком"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select"
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

            <div className="card-grid section-space">
                {visibleListings.map((listing) => (
                    <article key={listing.id} className="card tutor-card">
                        <h3>{listing.title}</h3>

                        <div className="meta-row">
                            <span className="badge badge-warning">{listing.city}</span>
                            <span className="badge badge-warning">{listing.district}</span>
                            <span className="badge badge-active">{listing.price} грн</span>
                        </div>

                        <p className="muted">
                            Побажання:{" "}
                            {listing.genderPreference === 'female'
                                ? 'тільки дівчина'
                                : listing.genderPreference === 'male'
                                    ? 'тільки хлопець'
                                    : 'без різниці'}
                        </p>

                        <p className="muted">{listing.description}</p>
                    </article>
                ))}
            </div>

            {visibleListings.length === 0 && (
                <div className="card section-space empty-state">
                    За цими фільтрами нічого не знайдено.
                </div>
            )}
        </div>
    );
}