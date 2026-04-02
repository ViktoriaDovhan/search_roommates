const API_URL = 'http://localhost:8080/api/auth';
const STORAGE_KEY = 'search_roommates_current_user';

export function getCurrentUser() {
    const rawUser = localStorage.getItem(STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function registerUser(formData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data;
}

export async function loginUser(formData) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    saveCurrentUser(data.user);
    return data.user;
}

export async function fetchMe() {
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }

    const user = await response.json();
    saveCurrentUser(user);
    return user;
}

export async function logout() {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    localStorage.removeItem(STORAGE_KEY);
}