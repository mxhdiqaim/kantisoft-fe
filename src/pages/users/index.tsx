import ApiErrorDisplay from "@/components/feedback/api-error-display";
import UsersPageLoading from "@/components/users/loading";
import UsersTable from "@/components/users/users-table";
import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import { useAppSelector } from "@/store";
import { useGetAllUsersQuery } from "@/store/slice";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import type { UserType } from "@/types/user-types.ts";

import { getExportFormattedData } from "@/utils/table-export-utils";
import { AddOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const UsersPage = () => {
    const notify = useNotifier();
    const theme = useTheme();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);
    const { data: users, isLoading, isError, error } = useGetAllUsersQuery();

    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const isExportMenuOpen = Boolean(exportAnchorEl);

    // Define custom formatters for UsersTable
    const usersFieldFormatters = useMemo(
        () => ({
            name: (row: UserType) => `${row.firstName} ${row.lastName}`,
            email: (row: UserType) => row.email,
            phone: (row: UserType) => row.phone || "", // Ensure the phone is not null/undefined for export
            role: (row: UserType) => row.role,
            status: (row: UserType) => row.status,
            createdAt: (row: UserType) => new Date(row.createdAt).toLocaleString(),
        }),
        [],
    );

    // Export to CSV function
    const handleExportCsv = () => {
        // Create a simplified columns array just for export, to match `getExportFormattedData`'s needs
        // and avoid passing complex renderCell logic from UsersTable.
        const exportColumns: GridColDef[] = [
            { field: "name", headerName: "Name" },
            { field: "email", headerName: "Email" },
            { field: "role", headerName: "Role" },
            { field: "status", headerName: "Status" },
            { field: "createdAt", headerName: "Date Created" },
        ];

        const dataToExport = getExportFormattedData(users ?? [], exportColumns, usersFieldFormatters); // Pass users (can be null) and new exportColumns

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            setExportAnchorEl(null);
            return;
        }

        const header = Object.keys(dataToExport[0]);
        const csvContent = [
            header.join(","),
            ...dataToExport.map((row) =>
                header.map((key) => `"${String(row[key] || "").replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `users_data.csv`);
        setExportAnchorEl(null);
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        const exportColumns: GridColDef[] = [
            { field: "name", headerName: "Name" },
            { field: "email", headerName: "Email" },
            { field: "role", headerName: "Role" },
            { field: "status", headerName: "Status" },
            { field: "createdAt", headerName: "Date Created" },
        ];

        const dataToExport = getExportFormattedData(users ?? [], exportColumns, usersFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            setExportAnchorEl(null);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");

        // Use exportColumns for calculating widths
        const colWidths = exportColumns
            .filter((col) => col.headerName) // Ensure headerName exists for width calculation
            .map((col) => ({ wch: (col.headerName?.toString().length || 15) + 5 }));

        worksheet["!cols"] = colWidths;

        XLSX.writeFile(workbook, `users_data.xlsx`);
        setExportAnchorEl(null);
    };

    if (isLoading) {
        return <UsersPageLoading />;
    }

    if (isError) {
        const apiError = getApiError(error, "Failed to load users. Please try again later.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message} />;
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                {currentUser && (currentUser.role === "manager" || currentUser.role === "admin") && (
                    <Button variant="contained" startIcon={<AddOutlined />} onClick={() => navigate("/user/new")}>
                        New User
                    </Button>
                )}
            </Box>
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: "70vh",
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    {/* Export Button and Menu */}
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<FileDownloadOutlined />}
                        sx={{ height: 45, minWidth: 200 }}
                        onClick={(event) => setExportAnchorEl(event.currentTarget)}
                    >
                        Export
                    </Button>
                    <Menu anchorEl={exportAnchorEl} open={isExportMenuOpen} onClose={() => setExportAnchorEl(null)}>
                        <MenuItem onClick={handleExportCsv}>Export as CSV</MenuItem>
                        <MenuItem onClick={handleExportXlsx}>Export as XLSX</MenuItem>
                    </Menu>
                </Box>
                <UsersTable users={users ?? []} loading={isLoading} />
            </Paper>
        </Box>
    );
};

export default UsersPage;
