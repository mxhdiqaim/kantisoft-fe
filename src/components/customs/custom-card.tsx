import {
    Card,
    CardActions,
    CardContent,
    type SxProps,
    type Theme,
} from '@mui/material';
import type { ReactNode } from 'react';

interface CustomCardProps {
    children?: ReactNode;
    variant?: 'outlined' | 'elevation';
    sx?: SxProps<Theme>;
}

const CustomCard = ({
    children,
    variant = 'outlined',
    sx,
}: CustomCardProps) => {
    if (!children) {
        return <></>;
    }

    return (
        <>
            {children && (
                <Card variant={variant} sx={sx}>
                    <CardContent>{children && children}</CardContent>
                    <CardActions sx={{ display: 'none' }} />
                </Card>
            )}
        </>
    );
};

export default CustomCard;
