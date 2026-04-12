import { useState } from 'react';
import { registerUser } from '../services/authService';

const emptyForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export default function RegisterPage() {
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.password.trim()) {
            nextErrors.password = "Пароль обов'язковий";
        } else if (formData.password.length < 6) {
            nextErrors.password = 'Пароль має містити щонайменше 6 символів';
        }

        if (!formData.confirmPassword.trim()) {
            nextErrors.confirmPassword = "Підтвердження пароля обов'язкове";
        } else if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = 'Паролі не співпадають';
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

            const data = await registerUser({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            setMessage(
                data.message ||
                'Реєстрація успішна. Перевірте пошту та підтвердьте email.'
            );
            setFormData(emptyForm);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Реєстрація</h2>
                <p className="page-subtitle">
                    Створіть акаунт і підтвердьте email, щоб увійти в систему.
                </p>
            </div>

            <form className="card form-card" onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Ім’я</label>
                            <input
                                className="input form-control"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <p className="error-text mt-2">{errors.firstName}</p>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Прізвище</label>
                            <input
                                className="input form-control"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <p className="error-text mt-2">{errors.lastName}</p>}
                        </div>
                    </div>
                </div>

                <div className="field-group section-space">
                    <label className="field-label form-label">Email</label>
                    <input
                        className="input form-control"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error-text mt-2">{errors.email}</p>}
                </div>

                <div className="row g-3 section-space">
                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Пароль</label>
                            <input
                                className="input form-control"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="error-text mt-2">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="field-group">
                            <label className="field-label form-label">Підтвердіть пароль</label>
                            <input
                                className="input form-control"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <p className="error-text mt-2">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
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