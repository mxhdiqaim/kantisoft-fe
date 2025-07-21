import { Box, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import type { FC, ReactNode } from "react";

interface Props {
    isLoading: boolean;
    title: string;
    value: string | number;
    icon: ReactNode;
    color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    subValue?: string | number;
}

const SalesHistoryOverviewCard: FC<Props> = ({ title, value, icon, color, subValue, isLoading }) => {
    const theme = useTheme();
    const paletteColor = theme.palette[color];

    if (isLoading) {
        return (
            <Box sx={{ mx: "auto" }}>
                <Skeleton variant="rectangular" height={118} sx={{ borderRadius: theme.borderRadius.small }} />
            </Box>
        );
    }

    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: theme.borderRadius.small,
                height: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor: paletteColor.light,
                transition: theme.transitions.create(["background-color", "color"], {
                    duration: theme.transitions.duration.short,
                }),
                "&:hover": {
                    backgroundColor: paletteColor.main,
                    color: paletteColor.contrastText,
                    cursor: "pointer",
                },
            }}
            elevation={0}
        >
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.paper,
                    color: paletteColor.main,
                    mr: 2,
                    transition: theme.transitions.create(["color", "background-color"], {
                        duration: theme.transitions.duration.short,
                    }),
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="h5" component={"div"} sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {title}
                </Typography>
                {subValue && (
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{
                            fontWeight: 500,
                            opacity: 0.9,
                            mt: 0.5,
                        }}
                    >
                        {subValue}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default SalesHistoryOverviewCard;
