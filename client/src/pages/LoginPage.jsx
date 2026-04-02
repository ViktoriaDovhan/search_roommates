import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAs } from '../services/authService';

export default function LoginPage() {
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleLogin = () => {
        const user = loginAs(role);

        if (user.role === 'admin') {
            navigate('/admin');
            return;
        }

        navigate('/my-profile');
    };

    return (
        <div>
            <div className="page-head">
                <h2 className="page-title">Вхід</h2>
                <p className="page-subtitle">
                    Зараз це тимчасова сторінка входу для перевірки маршрутизації та ролей.
                </p>
            </div>

            <div className="card form-card">
                <div className="form-grid">
                    <div className="field-group">
                        <label className="field-label">Увійти як</label>
                        <select
                            className="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">Користувач</option>
                            <option value="admin">Адміністратор</option>
                        </select>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-primary" onClick={handleLogin}>
                            Увійти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}