import { HOST } from '../config';
import usersService from '../services/users.service';
import { FetchResponse } from './types';

export function handleResponse<T extends FetchResponse>(response: Response, options: RequestInit, retry: boolean = false): Promise<T> {
	return response.text().then(async (text) => {
		const data = JSON.parse(text) as T;
		if (!response.ok) {
			if ([401, 403].indexOf(response.status) !== -1) {
				const data = localStorage.getItem('data');
				if (data && response.url !== `${HOST}users/refresh` && !retry) {
					const parsedData = (JSON.parse(data));
					const refreshToken = parsedData.refreshToken;
					if (refreshToken) {
						try {
							const refresh = await usersService.refresh({ refreshToken });
							const newData = { 
								user: parsedData.user, 
								device: parsedData.device,
								...refresh 
							};
							localStorage.setItem('data', JSON.stringify(newData));
							(options.headers as Headers).set('Authorization', `Bearer ${refresh.token}`);
							return await fetch(response.url, options)
								.then(res => handleResponse<T>(res, options, true))
						} catch (e) {
							localStorage.clear();
							window.location.reload();
							throw e;
						}
					}
				}

				localStorage.clear();
				window.location.reload();
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
	headers.set('Content-Type', 'application/json');
	if (data) {
		const token = (JSON.parse(data)).token;
		headers.set('Authorization', `Bearer ${token}`);
	}
	options.headers = headers;
	return fetch(url, options)
		.then(res => handleResponse<T>(res, options))
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
