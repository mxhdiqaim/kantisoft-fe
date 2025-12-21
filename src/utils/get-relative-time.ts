import {differenceInDays, differenceInSeconds, format, formatDistanceToNow} from 'date-fns';

export const relativeTime = (previous: Date, current: Date = new Date()): string => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
    const msPerMonth = msPerDay * 30; // Approximation
    const msPerYear = msPerDay * 365; // Approximation

    const elapsed = current.getTime() - previous.getTime();

    if (elapsed < msPerMinute) {
        const seconds = Math.round(elapsed / 1000);
        return seconds <= 1 ? "just now" : `${seconds} secs ago`;
    }

    if (elapsed < msPerHour) {
        const minutes = Math.round(elapsed / msPerMinute);
        return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
    }

    if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
    }

    if (elapsed < msPerWeek) {
        const days = Math.round(elapsed / msPerDay);
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    if (elapsed < msPerMonth) {
        const weeks = Math.round(elapsed / msPerWeek);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    if (elapsed < msPerYear) {
        const shortMonth = previous.toLocaleString("en-US", {month: "short"});
        const day = previous.getDate();

        return `${shortMonth} ${day}, ${previous.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
    }

    // over a year
    return previous.toDateString().slice(3);
};

/**
 * Formats a date to a human-readable relative string or an absolute date.
 * (just now, 15 min ago, 2 hours ago, 2 days ago, 2 weeks ago or MMM d, yyyy)
 */
export const formatRelativeDateTime = (date: Date | string | number): string => {
    const dateObj = new Date(date);
    const now = new Date();

    // Handle "just now" (less than 30 seconds)
    const secondsDiff = differenceInSeconds(now, dateObj);
    if (secondsDiff < 30) {
        return 'just now';
    }

    // Handle Absolute Date (> 30 days / 1 month)
    const daysDiff = differenceInDays(now, dateObj);
    if (daysDiff >= 30) {
        return format(dateObj, 'MMM d, yyyy'); // e.g., Dec 19, 2025
    }

    // Handle Relative Time (minutes, hours, days, weeks)
    // We use formatDistanceToNow for 30s to 30 days
    return formatDistanceToNow(dateObj, {addSuffix: true})
        .replace('about ', '')
        .replace('less than a minute ago', 'just now')
        .replace(' minutes', ' mins')
        .replace(' minute', ' min')
        .replace(' hours', ' hrs')
        .replace(' hour', ' hr');
};

/**
 * Custom date formatter for specific display variants.
 * @param date - Date object, string, or number
 * @param variant - 'short' (21 Dec, 2025) or 'long' (21 December 2025)
 */
export const formatDateCustom = (
    date: Date | string | number,
    variant: 'short' | 'long' = 'short'
): string => {
    const dateObj = new Date(date);

    // d = Day (21)
    // MMM = Short Month (Dec) | MMMM = Long Month (December)
    // yyyy = Year (2025)
    const pattern = variant === 'short' ? 'd MMM, yyyy' : 'd MMMM, yyyy';

    return format(dateObj, pattern);
};