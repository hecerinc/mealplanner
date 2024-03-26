import React from 'react';

import { Dish } from './App.types';

interface UniverseListProps {
	title: string;
	items: Dish[];
	saveCollection: (items: Dish[]) => Promise<boolean>;
}
const parseEditItems = (val: string): Dish[] => {
	return val.split('\n').map((v: string, id: number) => ({
		id: id + 1,
		name: v,
	}));
};
export const UniverseList: React.FC<UniverseListProps> = ({ title, items, saveCollection }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	const [editItems, setEditItems] = React.useState<string>(items.map((i) => i.name).join('\n'));

	React.useEffect(() => {
		setEditItems(items.map((i) => i.name).join('\n'));
	}, [items]);

	return (
		<div className="mainDishes">
			<div className="univsecTitle">
				<h3>{title}</h3>
				{!isEditing && (
					<button
						className="editBtn"
						type="button"
						onClick={() => {
							setIsEditing(!isEditing);
						}}
					>
						Edit
					</button>
				)}
			</div>
			{isEditing ? (
				<>
					<textarea
						value={editItems}
						onChange={(e) => {
							setEditItems(e.target.value);
						}}
					/>
					<div className="actionBtns">
						<button
							type="button"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={async () => {
								const result = await saveCollection(parseEditItems(editItems));
								if (result) {
									setIsEditing(false);
								}
							}}
						>
							Save
						</button>
					</div>
				</>
			) : (
				<ul>
					{items.map((i) => (
						<li key={i.name}>{i.name}</li>
					))}
				</ul>
			)}
		</div>
	);
};
