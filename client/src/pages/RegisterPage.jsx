import { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const validate = () => {
        const nextErrors = {};

        if (!formData.firstName.trim()) {
            nextErrors.firstName = "Ім'я обов'язкове";
        }

        if (!formData.lastName.trim()) {
            nextErrors.lastName = "Прізвище обов'язкове";
        }

        if (!formData.email.trim()) {
            nextErrors.email = 'Email обовʼязковий';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = 'Некоректний email';
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
            setMessage('');
            return;
        }

        setMessage('Клієнтська валідація пройдена. Далі сюди підключимо реєстрацію через бекенд.');
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Реєстрація</h2>
                <p className="page-subtitle">
                    Базова форма з валідацією найважливіших полів.
                </p>
            </div>

            <form className="card form-card" onSubmit={handleSubmit}>
                <div className="grid-2">
                    <div className="field-group">
                        <label className="field-label">Ім’я</label>
                        <input
                            className="input"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                    </div>

                    <div className="field-group">
                        <label className="field-label">Прізвище</label>
                        <input
                            className="input"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                    </div>
                </div>

                <div className="field-group section-space">
                    <label className="field-label">Email</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary">
                        Зареєструватися
                    </button>
                </div>

                {message && <div className="success-box">{message}</div>}
            </form>
        </div>
    );
}