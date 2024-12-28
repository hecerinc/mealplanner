import * as React from 'react';

import { Field, makeStyles, SlotRenderFunction } from '@fluentui/react-components';
import { DateRangeType } from '@fluentui/react-calendar-compat';
import { useOnClickOutside } from '@fluentui/react-utilities';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { usePopupPositioning } from './usePopupPostioning';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';
import { formatDate, getSundayOfWeek } from '../utils';

interface WeekPickerProps {
	/*
	 *  We will define the "week selected" to be whatever week of the date passed to this DatePicker
	 */
	week: Date | null;
	/*
	 * Handler for updating parent state of controlled component
	 */
	setSelectedWeek: (week: Date) => void;
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		rowGap: '20px',
	},
	control: {
		maxWidth: '300px',
	},
});

const getWeekStr = (week: Date): string => {
	const eow = new Date(week);
	eow.setDate(week.getDate() + 6);
	const sowStr = formatDate(week);
	const eowStr = formatDate(eow);
	return `${sowStr} — ${eowStr}`;
};

export const WeekPicker: React.FC<WeekPickerProps> = ({ week, setSelectedWeek }) => {
	const styles = useStyles();
	const [isDatePickerOpen, setIsDatePickerOpen] = React.useState<boolean>(false);
	const [triggerWrapperRef, popupRef] = usePopupPositioning({});

	const dateStr: string = week !== null ? getWeekStr(week) : '';

	const renderPickerInput: SlotRenderFunction<any> = (_Component, _props) => {
		return (
			<div ref={triggerWrapperRef as React.LegacyRef<HTMLDivElement>}>
				<button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} type="button">
					{dateStr}
				</button>
			</div>
		);
	};
	const { targetDocument } = useFluent();
	useOnClickOutside({
		element: targetDocument,
		callback: (_ev) => {
			setIsDatePickerOpen(false);
		},
		refs: [triggerWrapperRef, popupRef],
		disabled: !isDatePickerOpen,
	});

	const onDateSelectedHandler = (date: Date | null | undefined) => {
		if (date === null || date === undefined) {
			return;
		}
		const realDate = getSundayOfWeek(date);
		setSelectedWeek(realDate);
	};

	return (
		<div className={styles.container}>
			<Field label="Select a date">
				<DatePicker
					calendar={{
						dateRangeType: DateRangeType.Week,
					}}
					placeholder="Select a date..."
					className={styles.control}
					onSelectDate={onDateSelectedHandler}
					open={isDatePickerOpen}
					value={week}
					popupSurface={{ ref: popupRef }}
					root={{ children: renderPickerInput, ref: triggerWrapperRef }}
				/>
			</Field>
		</div>
	);
};
