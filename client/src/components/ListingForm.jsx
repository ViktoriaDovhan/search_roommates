import { useState } from 'react';

function ListingForm({ onAddListing }) {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        price: '',
        habits: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title || !formData.city || !formData.price || !formData.habits) {
            setError('Будь ласка, заповни всі поля');
            return;
        }

        setError('');
        onAddListing(formData);

        setFormData({
            title: '',
            city: '',
            price: '',
            habits: '',
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            <h2>Додати оголошення</h2>

            <input
                type="text"
                name="title"
                placeholder="Заголовок"
                value={formData.title}
                onChange={handleChange}
                style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <input
                type="text"
                name="city"
                placeholder="Місто"
                value={formData.city}
                onChange={handleChange}
                style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <input
                type="number"
                name="price"
                placeholder="Ціна"
                value={formData.price}
                onChange={handleChange}
                style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <input
                type="text"
                name="habits"
                placeholder="Звички"
                value={formData.habits}
                onChange={handleChange}
                style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" style={{ padding: '10px 20px' }}>
                Додати
            </button>
        </form>
    );
}

export default ListingForm;