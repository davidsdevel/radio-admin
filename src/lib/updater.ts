const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default async function updater<T>(method: 'POST' | 'PATCH' | 'DELETE', path: string, fetchData?: Record<string, string | number | boolean | string[]> | FormData): Promise<T> {
    const headers = {}
    const fetchConfig: RequestInit = {
        method
    }

    if (fetchData) {
        if (fetchData instanceof FormData) {
            fetchConfig.body = fetchData;
            fetchConfig.headers = headers
        }
        else {
            fetchConfig.body = JSON.stringify(fetchData);
            fetchConfig.headers = {
                ...headers,
                'Content-Type': 'application/json'
            }
        }
    }
    
    //TODO: Handle auth
    const response = await fetch(`${endpoint}${path}`, fetchConfig);

    const data = await response.json();

    return data;
}