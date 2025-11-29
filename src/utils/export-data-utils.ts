/* eslint-disable @typescript-eslint/no-explicit-any */
import {saveAs} from "file-saver";
import * as XLSX from "xlsx";

// Define a generic row data
type GenericRowData = Record<string, any>;

// Define the type for the column definition array
interface ColumnDefinition {
    field: string;
    headerName?: string;
    // NOTE: potentially other column properties
}

// Define the type for the custom field formatters
type FieldFormatters<T extends GenericRowData> = {
    [K in keyof T]?: (row: T) => any;
};


/**
 * @description Transforms raw data rows into a flat array of objects using
 * specified columns and custom formatters, ready for export.
 * @param {T[]} data - The raw data array (e.g. filteredData).
 * @param {ColumnDefinition[]} columns - The array of column definitions.
 * @param {FieldFormatters<T>} formatters - Custom functions to format specific fields.
 * @returns {GenericRowData[]} Array of objects with export-ready keys/values.
 */
export function getExportFormattedData<T extends GenericRowData>(
    data: T[],
    columns: ColumnDefinition[],
    formatters: FieldFormatters<T>,
): GenericRowData[] {
    // Determine which fields to export (typically excluding 'actions' or unneeded fields)
    const exportableFields = columns
        .filter(col => col.field !== 'actions' && col.field !== 'id')
        .map(col => col.field);

    if (data.length === 0) {
        return [];
    }

    return data.map(row => {
        const formattedRow: GenericRowData = {};

        exportableFields.forEach(field => {
            //  Get the corresponding column header name for the final object key
            const column = columns.find(col => col.field === field);
            const key = column?.headerName || field; // Use headerName if available, otherwise use field

            // Apply a custom formatter if one exists
            if (formatters[field as keyof T]) {
                formattedRow[key] = formatters[field as keyof T]!(row);
            } else {
                // Use raw data value
                formattedRow[key] = row[field];
            }
        });

        return formattedRow;
    });
}

// Helper function to handle CSV export
export const exportToCsv = (dataToExport: GenericRowData[], filename: string) => {
    if (dataToExport.length === 0) return;

    const header = Object.keys(dataToExport[0]);
    const csvContent = [
        header.join(","),
        ...dataToExport.map((row) =>
            // Escape double quotes and wrap values in quotes for robust CSV
            header.map((key) => `"${String(row[key] || "").replace(/"/g, '""')}"`).join(","),
        ),
    ].join("\n");

    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    saveAs(blob, filename);
}


// Helper function to handle XLSX export
export const exportToXlsx = (
    dataToExport: GenericRowData[],
    filename: string,
    sheetName: string,
    columns: ColumnDefinition[] // Need columns for calculating width
) => {
    if (dataToExport.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Calculate column widths based on header name length (optional but nice)
    worksheet["!cols"] = columns
        .filter((col) => col.field !== "actions" && col.headerName)
        .map((col) => ({wch: (col.headerName?.toString().length || 15) + 5}));

    XLSX.writeFile(workbook, filename);
}