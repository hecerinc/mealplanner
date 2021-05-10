import React from 'react';

export const UniverseList: React.FC<{ title: string; items: any[] }> = ({ title, items }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	return (
		<div className="mainDishes">
			<div className="univsecTitle">
				<h3>{title}</h3>
				<button
					className="editBtn"
					type="button"
					onClick={() => {
						setIsEditing(!isEditing);
					}}
				>
					Edit
				</button>
			</div>
			{isEditing ? (
				<>
					<textarea />
					<div className="actionBtns">
						<button
							type="button"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							Cancel
						</button>
						<button type="button">Save</button>
					</div>
				</>
			) : (
				<ul>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
					<li>Some ratters</li>
				</ul>
			)}
		</div>
	);
};
