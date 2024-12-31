import * as React from 'react';

import { FoodType } from '../App.types';
import type { Menu } from '../App.types';
import { MenuContext } from '../App';
import { DishSelector } from './DishSelector';

interface DoWProps {
	day: string;
	comida: number[];
	cena: number[];
	editing?: boolean;
	dow: number;
}

const ftMap = [FoodType.sopas, FoodType.principales, FoodType.sides];

export const DayOfWeek: React.FC<DoWProps> = ({ day, comida, cena, editing = false, dow }) => {
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
