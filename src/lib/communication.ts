import { Session } from './reducers/sessionReducer';
import { FetchResponse } from './types';

export function handleResponse<T extends FetchResponse>(response: Response) {
	return response.text().then(text => {
		const data = JSON.parse(text) as T;
		if (!response.ok) {
			if ([401, 403].indexOf(response.status) !== -1) {
				localStorage.clear();
				// window.location.reload();
			}

			const error = (data && data && data.message) || response.statusText;
			throw new Error(error);
		}

		return data;
	});
}

export function api<T>(url: string, options: RequestInit): Promise<T> {
	const data = localStorage.getItem('data');
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	if (data) {
		const token = (JSON.parse(data) as Session).token;
		headers.append('Authorization', `Bearer ${token}`);
	}
	options.headers = headers;
	return fetch(url, options)
		.then(res => handleResponse<T>(res))
}

export function get<T>(url: string): Promise<T> {
	const options: RequestInit = {
		method: 'GET',
	}
	return api<T>(url, options);
}

export function post<T>(url: string, body: any): Promise<T> {
	const options: RequestInit = {
		method: 'POST',
		body: JSON.stringify(body),
	}
	return api<T>(url, options);
}

export function put<T>(url: string, body: any): Promise<T> {
	const options: RequestInit = {
		method: 'PUT',
		body: JSON.stringify(body),
	}
	return api<T>(url, options);
}
