import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../services/listingsService';

const emptyForm = {
    title: '',
    city: '',
    district: '',
    price: '',
    genderPreference: 'any',
    description: '',
};

export default function AddListingPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const nextErrors = {};

        if (!formData.title.trim()) {
            nextErrors.title = "Заголовок обов'язковий";
        }

        if (!formData.city.trim()) {
            nextErrors.city = "Місто обов'язкове";
        }

        if (!String(formData.price).trim()) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextErrors = validate();
        setErrors(nextErrors);
        setMessage('');
        setSubmitError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);

            await createListing({
                title: formData.title.trim(),
                city: formData.city.trim(),
                district: formData.district.trim(),
                price: Number(formData.price),
                genderPreference: formData.genderPreference,
                description: formData.description.trim(),
            });

            setFormData(emptyForm);
            setMessage('Оголошення успішно додано');

            setTimeout(() => {
                navigate('/listings');
            }, 800);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    <label className="field-label form-label">Заголовок</label>
                    <input
                        className="input form-control"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <p className="error-text mt-2">{errors.title}</p>}
                </div>

                <div className="row g-3 section-space">
                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Місто</label>
                            <input
                                className="input form-control"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            {errors.city && <p className="error-text mt-2">{errors.city}</p>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Район</label>
                            <input
                                className="input form-control"
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-3 section-space">
                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Ціна, грн</label>
                            <input
                                className="input form-control"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                            {errors.price && <p className="error-text mt-2">{errors.price}</p>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Побажання щодо статі</label>
                            <select
                                className="select form-select"
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
                </div>

                <div className="field-group section-space">
                    <label className="field-label form-label">Опис</label>
                    <textarea
                        className="textarea form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {errors.description && (
                        <p className="error-text mt-2">{errors.description}</p>
                    )}
                </div>

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>

                {submitError && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                        {submitError}
                    </div>
                )}

                {message && (
                    <div className="success-box alert alert-success mt-3 mb-0" role="alert">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}