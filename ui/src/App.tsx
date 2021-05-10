import React from 'react';

import { WeekSchedule } from './WeekSchedule';
import { UniverseList } from './UniverseList';

import './App.scss';

const App: React.FC = () => {
	const [isEditingWeek, setIsEditingWeek] = React.useState<boolean>(false);
	return (
		<main className="App">
			<h1>Meal planner</h1>
			<section>
				<h2>Universe</h2>
				<div className="universeSections">
					<UniverseList title="Platos principales" items={[]} />
					<UniverseList title="Sides" items={[]} />
					<UniverseList title="Sopas / Caldos" items={[]} />
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
