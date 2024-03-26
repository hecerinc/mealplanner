// src/api.ts

import { Dish } from './App.types';

const baseURL: string = 'http://localhost:5000/api';

async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data),
	});
	return response.json();
}

function api<T>(url: string): Promise<T> {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				console.error(response.statusText);
			}
			return response.json();
		})
		.catch((e) => {
			throw e;
		});
}

export const fetchDishes = async (collection: string): Promise<any> => {
	const endpoint = `${baseURL}/${collection}`;
	return api<Dish[]>(endpoint);
};

export const saveDishes = async (collection: string, items: Dish[]): Promise<any> => {
	const endpoint = `${baseURL}/${collection}`;
	return postData(endpoint, items);
};
