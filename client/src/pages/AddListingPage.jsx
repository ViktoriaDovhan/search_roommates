import { useState } from 'react';

export default function AddListingPage() {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        district: '',
        price: '',
        genderPreference: 'any',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [savedData, setSavedData] = useState(null);

    const validate = () => {
        const nextErrors = {};

        if (!formData.title.trim()) {
            nextErrors.title = "Заголовок обов'язковий";
        }

        if (!formData.city.trim()) {
            nextErrors.city = "Місто обов'язкове";
        }

        if (!formData.price.trim()) {
            nextErrors.price = "Ціна обов'язкова";
        } else if (Number(formData.price) <= 0) {
            nextErrors.price = 'Ціна має бути більшою за 0';
        }

        if (!formData.description.trim()) {
            nextErrors.description = "Опис обов'язковий";
        }

        return nextErrors;
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setSavedData(null);
            return;
        }

        setSavedData(formData);
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Додати оголошення</h2>
                <p className="page-subtitle">
                    Тут користувач створює оголошення про пошук сусіда.
                </p>
            </div>

            <form className="card form-card" onSubmit={handleSubmit}>
                <div className="field-group">
                    <label className="field-label">Заголовок</label>
                    <input
                        className="input"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <p className="error-text">{errors.title}</p>}
                </div>

                <div className="grid-2 section-space">
                    <div className="field-group">
                        <label className="field-label">Місто</label>
                        <input
                            className="input"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        {errors.city && <p className="error-text">{errors.city}</p>}
                    </div>

                    <div className="field-group">
                        <label className="field-label">Район</label>
                        <input
                            className="input"
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid-2 section-space">
                    <div className="field-group">
                        <label className="field-label">Ціна, грн</label>
                        <input
                            className="input"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        {errors.price && <p className="error-text">{errors.price}</p>}
                    </div>

                    <div className="field-group">
                        <label className="field-label">Побажання щодо статі</label>
                        <select
                            className="select"
                            name="genderPreference"
                            value={formData.genderPreference}
                            onChange={handleChange}
                        >
                            <option value="any">Без різниці</option>
                            <option value="female">Тільки дівчина</option>
                            <option value="male">Тільки хлопець</option>
                        </select>
                    </div>
                </div>

                <div className="field-group section-space">
                    <label className="field-label">Опис</label>
                    <textarea
                        className="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {errors.description && (
                        <p className="error-text">{errors.description}</p>
                    )}
                </div>

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary">
                        Зберегти
                    </button>
                </div>

                {savedData && (
                    <div className="success-box">
                        <strong>Форма пройшла клієнтську перевірку</strong>
                        <div className="code-block">{JSON.stringify(savedData, null, 2)}</div>
                    </div>
                )}
            </form>
        </div>
    );
}