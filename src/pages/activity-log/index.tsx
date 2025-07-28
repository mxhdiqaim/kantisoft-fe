import { useGetActivitiesQuery } from "@/store/slice";
import { Box, Paper, Typography, CircularProgress, Chip } from "@mui/material";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import { UserRoleEnum } from "@/types/user-types";
import { useMemo, useState } from "react";
import TableStyledBox from "@/components/ui/table-styled-box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "@/components/customs/custom-no-rows-overlay";
import { useTranslation } from "react-i18next";

const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes("create") || lowerAction.includes("login") || lowerAction.includes("viewed"))
        return "success";
    if (lowerAction.includes("update") || lowerAction.includes("password_changed")) return "warning";
    if (lowerAction.includes("delete") || lowerAction.includes("cancelled")) return "error";
    if (lowerAction.includes("failed") || lowerAction.includes("error")) return "error";
    return "default";
};

const ActivityLogPage = () => {
    const { t } = useTranslation();
    const currentUser = useAppSelector(selectCurrentUser);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { data, isLoading, isError } = useGetActivitiesQuery({ limit: rowsPerPage, offset: page * rowsPerPage });

    if (!currentUser || ![UserRoleEnum.MANAGER, UserRoleEnum.ADMIN].includes(currentUser.role)) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">You do not have permission to view activity logs.</Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !data) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Failed to load activity logs. Please try again later.</Typography>
            </Box>
        );
    }

    const columns: GridColDef[] = useMemo(
        () => [
            {
                field: "createdAt",
                headerName: "Date",
                flex: 1,
                minWidth: 200,
                headerAlign: "center",
                renderCell: (params) => {
                    const date = new Date(params.row.activityLog.createdAt);
                    return (
                        <TableStyledBox sx={{ textAlign: "center", justifyContent: "center" }}>
                            <Typography variant="body2">
                                {isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString()}
                            </Typography>
                        </TableStyledBox>
                    );
                },
            },
            {
                field: "details",
                headerName: "Details",
                flex: 1.5,
                minWidth: 450,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.row.activityLog.details}</Typography>
                    </TableStyledBox>
                ),
            },

            {
                field: "user",
                headerName: "User",
                flex: 1,
                minWidth: 180,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {params.row.user
                                ? `${params.row.user.firstName} ${params.row.user.lastName}`
                                : "System/Unknown"}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "role",
                headerName: "Role",
                flex: 1,
                minWidth: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) =>
                    params.row.user ? (
                        <Chip label={params.row.user.role} size="medium" sx={{ textTransform: "capitalize" }} />
                    ) : (
                        <Chip label="N/A" size="small" variant="outlined" />
                    ),
            },
            {
                field: "store",
                headerName: "Store",
                flex: 1,
                minWidth: 180,
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ textAlign: "center", justifyContent: "center" }}>
                        <Typography variant="body2">{params.row.store?.name || "Global"}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "entityType",
                headerName: "Entity Type",
                flex: 1,
                minWidth: 120,
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ textAlign: "center", justifyContent: "center" }}>
                        <Typography variant="body2">{t(params.row.activityLog.entityType || "N/A")}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "action",
                headerName: "Action",
                flex: 1,
                headerAlign: "center",
                minWidth: 240,
                renderCell: (params) => (
                    <TableStyledBox sx={{ textAlign: "center", justifyContent: "center" }}>
                        <Chip
                            label={params.row.activityLog.action.replace(/_/g, " ")}
                            color={getActionColor(params.row.activityLog.action)}
                            size="medium"
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        />
                    </TableStyledBox>
                ),
            },
        ],

        [],
    );

    // Flatten data for DataGrid
    const rows =
        data?.data?.map((entry) => ({
            id: entry.activityLog.id,
            ...entry,
        })) ?? [];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Activity Log
            </Typography>
            <Paper>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={isLoading}
                        rowCount={data?.totalCount || 0}
                        pagination
                        paginationMode="server"
                        paginationModel={{ page, pageSize: rowsPerPage }}
                        onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
                            setPage(newPage);
                            setRowsPerPage(newPageSize);
                        }}
                        pageSizeOptions={[10, 20, 50, 100]}
                        slots={{
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                            noRowsOverlay: {
                                period: "No activity logs found for this period.",
                            },
                        }}
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 600,
                            },
                            // Optional: Adjust row height for better density
                            "& .MuiDataGrid-row": {
                                minHeight: "48px !important",
                            },

                            minWidth: columns.reduce((acc, col) => acc + (col.minWidth || 0), 0) + 50 + "px", // Estimate minWidth for content
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default ActivityLogPage;
