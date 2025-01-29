import * as React from 'react';

interface EmptyWeekMessageProps {}

export const EmptyWeekMessage: React.FC<EmptyWeekMessageProps> = (_props: EmptyWeekMessageProps) => {
	return (
		<div>
			<hr style={{ border: '0 none', borderTop: '1px solid #ccc' }} />
			<p style={{ textAlign: 'center' }}>
				No menu was found for this week. Click <strong>Randomise all</strong> to start one!
			</p>
			<hr style={{ border: '0 none', borderTop: '1px solid #ccc' }} />
		</div>
	);
};
