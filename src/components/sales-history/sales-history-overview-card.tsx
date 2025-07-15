import { Box, Paper, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

interface Props {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

const SalesHistoryOverviewCard: FC<Props> = ({ title, value, icon, color }) => {
    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor: `${color}.light`,
                "&:hover": {
                    backgroundColor: `${color}.main`,
                    "& .icon, & .text": {
                        color: "white",
                    },
                },
            }}
            elevation={-1}
        >
            <Box
                className="icon"
                sx={{
                    p: 1.3,
                    borderRadius: 2,
                    backgroundColor: `${color}.lighter`,
                    color: `${color}.main`,
                    mr: 0.8,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    className="text"
                    color={`${color}.darker`}
                    sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                >
                    {value}
                </Typography>
                <Typography
                    variant="body2"
                    className="text"
                    color={`${color}.darker`}
                >
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
};

export default SalesHistoryOverviewCard;
