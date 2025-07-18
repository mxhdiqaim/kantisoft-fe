/**
 * A structured representation of an API error.
 */
export interface ApiError {
    message: string;
    type?: number | string;
}

/**
 * Parses a caught error from an RTK Query mutation/query and returns a structured error object.
 *
 * @param error The error object from a try-catch block.
 * @param defaultMessage A fallback message if the error format is unexpected.
 * @returns An `ApiError` object with the message and type from the backend.
 */
export const getApiError = (
    error: unknown,
    defaultMessage = "An unexpected error occurred.",
): ApiError => {
    if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object"
    ) {
        const errorData = error.data as Record<string, unknown>;
        const message =
            "message" in errorData && typeof errorData.message === "string"
                ? errorData.message
                : defaultMessage;

        const type =
            "type" in errorData
                ? (errorData.type as number | string)
                : undefined;

        return { message, type };
    }

    return { message: defaultMessage };
};
