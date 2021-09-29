import React from 'react';

import { WeekSchedule } from './WeekSchedule';
import { UniverseList } from './UniverseList';
import { fetchDishes, saveDishes } from './api';
import { Dish } from './App.types';

import './App.scss';

const App: React.FC = () => {
	const [isEditingWeek, setIsEditingWeek] = React.useState<boolean>(false);

	const [principales, setPrincipales] = React.useState<Dish[]>([]);
	const [sopas, setSopas] = React.useState<Dish[]>([]);
	const [sides, setSides] = React.useState<Dish[]>([]);

	React.useEffect(() => {
		Promise.all([fetchDishes('principales'), fetchDishes('sopas'), fetchDishes('sides')]).then(([principales, sopas, sides]) => {
			setPrincipales(principales);
			setSopas(sopas);
			setSides(sides);
		});
	}, []);

	const saveCollection = async (collection: string, items: Dish[]) => {
		// try {
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
		// } catch (err) {
		// 	console.error('Failed to save dishes in collection ' + collection);
		// }
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
						items={principales}
						saveCollection={saveCollection.bind(null, 'principales')}
					/>
					<UniverseList title="Sides" items={sides} saveCollection={saveCollection.bind(null, 'sides')} />
					<UniverseList title="Sopas / Caldos" items={sopas} saveCollection={saveCollection.bind(null, 'sopas')} />
				</div>
			</section>
			<section className="weekView">
				<div className="univsecTitle">
					<h2>Week view</h2>
					<button
						type="button"
						className="editBtn"
						onClick={() => {
							setIsEditingWeek(!isEditingWeek);
						}}
					>
						{isEditingWeek ? 'Save' : 'Edit'}
					</button>
				</div>
				<h3 className="weekLabel">Sun. May 19 - Sat. May 15 2021</h3>
				{isEditingWeek && <button type="button">Randomise all</button>}
				<WeekSchedule isEditing={isEditingWeek} />
			</section>
		</main>
	);
};

export default App;
