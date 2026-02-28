const API_URL = 'http://localhost:3001';

export const api = {
    get: async <T>(path: string): Promise<T> => {
        const res = await fetch(`${API_URL}${path}`);
        if (!res.ok) throw new Error('API Error');
        return res.json();
    },
    post: async <T>(path: string, data: any): Promise<T> => {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API Error');
        return res.json();
    },
    put: async <T>(path: string, data: any): Promise<T> => {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API Error');
        return res.json();
    },
    patch: async <T>(path: string, data: any): Promise<T> => {
        const res = await fetch(`${API_URL}${path}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API Error');
        return res.json();
    }
};
