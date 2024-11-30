const endpoint = process.env.API_ENDPOINT;

export default async function fetcher<T>(path: string, query?: Record<string, any>): Promise<T> {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : '';

    //TODO: Handle auth
    const response = await fetch(`${endpoint}${path}${queryString}`);

    const data = await response.json();

    return data;
}