const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const GRAPHQL_URL = `${API_BASE_URL}/graphql`;

export async function graphqlRequest(query, variables = {}) {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.errors?.[0]?.message || 'GraphQL request failed');
    }

    if (data.errors?.length) {
        throw new Error(data.errors[0].message || 'GraphQL error');
    }

    return data.data;
}