/**
 * Returns the number of seconds in X days
 */
const daysToSeconds = days => days * 24 * 60 * 60;

/**
 * Returns the number of seconds in X hours
 */
const hoursToSeconds = hours => hours * 60 * 60;

global.daysToSeconds = daysToSeconds;
global.hoursToSeconds = hoursToSeconds;
