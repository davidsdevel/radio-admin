const endpoint = process.env.API_ENDPOINT;

export default async function updater<T>(method: 'POST' | 'PATCH' | 'DELETE', path: string, fetchData?: Record<string, any>): Promise<T> {
    const headers = {}
    const fetchConfig: RequestInit = {
        method
    }

    if (fetchData) {
        fetchConfig.body = JSON.stringify(fetchData);
        fetchConfig.headers = {
            ...headers,
            'Content-Type': 'application/json'
        }
    }
    
    //TODO: Handle auth
    const response = await fetch(`${endpoint}${path}`, fetchConfig);

    const data = await response.json();

    return data;
}