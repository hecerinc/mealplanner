import { ApiDietSchedule } from './api.types';
import { DietSchedule, Dish, DishCollections } from './App.types';

const findDish = (dishIndex: number, inCollection: Dish[]): Dish | undefined => {
	return inCollection.find((d) => d.id === dishIndex);
};

const findIndexOfDish = (dishName: string, collection: Dish[]): number => {
	return collection.find((t) => t.name === dishName)?.id ?? -1;
};

/*
 * In the App state, we store the dishes as the indexes of the collections they resolve to
 * (which is probably not very wise as if we ever change the menu order in the backend, we're fucked)
 * so to store, we have to convert to the actual dishes string.
 */
export const replaceWithValues = (weekDiet: DietSchedule[], collections: DishCollections): ApiDietSchedule[] => {
	const { principales, sopas, sides } = collections;
	const result: ApiDietSchedule[] = weekDiet.map((wd: DietSchedule) => {
		return {
			comida: {
				principales: findDish(wd.comida.principales, principales)?.name ?? '',
				sides: findDish(wd.comida.sides, sides)?.name ?? '',
				sopas: findDish(wd.comida.sopas, sopas)?.name ?? '',
			},
			cena: {
				principales: findDish(wd.cena.principales, principales)?.name ?? '',
			},
		};
	});
	return result;
};

/*
 * And the reverse process...
 */
export const reverseLookupDiet = (apiWeekDiet: ApiDietSchedule[], collections: DishCollections): DietSchedule[] => {
	const { principales, sopas, sides } = collections;
	const result: DietSchedule[] = apiWeekDiet.map((wd: ApiDietSchedule) => {
		return {
			comida: {
				principales: findIndexOfDish(wd.comida.principales, principales),
				sides: findIndexOfDish(wd.comida.sides, sides),
				sopas: findIndexOfDish(wd.comida.sopas, sopas),
			},
			cena: {
				principales: findIndexOfDish(wd.cena.principales, principales),
			},
		};
	});
	return result;
};
