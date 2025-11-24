import type {ChangeEvent} from "react";
import {Box, Pagination} from "@mui/material";
import {gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from "@mui/x-data-grid";

const TablePagination = () => {
    const apiRef = useGridApiContext();

    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
        apiRef.current.setPage(page - 1);
    };

    return (
        <Box sx={{display: "flex", justifyContent: {xs: "center", md: "flex-end"}, px: 2}}>
            <Pagination
                sx={(theme) => ({padding: theme.spacing(1.5, 0)})}
                color="primary"
                count={pageCount}
                page={page + 1} // MUI Pagination is 1-based, while DataGrid is 0-based
                onChange={handlePageChange}
            />
        </Box>
    );
};

export default TablePagination;