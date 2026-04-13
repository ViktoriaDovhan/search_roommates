const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LISTINGS_URL = `${API_BASE_URL}/api/listings`;

function buildQuery(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

async function parseResponse(response, defaultMessage) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || defaultMessage);
    }

    return data;
}

export async function getPublicListingsRest({ search = '', city = '', genderPreference = '' } = {}) {
    const query = buildQuery({ search, city, genderPreference });

    const response = await fetch(`${LISTINGS_URL}${query}`, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response, 'Не вдалося завантажити оголошення');
}

export async function createListingRest(formData) {
    const response = await fetch(LISTINGS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    return parseResponse(response, 'Не вдалося створити оголошення');
}

export async function updateListingRest(id, formData) {
    const response = await fetch(`${LISTINGS_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    return parseResponse(response, 'Не вдалося оновити оголошення');
}

export async function deleteListingRest(id) {
    const response = await fetch(`${LISTINGS_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    return parseResponse(response, 'Не вдалося видалити оголошення');
}

export async function getAdminListingsRest() {
    const response = await fetch(`${LISTINGS_URL}/admin/all`, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response, 'Не вдалося завантажити список оголошень');
}

export async function toggleListingActiveRest(id) {
    const response = await fetch(`${LISTINGS_URL}/admin/${id}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
    });

    return parseResponse(response, 'Не вдалося змінити статус оголошення');
}

export async function getAdminUsersRest() {
    const response = await fetch(`${LISTINGS_URL}/admin/users/all`, {
        method: 'GET',
        credentials: 'include',
    });

    return parseResponse(response, 'Не вдалося завантажити список користувачів');
}

export async function getAdminStatsRest() {
    const users = await getAdminUsersRest();
    const listings = await getAdminListingsRest();

    const activeListings = listings.filter((item) => item.isActive).length;
    const inactiveListings = listings.filter((item) => !item.isActive).length;
    const adminUsers = users.filter((item) => item.role === 'admin').length;
    const regularUsers = users.filter((item) => item.role === 'user').length;
    const verifiedUsers = users.filter((item) => item.isVerified).length;
    const unverifiedUsers = users.filter((item) => !item.isVerified).length;

    return {
        totalUsers: users.length,
        totalListings: listings.length,
        activeListings,
        inactiveListings,
        adminUsers,
        regularUsers,
        verifiedUsers,
        unverifiedUsers,
    };
}