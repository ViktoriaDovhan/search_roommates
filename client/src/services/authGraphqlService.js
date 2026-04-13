import { graphqlRequest } from './graphqlClient';
import {
    getCurrentUserFromStorage,
    clearCurrentUserFromStorage,
} from './authRestService';

const STORAGE_KEY = 'search_roommates_current_user';

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export { getCurrentUserFromStorage };

export async function registerUserGraphql(formData) {
    const query = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        message
      }
    }
  `;

    return graphqlRequest(query, { input: formData });
}

export async function loginUserGraphql(formData) {
    const query = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        id
        firstName
        lastName
        email
        role
      }
    }
  `;

    const data = await graphqlRequest(query, { input: formData });
    saveCurrentUser(data.login);
    return data.login;
}

export async function fetchMeGraphql() {
    const query = `
    query Me {
      me {
        id
        firstName
        lastName
        email
        role
      }
    }
  `;

    const data = await graphqlRequest(query);

    if (!data.me) {
        clearCurrentUserFromStorage();
        return null;
    }

    saveCurrentUser(data.me);
    return data.me;
}

export async function logoutGraphql() {
    const query = `
    mutation Logout {
      logout {
        message
      }
    }
  `;

    await graphqlRequest(query);
    clearCurrentUserFromStorage();
}