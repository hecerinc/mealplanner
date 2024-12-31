export interface Dish {
	id: number;
	name: string;
}
export enum FoodType {
	principales = 'principales',
	sopas = 'sopas',
	sides = 'sides',
}

export interface Menu {
	principales: Dish[];
	sopas: Dish[];
	sides: Dish[];
}
export interface DietSchedule {
	comida: {
		principales: number;
		sides: number;
		sopas: number;
	};
	cena: {
		principales: number;
	};
}

export interface DishCollections {
	principales: Dish[];
	sopas: Dish[];
	sides: Dish[];
}
