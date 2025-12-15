import {useMemo} from "react";

/**
 * A custom hook to memoize an array, returning an empty array if the input is undefined.
 * @template T The type of items in the array.
 * @param {T[] | undefined} data The data array to memoize.
 * @returns {T[]} A memoized array.
 */
export const useMemoizedArray = <T>(data: T[] | undefined): T[] => {
    return useMemo(() => data ?? [], [data]);
}