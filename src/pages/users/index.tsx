import ApiErrorDisplay from "@/components/feedback/api-error-display";
import UsersPageLoading from "@/components/users/loading";

import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useAppSelector} from "@/store";
import {useChangeUserStoreMutation, useGetAllStoresQuery, useGetAllUsersQuery} from "@/store/slice";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {roleHierarchy, UserRoleEnum, UserStatusEnum, type UserType} from "@/types/user-types.ts";

import {getExportFormattedData} from "@/utils/table-export-utils";
import {
    AddOutlined,
    EditOutlined,
    FileDownloadOutlined,
    MoreVert,
    StorefrontOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import {Avatar, Box, Button, Chip, Grid, IconButton, Menu, MenuItem, Tooltip, Typography,} from "@mui/material";
import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {saveAs} from "file-saver";
import {type MouseEvent, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as XLSX from "xlsx";
import TableStyledBox from "@/components/ui/table-styled-box.tsx";
import DataGridTable from "@/components/ui/data-grid-table";
import CustomCard from "@/components/customs/custom-card.tsx";
import ChangeStoreDialog from "@/components/users/change-store-modal.tsx";

const UsersPage = () => {
    const notify = useNotifier();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);
    const {data: usersData, isLoading, isError, error} = useGetAllUsersQuery();
    const {data: storesData} = useGetAllStoresQuery();
    const [changeUserStore, {isLoading: isChangingStore}] = useChangeUserStoreMutation();


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const isExportMenuOpen = Boolean(exportAnchorEl);

    const [isChangeStoreDialogOpen, setChangeStoreDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);


    const handleOpenChangeStoreDialog = (user: UserType) => {
        setSelectedUser(user);
        setChangeStoreDialogOpen(true);
        handleMenuClose();
    };

    const handleCloseChangeStoreDialog = () => {
        setSelectedUser(null);
        setChangeStoreDialogOpen(false);
    };

    const handleChangeStore = async (userId: string, newStoreId: string) => {
        try {
            await changeUserStore({id: userId, newStoreId}).unwrap();
            notify("User store changed successfully", "success");
            handleCloseChangeStoreDialog();
        } catch (err) {
            const apiError = getApiError(err, "Failed to change user store.");
            notify(apiError.message, "error");
        }
    };

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
            {field: "name", headerName: "Name"},
            {field: "email", headerName: "Email"},
            {field: "role", headerName: "Role"},
            {field: "status", headerName: "Status"},
            {field: "createdAt", headerName: "Date Created"},
        ];

        const dataToExport = getExportFormattedData(usersData ?? [], exportColumns, usersFieldFormatters); // Pass users (can be null) and new exportColumns

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

        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        saveAs(blob, `users_data.csv`);
        setExportAnchorEl(null);
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        const exportColumns: GridColDef[] = [
            {field: "name", headerName: "Name"},
            {field: "email", headerName: "Email"},
            {field: "role", headerName: "Role"},
            {field: "status", headerName: "Status"},
            {field: "createdAt", headerName: "Date Created"},
        ];

        const dataToExport = getExportFormattedData(usersData ?? [], exportColumns, usersFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            setExportAnchorEl(null);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");

        // Use exportColumns for calculating widths
        worksheet["!cols"] = exportColumns
            .filter((col) => col.headerName) // Ensure headerName exists for width calculation
            .map((col) => ({wch: (col.headerName?.toString().length || 15) + 5}));

        XLSX.writeFile(workbook, `users_data.xlsx`);
        setExportAnchorEl(null);
    };

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "name",
                headerName: "Name",
                width: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => {
                    const name = `${params.row.firstName} ${params.row.lastName}`;
                    const initials =
                        `${params.row.firstName?.[0] ?? ""}${params.row.lastName?.[0] ?? ""}`.toUpperCase();
                    return (
                        <TableStyledBox>
                            <Avatar
                                sx={{
                                    bgcolor: "primary.light",
                                    color: "primary.dark",
                                    width: 36,
                                    height: 36,
                                    mr: 1.5,
                                    fontSize: "0.875rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {initials}
                            </Avatar>
                            <Typography variant="body2" fontWeight="500">
                                {name}
                            </Typography>
                        </TableStyledBox>
                    );
                },
            },
            {
                flex: 1,
                field: "email",
                headerName: "Email",
                width: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "role",
                headerName: "Role",
                width: 120,
                cellClassName: "capitalize-cell",
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                width: 120,
                align: "left",
                headerAlign: "left",
                renderCell: (params: GridRenderCellParams<UserType>) => (
                    <TableStyledBox>
                        <Chip
                            label={params.value}
                            color={params.value === "active" ? "success" : "error"}
                            size="medium"
                            sx={{textTransform: "capitalize", fontWeight: "bold"}}
                        />
                    </TableStyledBox>
                ),
            },
            {
                field: "createdAt",
                headerName: "Date Created",
                width: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params: GridRenderCellParams<UserType, string>) => {
                    const date = new Date(params.value as string);
                    if (isNaN(date.getTime())) {
                        return "Invalid Date";
                    }
                    return (
                        <TableStyledBox>
                            <Typography variant="body2" fontWeight="500">
                                {date.toLocaleDateString()}
                            </Typography>
                        </TableStyledBox>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 100,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleView = () => {
                        navigate(`/users/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        navigate(`/users/${params.row.id}/edit`);
                        handleMenuClose();
                    };

                    const canEdit = () => {
                        if (!currentUser) return false; // Cannot edit if not logged in

                        const currentUserRoleLevel = roleHierarchy[currentUser.role];
                        const rowUserRoleLevel = roleHierarchy[(params.row as UserType).role];
                        const isSelf = currentUser.id === params.row.id;

                        // Manager can edit anyone
                        if (currentUser.role === UserRoleEnum.MANAGER) return true;

                        // Admin can edit admins and lower, but not managers
                        if (currentUser.role === UserRoleEnum.ADMIN) {
                            return currentUserRoleLevel <= rowUserRoleLevel;
                        }

                        // Users and Guests can only edit themselves or roles below them
                        return currentUserRoleLevel > rowUserRoleLevel || isSelf;
                    };

                    const isEditDisabled =
                        params.row.status === UserStatusEnum.DELETED || params.row.status === UserStatusEnum.INACTIVE || !canEdit();

                    const canChangeStore =
                        currentUser?.role === UserRoleEnum.MANAGER &&
                        params.row.id !== currentUser.id &&
                        [UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST].includes(params.row.role);


                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert/>
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleView} disabled={isEditDisabled}>
                                    <VisibilityOutlined sx={{mr: 1}}/>
                                    View
                                </MenuItem>
                                <MenuItem onClick={handleEdit} disabled={isEditDisabled}>
                                    <EditOutlined sx={{mr: 1}}/>
                                    Edit
                                </MenuItem>
                                {currentUser?.role === UserRoleEnum.MANAGER && (
                                    <MenuItem onClick={() => handleOpenChangeStoreDialog(params.row)}
                                              disabled={!canChangeStore}>
                                        <StorefrontOutlined sx={{mr: 1}}/>
                                        Change Store
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [anchorEl, selectedRowId, navigate, currentUser],
    );

    if (isLoading) {
        return <UsersPageLoading/>;
    }

    if (isError) {
        const apiError = getApiError(error, "Failed to load users. Please try again later.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4">User Management</Typography>
                {currentUser && (currentUser.role === UserRoleEnum.MANAGER || currentUser.role === UserRoleEnum.ADMIN) && (
                    <Button variant="contained" startIcon={<AddOutlined/>} onClick={() => navigate("/users/new")}>
                        New User
                    </Button>
                )}
            </Box>
            <CustomCard
                sx={{
                    borderRadius: 2,
                    mb: 2,
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                    {/* Export Button and Menu */}
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<FileDownloadOutlined/>}
                        sx={{height: 45, minWidth: 200}}
                        onClick={(event) => setExportAnchorEl(event.currentTarget)}
                    >
                        Export
                    </Button>
                    <Menu anchorEl={exportAnchorEl} open={isExportMenuOpen} onClose={() => setExportAnchorEl(null)}>
                        <MenuItem onClick={handleExportCsv}>Export as CSV</MenuItem>
                        <MenuItem onClick={handleExportXlsx}>Export as XLSX</MenuItem>
                    </Menu>
                </Box>
            </CustomCard>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={usersData ?? []} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>
            <ChangeStoreDialog
                open={isChangeStoreDialogOpen}
                onClose={handleCloseChangeStoreDialog}
                user={selectedUser}
                stores={storesData ?? []}
                onConfirm={handleChangeStore}
                isLoading={isChangingStore}
            />
        </Box>
    );
};

export default UsersPage;
