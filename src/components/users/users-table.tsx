import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import { roleHierarchy, type UserType } from "@/types/user-types";

import { EditOutlined, MoreVert, VisibilityOutlined } from "@mui/icons-material";
import { Avatar, Chip, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { type MouseEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomNoRowsOverlay from "../customs/custom-no-rows-overlay";
import TableStyledBox from "../ui/table-styled-box";

export interface Props {
    users: UserType[];
    loading: boolean;
    // columns: GridColDef[];
}

const UsersTable = ({ users, loading }: Props) => {
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const internalColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                minWidth: 200,
                renderCell: (params) => {
                    const name = `${params.row.firstName} ${params.row.lastName}`;
                    const initials =
                        `${params.row.firstName?.[0] ?? ""}${params.row.lastName?.[0] ?? ""}`.toUpperCase();
                    return (
                        <TableStyledBox sx={{ display: "flex", alignItems: "center", py: 1 }}>
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
                field: "email",
                headerName: "Email",
                flex: 1,
                minWidth: 250,
            },
            {
                field: "role",
                headerName: "Role",
                width: 120,
                cellClassName: "capitalize-cell",
                align: "center",
                headerAlign: "center",
            },
            {
                field: "status",
                headerName: "Status",
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params: GridRenderCellParams<UserType>) => (
                    <Chip
                        label={params.value}
                        color={params.value === "active" ? "success" : "error"}
                        size="medium"
                        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    />
                ),
            },
            {
                field: "createdAt",
                headerName: "Date Created",
                width: 180,
                align: "center",
                headerAlign: "center",
                renderCell: (params: GridRenderCellParams<UserType, string>) => {
                    const date = new Date(params.value as string);
                    if (isNaN(date.getTime())) {
                        return "Invalid Date";
                    }
                    return (
                        <TableStyledBox sx={{ alignItems: "center", justifyContent: "center" }}>
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
                width: 150,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleView = () => {
                        navigate(`/user/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        navigate(`/user/${params.row.id}/edit`);
                        handleMenuClose();
                    };

                    const canEdit = () => {
                        if (!currentUser) return false; // Cannot edit if not logged in

                        const currentUserRoleLevel = roleHierarchy[currentUser.role];
                        const rowUserRoleLevel = roleHierarchy[(params.row as UserType).role];
                        const isSelf = currentUser.id === params.row.id;

                        // Manager can edit anyone
                        if (currentUser.role === "manager") return true;

                        // Admin can edit admins and lower, but not managers
                        if (currentUser.role === "admin") {
                            return currentUserRoleLevel <= rowUserRoleLevel;
                        }

                        // Users and Guests can only edit themselves or roles below them
                        return currentUserRoleLevel > rowUserRoleLevel || isSelf;
                    };

                    const isEditDisabled =
                        params.row.status === "deleted" || params.row.status === "inactive" || !canEdit();

                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleView} disabled={isEditDisabled}>
                                    <VisibilityOutlined sx={{ mr: 1 }} />
                                    View
                                </MenuItem>
                                <MenuItem onClick={handleEdit} disabled={isEditDisabled}>
                                    <EditOutlined sx={{ mr: 1 }} />
                                    Edit
                                </MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [anchorEl, selectedRowId, navigate, currentUser],
    );
    return (
        <DataGrid
            rows={users ?? []}
            columns={internalColumns}
            loading={loading}
            slots={{
                noRowsOverlay: CustomNoRowsOverlay,
            }}
            slotProps={{
                loadingOverlay: {
                    variant: "skeleton",
                    noRowsVariant: "skeleton",
                },
            }}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10 },
                },
            }}
            disableColumnResize
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            checkboxSelection={true}
            getRowId={(row) => row.id}
            // onRowClick={(params) => {
            //     if (params.id !== selectedRowId) {
            //         onEdit(params.row);
            //     }
            // }}
            sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                },
            }}
        />
    );
};

export default UsersTable;
