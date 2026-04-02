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

                <div className="grid-2 section-space">
                    <div className="field-group">
                        <label className="field-label">Пароль</label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </div>

                    <div className="field-group">
                        <label className="field-label">Підтвердіть пароль</label>
                        <input
                            className="input"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                            <p className="error-text">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </div>

                {submitError && <p className="error-text">{submitError}</p>}
                {message && <div className="success-box">{message}</div>}
            </form>
        </div>
    );
}