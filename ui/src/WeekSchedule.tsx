import React from 'react';

import { FoodType } from './App.types';
import { RandomFoodContext } from './App';

export interface DietSchedule {
	comida: {
		principal: string;
		side: string;
		soup: string;
	};
	cena: {
		principal: string;
	};
}

const dow: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeekSchedule: React.FC<{ isEditing?: boolean; schedule: DietSchedule[] }> = ({ isEditing = false, schedule }) => {
	console.log(schedule);
	return (
		<div className="weekSchedule">
			{schedule.map((day: DietSchedule, i: number) => {
				return (
					<DayOfWeek
						key={dow[i]}
						editing={isEditing}
						cena={[day.cena.principal]}
						comida={[day.comida.soup, day.comida.principal, day.comida.side]}
						dow={i}
						day={dow[i]}
					/>
				);
			})}
		</div>
	);
};

interface DoWProps {
	day: string;
	comida: string[];
	cena: string[];
	editing?: boolean;
	dow: number;
}

const ftMap = [FoodType.soup, FoodType.principal, FoodType.side];

const DayOfWeek: React.FC<DoWProps> = ({ day, comida, cena, editing = false, dow }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(editing);

	React.useEffect(() => {
		setIsEditing(editing);
	}, [editing]);

	return (
		<div className="dayOfWeek">
			<h4 className="dayLabel">{day}</h4>
			<div className="dayBoxContainer">
				<div className="comida">
					<ul>
						{comida.map((c, i) =>
							isEditing ? (
								<li key={`comida-${i}`}>
									<DishSelector name={c} type={ftMap[i]} meal="comida" dow={dow} />
								</li>
							) : (
								<li key={`comida-${i}`}>{c}</li>
							)
						)}
					</ul>
				</div>
				<div className="cena">
					<ul>
						{cena.map((c, i) =>
							isEditing ? (
								<li key={`cena-${i}`}>
									<DishSelector name={c} type={FoodType.principal} meal="cena" dow={dow} />
								</li>
							) : (
								<li key={`cena-${i}`}>{c}</li>
							)
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export const DishSelector: React.FC<{ name: string; type: FoodType; meal: string; dow: number }> = ({ name, type, meal, dow }) => {
	const updateFood = React.useContext(RandomFoodContext);
	return (
		<div className="dishSelector">
			<button
				type="button"
				className="prevBtn"
				onClick={() => {
					updateFood(type, meal, dow);
				}}
			>
				&larr;
			</button>
			<p className="titleLabel">{name}</p>
			<button type="button" className="nextBtn">
				&rarr;
			</button>
		</div>
	);
};
