import React from 'react';

import { FoodType } from './App.types';
import { RandomFoodContext, MenuContext, Menu } from './App';

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
						cena={[day.cena.principales]}
						comida={[day.comida.sopas, day.comida.principales, day.comida.sides]}
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
	comida: number[];
	cena: number[];
	editing?: boolean;
	dow: number;
}

const ftMap = [FoodType.sopas, FoodType.principales, FoodType.sides];

const DayOfWeek: React.FC<DoWProps> = ({ day, comida, cena, editing = false, dow }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(editing);

	const menuOptions: Menu | null = React.useContext(MenuContext);

	React.useEffect(() => {
		setIsEditing(editing);
	}, [editing]);

	if (menuOptions === null) {
		return null;
	}
	return (
		<div className="dayOfWeek">
			<h4 className="dayLabel">{day}</h4>
			<div className="dayBoxContainer">
				<div className="comida">
					<ul>
						{comida.map((id, i) => {
							const dishName: string = menuOptions[ftMap[i]][id].name;
							return isEditing ? (
								<li key={`comida-${i}`}>
									<DishSelector name={dishName} ftype={ftMap[i]} meal="comida" dow={dow} />
								</li>
							) : (
								<li key={`comida-${i}`}>{dishName}</li>
							);
						})}
					</ul>
				</div>
				<div className="cena">
					<ul>
						{cena.map((id, i) => {
							const dishName: string = menuOptions[FoodType.principales][id].name;
							return isEditing ? (
								<li key={`cena-${i}`}>
									<DishSelector name={dishName} ftype={FoodType.principales} meal="cena" dow={dow} />
								</li>
							) : (
								<li key={`cena-${i}`}>{dishName}</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export const DishSelector: React.FC<{ name: string; ftype: FoodType; meal: string; dow: number }> = ({ name, ftype, meal, dow }) => {
	const updateFood = React.useContext(RandomFoodContext);

	return (
		<div className="dishSelector">
			<button
				type="button"
				className="prevBtn"
				onClick={() => {
					updateFood(ftype, meal, dow, 'left');
				}}
			>
				&larr;
			</button>
			<p className="titleLabel">{name}</p>
			<button
				type="button"
				className="nextBtn"
				onClick={() => {
					updateFood(ftype, meal, dow, 'right');
				}}
			>
				&rarr;
			</button>
		</div>
	);
};
