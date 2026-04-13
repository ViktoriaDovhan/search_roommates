const STORAGE_KEY = 'search_roommates_api_mode';

export function getApiMode() {
    const mode = localStorage.getItem(STORAGE_KEY);

    if (mode === 'graphql' || mode === 'rest') {
        return mode;
    }

    return 'rest';
}

export function setApiMode(mode) {
    if (mode !== 'rest' && mode !== 'graphql') {
        return;
    }

    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent('api-mode-changed', { detail: mode }));
}