import { Card, CardActions, CardContent, CardHeader, type SxProps, type Theme } from "@mui/material";
import { forwardRef, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
    variant?: "outlined" | "elevation";
    sx?: SxProps<Theme>;
    title?: string;
    subheader?: string;
    actions?: ReactNode;
}

const CustomCard = ({ children, variant = "outlined", sx, title, subheader, actions }: Props) => {
    if (!children) {
        return <></>;
    }

    return (
        <>
            {children && (
                <Card variant={variant} sx={sx}>
                    {title && subheader && <CardHeader title={title} subheader={subheader} />}
                    {(!title || !subheader) && <CardHeader sx={{ display: "none" }} />}
                    <CardContent>{children && children}</CardContent>
                    {actions && <CardActions>{actions}</CardActions>}
                    {!actions && <CardActions sx={{ display: "none" }} />}
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
