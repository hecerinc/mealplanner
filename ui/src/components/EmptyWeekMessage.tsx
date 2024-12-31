import * as React from 'react';

interface EmptyWeekMessageProps {}

export const EmptyWeekMessage: React.FC<EmptyWeekMessageProps> = (_props: EmptyWeekMessageProps) => {
	return (
		<div>
			<p>
				No menu was found for this week. Click <strong>Randomise all</strong> to start one!
			</p>
		</div>
	);
};
