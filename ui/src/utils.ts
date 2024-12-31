import type { DietSchedule, Dish, DishCollections } from './App.types';
import { FoodType } from './App.types';

export const getCurrentWeek = (): Date => {
	return getSundayOfWeek(new Date());
};

export const getSundayOfWeek = (chosenDate: Date) => {
	// Create a new Date object to avoid mutating the original date
	const sunday = new Date(chosenDate);

	// Get the current day of the week (0-6)
	const dayOfWeek = sunday.getDay();

	// Calculate the difference from Sunday (0 is Sunday, 6 is Saturday)
	const diffToSunday = dayOfWeek;

	// Set the date to the Sunday of the same week
	sunday.setDate(sunday.getDate() - diffToSunday);

	return sunday;
};

const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatDate = (date: Date): string => {
	const month = date.getMonth();
	const monthSF = monthMap[month].substring(0, 3) + '.';
	const day = date.getDate();
	const year = date.getFullYear();
	return `${monthSF} ${day}, ${year}`;
};

// Format as YYYY-MM-DD
export const formatDateBackend = (date: Date): string => {
	const offset = date.getTimezoneOffset();
	const d1 = new Date(date.getTime() - offset * 60 * 1000);
	return d1.toISOString().split('T')[0];
};

export const mapFtype2Collection = (ftype: FoodType, collections: DishCollections): Dish[] => {
	let collection;
	const { principales, sopas, sides } = collections;
	switch (ftype) {
		case FoodType.principales:
			collection = principales;
			break;
		case FoodType.sopas:
			collection = sopas;
			break;
		case FoodType.sides:
			collection = sides;
			break;
		default:
			collection = principales;
	}
	return collection;
};

const getRandomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFood = (ftype: FoodType, collections: DishCollections): number => {
	let collection: Dish[] = mapFtype2Collection(ftype, collections);
	const collectionId = getRandomInt(0, collection.length - 1);
	return collectionId;
};

// Get a random 7-day menu
export const randomiseWeek = (collections: DishCollections): DietSchedule[] => {
	const week = Array(7).fill(null);
	for (let i = 0; i < 7; i++) {
		week[i] = {
			cena: {
				principales: getRandomFood(FoodType.principales, collections),
			},
			comida: {
				sopas: getRandomFood(FoodType.sopas, collections),
				principales: getRandomFood(FoodType.principales, collections),
				sides: getRandomFood(FoodType.sides, collections),
			},
		} as DietSchedule;
	}
	return week;
};
