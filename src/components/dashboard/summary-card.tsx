import { Typography, Box, Avatar, Grow } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactElement } from "react";
import CountUp from "react-countup";
import { ngnFormatter } from "@/utils";
import { CustomCardRef } from "../customs/custom-card";

interface Props {
    title: string;
    value: number | string;
    icon: ReactElement;
    color?: string;
    index: number;
}

const SummaryCard = ({ title, value, icon, color, index }: Props) => {
    const theme = useTheme();
    const cardColor = color || theme.palette.primary.main;

    const isNumeric = typeof value === "number";
    const numericValue = isNumeric ? value : parseFloat(String(value).replace(/,/g, ""));

    return (
        <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={500 + index * 150}>
            <CustomCardRef
                sx={{
                    boxShadow: theme.customShadows.card,
                    borderRadius: theme.borderRadius.small,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: cardColor,
                                color: theme.palette.getContrastText(cardColor),
                                mr: 2,
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Typography variant="h6" color="text.secondary">
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                        {isNumeric ? (
                            <CountUp
                                start={0}
                                end={numericValue}
                                duration={2}
                                separator=","
                                decimals={Number.isInteger(numericValue) ? 0 : 2}
                            />
                        ) : (
                            <>{ngnFormatter.format(Number(numericValue))}</>
                        )}
                    </Typography>
                </Box>
            </CustomCardRef>
        </Grow>
    );
};

export default SummaryCard;
