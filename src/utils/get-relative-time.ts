export const relativeTime = (
    current: Date = new Date(),
    previous: Date,
): string => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = Number(current) - Number(previous);

    if (elapsed < msPerMinute) {
        const val = Math.round(elapsed / 1000);
        return val === 1 ? `${val} sec ago` : `${val} secs ago`;
    }

    if (elapsed < msPerHour) {
        const val = Math.round(elapsed / msPerMinute);
        return val === 1 ? `${val} min ago` : `${val} mins ago`;
    }

    if (elapsed < msPerDay) {
        const val = Math.round(elapsed / msPerHour);
        return val === 1
            ? `${val} hr ago`
            : val === 24
              ? `Yesterday, ${previous.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })}`
              : `${val} hrs ago`;
    }

    if (elapsed < msPerMonth) {
        const val = Math.round(elapsed / msPerDay);
        const shortMonth = previous.toLocaleString("en-US", { month: "short" });
        const day = previous.getDate();

        if (val === 1)
            return `Yesterday, ${previous.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })}`;

        return `${shortMonth} ${day}, ${previous.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
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
