export const relativeTime = (current: Date, previous: Date): string => {
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
        const shortMonth = previous.toLocaleString("en-US", { month: "short" });
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
