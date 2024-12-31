import React from 'react';

import type { DietSchedule } from './App.types';
import { DayOfWeek } from './components/DayOfWeek';

const dow: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeekSchedule: React.FC<{ isEditing?: boolean; schedule: DietSchedule[] }> = ({ isEditing = false, schedule }) => {
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
