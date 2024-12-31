import * as React from 'react';
import { RandomFoodContext } from '../App';
import type { FoodType } from '../App.types';

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
