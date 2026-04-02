const API_URL = 'http://localhost:8080/api/listings';

export async function getPublicListings(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set('search', params.search);
    if (params.city) searchParams.set('city', params.city);
    if (params.genderPreference) searchParams.set('genderPreference', params.genderPreference);

    const response = await fetch(`${API_URL}?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch listings');
    }

    return response.json();
}

export async function createListing(listingData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(listingData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create listing');
    }

    return data;
}

export async function getAdminListings() {
    const response = await fetch(`${API_URL}/admin/all`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch admin listings');
    }

    return response.json();
}

export async function toggleListingActive(id) {
    const response = await fetch(`${API_URL}/admin/${id}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle listing');
    }

    return data;
}

export async function deleteListing(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete listing');
    }

    return data;
}