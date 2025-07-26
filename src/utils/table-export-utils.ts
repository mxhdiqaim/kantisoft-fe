import type { GridColDef } from "@mui/x-data-grid";

// Helper function to prepare data for export
// It takes generic data, grid columns, and an optional object of custom formatters
// for specific fields.
// eslint-disable-next-line
export function getExportFormattedData<T extends Record<string, any>>( // T extends Record<string, any> to allow indexing with string
    data: T[],
    columns: GridColDef[],
    // eslint-disable-next-line
    fieldFormatters?: { [key: string]: (row: T) => any }, // Map field names to formatter functions
    // eslint-disable-next-line
): { [key: string]: any }[] {
    return data.map((row) => {
        // eslint-disable-next-line
        const formattedRow: { [key: string]: any } = {};

        columns
            .filter((col) => col.field !== "actions" && col.headerName) // Exclude 'actions' and columns without headerName
            .forEach((col) => {
                const headerName = col.headerName as string; // Use headerName as the key for the exported object

                // If a custom formatter is provided for this field, use it
                if (fieldFormatters && fieldFormatters[col.field]) {
                    formattedRow[headerName] = fieldFormatters[col.field](row);
                } else {
                    // Otherwise, use the raw value from the row based on the field name
                    // Handle potential nested fields or missing fields gracefully
                    let value: string = row[col.field as keyof T];
                    if (typeof value === "object" && value !== null) {
                        // Attempt to stringify objects if they are not explicitly handled
                        try {
                            value = JSON.stringify(value);
                            // eslint-disable-next-line
                        } catch (e) {
                            value = String(value); // Fallback to string conversion
                        }
                    }
                    formattedRow[headerName] = value;
                }
            });
        return formattedRow;
    });
}
