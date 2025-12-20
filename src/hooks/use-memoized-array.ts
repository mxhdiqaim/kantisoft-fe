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

/**
 * A custom hook to memoize an object, returning an empty object if the input is null or undefined.
 * @template T The type of the object.
 * @param {T | null | undefined} data The data object to memoize.
 * @returns {T | {}} A memoized object.
 */
export const useMemoizedObject = <T extends object>(data: T | null | undefined): T | object => {
    return useMemo(() => data ?? {}, [data]);
};