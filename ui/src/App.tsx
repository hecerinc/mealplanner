import React from 'react';

import { WeekSchedule } from './WeekSchedule';
import { UniverseList } from './UniverseList';
import { fetchDishes, saveDishes } from './api';
import type { Dish, DietSchedule, FoodType } from './App.types';

import { WeekPicker } from './components/WeekPicker';
import { getSundayOfWeek, randomiseWeek, mapFtype2Collection } from './utils';

import './App.scss';

export interface Menu {
	principales: Dish[];
	sopas: Dish[];
	sides: Dish[];
}

export const RandomFoodContext = React.createContext((ft: FoodType, m: string, dow: number, direction: 'right' | 'left') => {});

export const MenuContext = React.createContext<Menu | null>(null);

const App: React.FC = () => {
	const [isEditingWeek, setIsEditingWeek] = React.useState<boolean>(false);
	const [weekDiet, setWeekDiet] = React.useState<DietSchedule[]>([]);
	const [principales, setPrincipales] = React.useState<Dish[]>([]);
	const [sopas, setSopas] = React.useState<Dish[]>([]);
	const [sides, setSides] = React.useState<Dish[]>([]);
	const [currentWeek, setSelectedWeek] = React.useState<Date>(getSundayOfWeek(new Date()));

	const updateFood = (ftype: FoodType, meal: string, dow: number, direction: 'right' | 'left') => {
		const wd = [...weekDiet];
		const dayOfWeek = { ...wd[dow] };
		const currentOpt: number = (dayOfWeek as any)[meal][ftype];
		const collection: Dish[] = mapFtype2Collection(ftype, {
			principales,
			sopas,
			sides,
		});
		let newId = 0;
		if (direction === 'left') {
			newId = currentOpt - 1;
			if (newId < 0) {
				newId = collection.length + newId;
			}
		} else {
			newId = (currentOpt + 1) % collection.length;
		}
		(dayOfWeek as any)[meal][ftype] = newId;
		wd[dow] = dayOfWeek;
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
				{/* <h3 className="weekLabel">Sun. May 19 - Sat. May 15 2021</h3> */}
				{!isEditingWeek && (
					<>
						<WeekPicker
							week={currentWeek}
							setSelectedWeek={(date: Date) => {
								setSelectedWeek(date);
							}}
						/>
						<button
							type="button"
							onClick={() => {
								const randomWeekDiet: DietSchedule[] = randomiseWeek({ principales, sopas, sides });
								setWeekDiet(randomWeekDiet);
								setIsEditingWeek(true);
							}}
						>
							Randomise all
						</button>
					</>
				)}
				<MenuContext.Provider
					value={{
						principales,
						sopas,
						sides,
					}}
				>
					<RandomFoodContext.Provider value={updateFood}>
						<WeekSchedule isEditing={isEditingWeek} schedule={weekDiet} />
					</RandomFoodContext.Provider>
				</MenuContext.Provider>
			</section>
		</main>
	);
};

export default App;
