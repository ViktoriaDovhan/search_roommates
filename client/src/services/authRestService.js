const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/auth`;
const STORAGE_KEY = 'search_roommates_current_user';

export function getCurrentUserFromStorage() {
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

export function clearCurrentUserFromStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

async function parseResponse(response, defaultMessage) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || defaultMessage);
    }

    return data;
}

export async function registerUserRest(formData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    return parseResponse(response, 'Registration failed');
}

export async function loginUserRest(formData) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    const data = await parseResponse(response, 'Login failed');
    saveCurrentUser(data.user);
    return data.user;
}

export async function fetchMeRest() {
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        clearCurrentUserFromStorage();
        return null;
    }

    const user = await response.json().catch(() => null);

    if (!user) {
        clearCurrentUserFromStorage();
        return null;
    }

    saveCurrentUser(user);
    return user;
}

export async function logoutRest() {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    clearCurrentUserFromStorage();
}