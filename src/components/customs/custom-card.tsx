import { Card, CardActions, CardContent, type SxProps, type Theme } from "@mui/material";
import { forwardRef, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
    variant?: "outlined" | "elevation";
    sx?: SxProps<Theme>;
}

const CustomCard = ({ children, variant = "outlined", sx }: Props) => {
    if (!children) {
        return <></>;
    }

    return (
        <>
            {children && (
                <Card variant={variant} sx={sx}>
                    <CardContent>{children && children}</CardContent>
                    <CardActions sx={{ display: "none" }} />
                </Card>
            )}
        </>
    );
};

export const CustomCardRef = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { children, variant = "elevation", sx } = props;
    if (!children) {
        return <></>;
    }

    return (
        <>
            {children && (
                <Card variant={variant} sx={sx} ref={ref}>
                    <CardContent>{children && children}</CardContent>
                    <CardActions sx={{ display: "none" }} />
                </Card>
            )}
        </>
    );
});

CustomCardRef.displayName = "CustomCardRef";

export default CustomCard;
