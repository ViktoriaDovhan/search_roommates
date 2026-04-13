import { getApiMode } from './apiMode';
import {
    getPublicListingsRest,
    createListingRest,
    updateListingRest,
    deleteListingRest,
    getAdminListingsRest,
    toggleListingActiveRest,
    getAdminUsersRest,
    getAdminStatsRest,
} from './listingsRestService';
import {
    getPublicListingsGraphql,
    createListingGraphql,
    updateListingGraphql,
    deleteListingGraphql,
    getAdminListingsGraphql,
    toggleListingActiveGraphql,
    getAdminUsersGraphql,
    getAdminStatsGraphql,
} from './listingsGraphqlService';

export async function getPublicListings(filters = {}) {
    if (getApiMode() === 'graphql') {
        return getPublicListingsGraphql(filters);
    }

    return getPublicListingsRest(filters);
}

export async function createListing(formData) {
    if (getApiMode() === 'graphql') {
        return createListingGraphql(formData);
    }

    return createListingRest(formData);
}

export async function updateListing(id, formData) {
    if (getApiMode() === 'graphql') {
        return updateListingGraphql(id, formData);
    }

    return updateListingRest(id, formData);
}

export async function deleteListing(id) {
    if (getApiMode() === 'graphql') {
        return deleteListingGraphql(id);
    }

    return deleteListingRest(id);
}

export async function getAdminListings() {
    if (getApiMode() === 'graphql') {
        return getAdminListingsGraphql();
    }

    return getAdminListingsRest();
}

export async function toggleListingActive(id) {
    if (getApiMode() === 'graphql') {
        return toggleListingActiveGraphql(id);
    }

    return toggleListingActiveRest(id);
}

export async function getAdminUsers() {
    if (getApiMode() === 'graphql') {
        return getAdminUsersGraphql();
    }

    return getAdminUsersRest();
}

export async function getAdminStats() {
    if (getApiMode() === 'graphql') {
        return getAdminStatsGraphql();
    }

    return getAdminStatsRest();
}