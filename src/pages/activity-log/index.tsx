import {useGetActivitiesQuery} from "@/store/slice";
import {Box, Chip, Typography} from "@mui/material";
import {useAppSelector} from "@/store";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {UserRoleEnum} from "@/types/user-types";
import {useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/table-styled-box";
import {type GridColDef} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import ActivityLogSkeleton from "@/components/activity-log/loading";
import ApiErrorDisplay from "@/components/feedback/api-error-display";
import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import DataGridTable from "@/components/ui/data-grid-table";
import {getActionColor} from "@/utils";

const ActivityLogPage = () => {
    const {t} = useTranslation();
    const notify = useNotifier();
    const currentUser = useAppSelector(selectCurrentUser);

    // Pagination state
    const [page] = useState(0);
    const [rowsPerPage] = useState(20);

    const {data, isLoading, isError, error} = useGetActivitiesQuery({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
    });

    if (!currentUser || ![UserRoleEnum.MANAGER, UserRoleEnum.ADMIN].includes(currentUser.role)) {
        return (
            <Box sx={{p: 4}}>
                <Typography color="error">You do not have permission to view activity logs.</Typography>
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
                headerAlign: "left",
                renderCell: (params) => {
                    const date = new Date(params.row.activityLog.createdAt);
                    return (
                        <TableStyledBox>
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
                headerAlign: "left",
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
                headerAlign: "left",
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
                headerAlign: "left",
                renderCell: (params) => {
                    const role = params.row.user.role;

                    return (
                        <TableStyledBox>
                            <Chip
                                label={role ?? "N/A"}
                                size="medium"
                                sx={{textTransform: "capitalize", textAlign: "left"}}
                            />
                        </TableStyledBox>
                    )
                }
            },
            {
                field: "store",
                headerName: "Store",
                flex: 1,
                minWidth: 150,
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.row.store?.name || "Global"}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "entityType",
                headerName: "Entity Type",
                flex: 1,
                minWidth: 150,
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{t(params.row.activityLog.entityType || "N/A")}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "action",
                headerName: "Action",
                flex: 1,
                headerAlign: "left",
                minWidth: 240,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Chip
                            label={params.row.activityLog.action.replace(/_/g, " ")}
                            color={getActionColor(params.row.activityLog.action)}
                            size="medium"
                            sx={{fontWeight: 600, textTransform: "capitalize"}}
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

    if (isLoading) {
        return <ActivityLogSkeleton rows={10} columns={columns.length}/>;
    }

    if (isError && !data) {
        const apiError = getApiError(error, "Failed to load users. Please try again later.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h4" gutterBottom>
                Activity Log
            </Typography>
            <Box sx={{width: "100%", overflowX: "auto"}}>
                <DataGridTable
                    data={rows}
                    columns={columns}
                    loading={isLoading}
                />
            </Box>
        </Box>
    );
};

export default ActivityLogPage;
