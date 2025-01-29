// src/api.ts
import { ApiDietSchedule } from './api.types';
import type { Dish } from './App.types';
import { formatDateBackend } from './utils';

const getDomain = () => {
	if (window.location.host.indexOf('13.66.213.192') > -1 || window.location.host.indexOf('arctan.dev') > -1) {
		return 'http://13.66.213.192:8993';
	}
	return 'http://localhost:5000';
};
const domain = getDomain();
const baseURL: string = `${domain}/api`;

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

// TODO: remove any
export const fetchDishes = async (collection: string): Promise<any> => {
	const endpoint = `${baseURL}/${collection}`;
	return api<Dish[]>(endpoint);
};

// TODO: remove any
export const saveDishes = async (collection: string, items: Dish[]): Promise<any> => {
	const endpoint = `${baseURL}/${collection}`;
	return postData(endpoint, items);
};

export const fetchWeek = async (week: Date): Promise<ApiDietSchedule[]> => {
	const weekstr = formatDateBackend(week);
	const endpoint = `${baseURL}/week_menu?week=${weekstr}`;

	return api<ApiDietSchedule[]>(endpoint);
};

// TODO: remove any
export const saveWeek = async (week: Date, weekDiet: ApiDietSchedule[]): Promise<any> => {
	const weekstr = formatDateBackend(week);
	const endpoint = `${baseURL}/week_menu?week=${weekstr}`;

	const response = await postData(endpoint, weekDiet);
	console.log('Saving response:', response);
	if (response.success) {
		return true;
	}
	return false;
};
