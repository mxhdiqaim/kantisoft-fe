import type { SxProps, Theme } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import type { FC, ReactNode } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    modalStyles?: SxProps<Theme>; // For overriding modal styles
    backdropProps?: object; // Custom props for Backdrop
}

const CustomModal: FC<Props> = ({
    open,
    onClose,
    title,
    description,
    children,
    modalStyles = {},
    backdropProps = {},
}) => {
    const defaultStyle: SxProps<Theme> = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "80vw", md: 600 },
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
        overflow: "auto",
        maxHeight: "85vh",
        ...modalStyles,
    };

    return (
        <Modal
            className="overflow-auto"
            open={open}
            onClose={onClose}
            closeAfterTransition
            aria-labelledby="custom-modal-title"
            aria-describedby="custom-modal-description"
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    ...backdropProps,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={defaultStyle} className="overflow-auto">
                    {title && (
                        <Typography
                            id="custom-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            {title}
                        </Typography>
                    )}
                    {description && (
                        <Typography
                            id="custom-modal-description"
                            sx={{ mt: 2 }}
                        >
                            {description}
                        </Typography>
                    )}
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
};

export default CustomModal;
