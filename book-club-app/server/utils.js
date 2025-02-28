// utils.js
export const getCurrentWeek = () => {

    const startDate = new Date(Date.UTC(2025, 1, 23, 0, 0, 0));
    const currentDate = new Date(); // Current date/time
    const weekDuration = 7 * 24 * 60 * 60 * 1000; // Week duration in milliseconds (7 days)

    // Calculate the difference in milliseconds
    const diffInMillis = currentDate - startDate;

    // Calculate the current week
    const currentWeek =(Math.floor(diffInMillis / weekDuration))+1;

    return currentWeek;
};