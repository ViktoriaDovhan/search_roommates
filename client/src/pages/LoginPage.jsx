import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const nextErrors = {};

        if (!formData.email.trim()) {
            nextErrors.email = 'Email обовʼязковий';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = 'Некоректний email';
        }

        if (!formData.password.trim()) {
            nextErrors.password = "Пароль обов'язковий";
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
        setSubmitError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);

            const user = await loginUser({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (user.role === 'admin') {
                navigate('/admin');
                return;
            }

            navigate('/my-profile');
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Вхід</h2>
                <p className="page-subtitle">
                    Увійдіть у свій акаунт, щоб додавати оголошення та керувати ними.
                </p>
            </div>

            <form className="card form-card" onSubmit={handleSubmit}>
                <div className="field-group">
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

                <div className="field-group section-space">
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

                <div className="button-row section-space">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Вхід...' : 'Увійти'}
                    </button>
                </div>

                {submitError && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                        {submitError}
                    </div>
                )}
            </form>
        </div>
    );
}