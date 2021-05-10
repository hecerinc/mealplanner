import React from 'react';

const exampleLunch = ['Sopa de fideo', 'Milanesa de pollo', 'Frijoles', 'Verduritas'];
const exampleCena = ['Huevo con papa'];

export const WeekSchedule: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
	return (
		<div className="weekSchedule">
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Sunday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Monday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Tuesday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Wednesday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Thursday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Friday" />
			<DayOfWeek editing={isEditing} cena={exampleCena} comida={exampleLunch} day="Saturday" />
		</div>
	);
};

interface DoWProps {
	day: string;
	comida: string[];
	cena: string[];
	editing?: boolean;
}
const DayOfWeek: React.FC<DoWProps> = ({ day, comida, cena, editing = false }) => {
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
						{comida.map((c) =>
							isEditing ? (
								<li>
									<DishSelector name={c} />
								</li>
							) : (
								<li>{c}</li>
							)
						)}
					</ul>
				</div>
				<div className="cena">
					<ul>
						{cena.map((c) =>
							isEditing ? (
								<li>
									<DishSelector name={c} />
								</li>
							) : (
								<li>{c}</li>
							)
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export const DishSelector: React.FC<{ name: string }> = ({ name }) => {
	return (
		<div className="dishSelector">
			<button className="prevBtn">&larr;</button>
			<p className="titleLabel">{name}</p>
			<button className="nextBtn">&rarr;</button>
		</div>
	);
};
