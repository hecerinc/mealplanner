import React from 'react';

import { Button, TabList, Tab, TabValue, SelectTabData, SelectTabEvent } from '@fluentui/react-components';

import { WeekSchedule } from './WeekSchedule';
import { UniverseList } from './UniverseList';
import { fetchDishes, fetchWeek, saveDishes, saveWeek } from './api';
import type { Dish, DietSchedule, FoodType, Menu } from './App.types';

import { WeekPicker } from './components/WeekPicker';
import { getSundayOfWeek, randomiseWeek, mapFtype2Collection, getCurrentWeek } from './utils';

import './App.scss';
import { EmptyWeekMessage } from './components/EmptyWeekMessage';
import { replaceWithValues, reverseLookupDiet } from './dietLogicService';
import { ApiDietSchedule } from './api.types';

export const RandomFoodContext = React.createContext((ft: FoodType, m: string, dow: number, direction: 'right' | 'left') => {});

export const MenuContext = React.createContext<Menu | null>(null);

const App: React.FC = () => {
	const [isEditingWeek, setIsEditingWeek] = React.useState<boolean>(false);
	const [weekDiet, setWeekDiet] = React.useState<DietSchedule[]>([]);
	const [principales, setPrincipales] = React.useState<Dish[]>([]);
	const [sopas, setSopas] = React.useState<Dish[]>([]);
	const [sides, setSides] = React.useState<Dish[]>([]);
	const [isSaving, setIsSaving] = React.useState<boolean>(false);
	const [currentWeek, setSelectedWeek] = React.useState<Date>(getSundayOfWeek(new Date()));
	const [selectedTab, setSelectedTab] = React.useState<TabValue>('weekview');

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
		const currentIndex = collection.findIndex((t) => t.id === currentOpt);
		if (currentIndex === -1) {
			throw new Error('Unknown food');
		}
		if (direction === 'left') {
			newId = currentIndex - 1;
			if (newId < 0) {
				newId = collection.length + newId;
			}
		} else {
			newId = (currentIndex + 1) % collection.length;
		}
		(dayOfWeek as any)[meal][ftype] = collection[newId].id;
		wd[dow] = dayOfWeek;
		setWeekDiet(wd);
	};

	React.useEffect(() => {
		const currentWeek: Date = getCurrentWeek();
		Promise.all([fetchDishes('principales'), fetchDishes('sopas'), fetchDishes('sides')])
			.then(([principales, sopas, sides]) => {
				setPrincipales(principales);
				setSopas(sopas);
				setSides(sides);

				fetchWeek(currentWeek).then((apiWeekDiet: ApiDietSchedule[]) => {
					const weekData: DietSchedule[] = reverseLookupDiet(apiWeekDiet, {
						principales,
						sopas,
						sides,
					});
					setWeekDiet(weekData);
					setSelectedWeek(currentWeek);
				});
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

	const isWeekEmpty: boolean = weekDiet.length === 0;

	return (
		<main className="App">
			<h1>Meal planner</h1>
			<TabList
				selectedValue={selectedTab}
				onTabSelect={(_e: SelectTabEvent, data: SelectTabData) => {
					setSelectedTab(data.value);
				}}
			>
				<Tab id="Week view" value="weekview">
					Week view
				</Tab>
				<Tab id="Universe" value="universe">
					Universe
				</Tab>
			</TabList>
			{selectedTab === 'universe' && (
				<section role="tabpanel">
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
			)}
			{selectedTab === 'weekview' && (
				<section className="weekView" role="tabpanel">
					<div className="univsecTitle">
						<h2>Week view</h2>
						<div>
							{!isEditingWeek && !isWeekEmpty && (
								<button
									type="button"
									className="editBtn"
									onClick={() => {
										setIsEditingWeek(true);
									}}
								>
									Edit
								</button>
							)}
							{isEditingWeek && (
								<>
									<button
										type="button"
										className="editBtn"
										disabled={isSaving}
										onClick={() => {
											// TODO: do some other stuff
											setIsSaving(true);
											const finalMenu: ApiDietSchedule[] = replaceWithValues(weekDiet, {
												principales,
												sopas,
												sides,
											});
											saveWeek(currentWeek, finalMenu).then((success: boolean) => {
												if (success) {
													setIsEditingWeek(false);
												} else {
													// TODO: alert some error
												}
												setIsSaving(false);
											});
										}}
									>
										Save
									</button>
									<button
										type="button"
										className="editBtn"
										onClick={() => {
											setIsEditingWeek(false);
										}}
									>
										Cancel
									</button>
								</>
							)}
						</div>
					</div>
					{!isEditingWeek && (
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<WeekPicker
								week={currentWeek}
								setSelectedWeek={(date: Date) => {
									fetchWeek(date).then((apiWeekDiet: ApiDietSchedule[]) => {
										const weekData: DietSchedule[] = reverseLookupDiet(apiWeekDiet, {
											principales,
											sopas,
											sides,
										});
										setWeekDiet(weekData);
									});
									setSelectedWeek(date);
								}}
							/>
							<Button
								appearance="primary"
								onClick={() => {
									const randomWeekDiet: DietSchedule[] = randomiseWeek({ principales, sopas, sides });
									setWeekDiet(randomWeekDiet);
									setIsEditingWeek(true);
								}}
							>
								Randomise all
							</Button>
						</div>
					)}
					{isWeekEmpty && <EmptyWeekMessage />}
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
			)}
		</main>
	);
};

export default App;
