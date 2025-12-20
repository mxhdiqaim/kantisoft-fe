import TablePagination from "./table-pagination";
import {DataGrid, type DataGridProps, type GridColDef, type GridValidRowModel} from "@mui/x-data-grid";
import {useTheme} from "@mui/material";

interface Props<T extends GridValidRowModel> extends DataGridProps<T> {
    columns: GridColDef<T>[];
    data: T[];
    loading?: boolean;
}

const DataGridTable = <T extends GridValidRowModel>({columns, data, loading, ...restProps}: Props<T>) => {
    const theme = useTheme();

    return (
        <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            disableColumnResize
            disableColumnSorting
            disableColumnMenu
            getRowHeight={() => "auto"}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{
                footer: TablePagination,
            }}
            sx={{
                border: `1px solid ${theme.palette.customColors.border}`,
                borderRadius: theme.borderRadius.small,
                backgroundColor: theme.palette.background.default,
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.primary.main,
                    borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                },
                "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                },
                "& .MuiDataGrid-cell": {
                    alignItems: "flex-start",
                    // py: 2,
                },
                "& .MuaDataGrid-row": {
                    borderBottom: "none",
                },
                "& .MuiDataGrid-row.Mui-selected": {
                    backgroundColor: theme.palette.action.selected,
                },
                "& .MuiDataGrid-row.Mui-selected:hover": {
                    backgroundColor: theme.palette.action.selected,
                },
                "& .MuiDataGrid-virtualScroller": {
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        height: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.palette.grey[300],
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: theme.palette.background.default,
                    },
                },
            }}
            {...restProps}
        />
    );
};

export default DataGridTable;