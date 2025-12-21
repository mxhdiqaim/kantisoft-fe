import {Children, cloneElement, isValidElement, type MouseEvent, type ReactNode, useState} from "react";
import {Box, Button, type ButtonProps, Menu, type SxProps, type Theme, useTheme} from "@mui/material";
import {Link} from "react-router-dom";

export interface Props extends ButtonProps {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    title?: string;
    sx?: SxProps<Theme>;
    titleStyle?: SxProps<Theme>;
    to?: string;
}

const CustomButton = ({
                          startIcon,
                          endIcon,
                          title,
                          sx,
                          titleStyle,
                          variant = "outlined",
                          children,
                          onClick,
                          to,
                          ...rest
                      }: Props) => {

    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if (onClick) {
            onClick(event);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!startIcon && !endIcon && !title) {
        return null;
    }

    const buttonStyle: SxProps<Theme> = {
        // borderRadius: theme.borderRadius.small,
        height: 40,
        width: {xs: 100, md: "auto"},
        ...sx,
    };

    const renderButton = (props: ButtonProps) => {
        const linkProps = to ? {component: Link, to} : {};

        // Icon-only buttons
        if ((startIcon && !title && !endIcon) || (endIcon && !title && !startIcon)) {
            return (
                <Button
                    size={"small"}
                    variant={variant}
                    sx={{
                        ...buttonStyle,
                        minWidth: 0,
                        padding: "8px",
                    }}
                    {...props}
                    {...linkProps}
                >
                    {startIcon || endIcon}
                </Button>
            );
        }

        return (
            <Button
                size={"small"}
                variant={variant}
                startIcon={startIcon}
                endIcon={endIcon}
                sx={{...buttonStyle}}
                {...props}
                {...linkProps}
            >
                <Box component={"span"} sx={{...titleStyle}}>
                    {title}
                </Box>
            </Button>
        );
    };

    if (!children) {
        return renderButton({onClick, ...rest});
    }

    return (
        <>
            {renderButton({onClick: handleMenuClick, ...rest})}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            boxShadow: theme.customShadows.dialog,
                            borderRadius: theme.borderRadius.small,
                            backgroundColor: "white",
                            "& .MuiMenuItem-root": {
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            },
                        },
                    },
                }}
            >
                {Children.map(children, (child) => {
                    if (isValidElement(child)) {
                        return cloneElement(child, {
                            // eslint-disable-next-line
                            // @ts-ignore
                            onClick: (e: MouseEvent<HTMLElement>) => {
                                // eslint-disable-next-line
                                // @ts-ignore
                                if (child.props.onClick) {
                                    // eslint-disable-next-line
                                    // @ts-ignore
                                    child.props.onClick(e);
                                }
                                handleClose();
                            },
                        });
                    }
                    return child;
                })}
            </Menu>
        </>
    );
};

export default CustomButton;
