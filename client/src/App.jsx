import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';
import AddListingPage from './pages/AddListingPage';
import MyProfilePage from './pages/MyProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminListingsPage from './pages/AdminListingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/forbidden" element={<ForbiddenPage />} />

                <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                    <Route path="/add-listing" element={<AddListingPage />} />
                    <Route path="/my-profile" element={<MyProfilePage />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="listings" element={<AdminListingsPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}