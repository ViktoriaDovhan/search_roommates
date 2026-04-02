const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/auth`;
const STORAGE_KEY = 'search_roommates_current_user';

export function getCurrentUser() {
    const rawUser = localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEY);
}

async function parseResponse(response, defaultMessage) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || defaultMessage);
    }

    return data;
}

export async function registerUser(formData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    return parseResponse(response, 'Registration failed');
}

export async function loginUser(formData) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    const data = await parseResponse(response, 'Login failed');
    saveCurrentUser(data.user);

    return data.user;
}

export async function fetchMe() {
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        clearCurrentUser();
        return null;
    }

    const user = await response.json().catch(() => null);

    if (!user) {
        clearCurrentUser();
        return null;
    }

    saveCurrentUser(user);
    return user;
}

export async function logout() {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    clearCurrentUser();
}