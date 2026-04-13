import { getApiMode } from './apiMode';
import {
    getCurrentUserFromStorage,
    registerUserRest,
    loginUserRest,
    fetchMeRest,
    logoutRest,
} from './authRestService';
import {
    registerUserGraphql,
    loginUserGraphql,
    fetchMeGraphql,
    logoutGraphql,
} from './authGraphqlService';

export function getCurrentUser() {
    return getCurrentUserFromStorage();
}

export async function registerUser(formData) {
    if (getApiMode() === 'graphql') {
        return registerUserGraphql(formData);
    }

    return registerUserRest(formData);
}

export async function loginUser(formData) {
    if (getApiMode() === 'graphql') {
        return loginUserGraphql(formData);
    }

    return loginUserRest(formData);
}

export async function fetchMe() {
    if (getApiMode() === 'graphql') {
        return fetchMeGraphql();
    }

    return fetchMeRest();
}

export async function logout() {
    if (getApiMode() === 'graphql') {
        return logoutGraphql();
    }

    return logoutRest();
}