import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

export default function ProtectedRoute({ allowedRoles = [] }) {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />;
}