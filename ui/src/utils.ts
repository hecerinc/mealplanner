export const getSundayOfWeek = (chosenDate: Date) => {
	// Create a new Date object to avoid mutating the original date
	const sunday = new Date(chosenDate);

	// Get the current day of the week (0-6)
	const dayOfWeek = sunday.getDay();

	// Calculate the difference from Sunday (0 is Sunday, 6 is Saturday)
	const diffToSunday = dayOfWeek;

	// Set the date to the Sunday of the same week
	sunday.setDate(sunday.getDate() - diffToSunday);

	return sunday;
};

const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatDate = (date: Date): string => {
	const month = date.getMonth();
	const monthSF = monthMap[month].substring(0, 3) + '.';
	const day = date.getDate();
	const year = date.getFullYear();
	return `${monthSF} ${day}, ${year}`;
};
