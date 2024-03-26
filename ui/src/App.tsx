import React from 'react';

import { WeekSchedule, DietSchedule } from './WeekSchedule';
import { UniverseList } from './UniverseList';
import { fetchDishes, saveDishes } from './api';
import { Dish, FoodType } from './App.types';

import './App.scss';

const getRandomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const RandomFoodContext = React.createContext((ft: FoodType, m: string, dow: number) => {});

const App: React.FC = () => {
	const [isEditingWeek, setIsEditingWeek] = React.useState<boolean>(false);

	const [principales, setPrincipales] = React.useState<Dish[]>([]);
	const [weekDiet, setWeekDiet] = React.useState<DietSchedule[]>([]);
	const [sopas, setSopas] = React.useState<Dish[]>([]);
	const [sides, setSides] = React.useState<Dish[]>([]);

	const getRandomFood = (ftype: FoodType): Dish => {
		let collection;
		switch (ftype) {
			case FoodType.principal:
				collection = principales;
				break;
			case FoodType.soup:
				collection = sopas;
				break;
			case FoodType.side:
				collection = sides;
				break;
			default:
				collection = principales;
		}
		const collectionId = getRandomInt(0, collection.length - 1);
		return collection[collectionId];
	};

	const updateFood = (ftype: FoodType, meal: string, dow: number) => {
		const wd = [...weekDiet];
		const dayOfWeek = { ...wd[dow] };
		(dayOfWeek as any)[meal][ftype] = getRandomFood(ftype).name;
		wd[dow] = dayOfWeek;
		// (weekDiet[dow] as any)[meal][ftype] = getRandomFood(ftype);
		setWeekDiet(wd);
	};

	React.useEffect(() => {
		Promise.all([fetchDishes('principales'), fetchDishes('sopas'), fetchDishes('sides')])
			.then(([principales, sopas, sides]) => {
				setPrincipales(principales);
				setSopas(sopas);
				setSides(sides);
			})
			.catch((e) => {
				console.error('Failed to fetch the database', e);
			});
	}, []);

	const saveCollection = async (collection: string, items: Dish[]) => {
		await saveDishes(collection, items);
		switch (collection) {
			case 'principales':
				setPrincipales(items);
				break;
			case 'sopas':
				setSopas(items);
				break;
			case 'sides':
				setSides(items);
				break;
			default:
				console.error(`Could not find collection ${collection}`);
				return false;
		}
		return true;
	};

	return (
		<main className="App">
			<h1>Meal planner</h1>
			<section>
				<h2>Universe</h2>
				<div className="universeSections">
					<UniverseList
						title="Platos principales"
						items={principales ?? []}
						saveCollection={saveCollection.bind(null, 'principales')}
					/>
					<UniverseList title="Sides" items={sides ?? []} saveCollection={saveCollection.bind(null, 'sides')} />
					<UniverseList title="Sopas / Caldos" items={sopas ?? []} saveCollection={saveCollection.bind(null, 'sopas')} />
				</div>
			</section>
			<section className="weekView">
				<div className="univsecTitle">
					<h2>Week view</h2>
					<div>
						<button
							type="button"
							className="editBtn"
							onClick={() => {
								setIsEditingWeek(!isEditingWeek);
							}}
						>
							{isEditingWeek ? 'Save' : 'Edit'}
						</button>
						{isEditingWeek && (
							<button
								type="button"
								className="editBtn"
								onClick={() => {
									setIsEditingWeek(false);
								}}
							>
								Cancel
							</button>
						)}
					</div>
				</div>
				<h3 className="weekLabel">Sun. May 19 - Sat. May 15 2021</h3>
				{!isEditingWeek && (
					<button
						type="button"
						onClick={() => {
							const week = Array(7).fill(null);
							for (let i = 0; i < 7; i++) {
								week[i] = {
									cena: {
										principal: getRandomFood(FoodType.principal).name,
									},
									comida: {
										soup: getRandomFood(FoodType.soup).name,
										principal: getRandomFood(FoodType.principal).name,
										side: getRandomFood(FoodType.side).name,
									},
								};
							}
							setWeekDiet(week);
						}}
					>
						Randomise all
					</button>
				)}
				<RandomFoodContext.Provider value={updateFood}>
					<WeekSchedule isEditing={isEditingWeek} schedule={weekDiet} />
				</RandomFoodContext.Provider>
			</section>
		</main>
	);
};

export default App;
