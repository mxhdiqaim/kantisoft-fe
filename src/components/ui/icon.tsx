import {Box, type BoxProps} from "@mui/material";

interface Props extends BoxProps {
    src: string;
    alt?: string;
}

const Icon = ({src, alt, sx, ...rest}: Props) => {
    return <Box component="img" src={src} alt={alt} sx={{width: 24, height: 24, ...sx}} {...rest} />;
};

export default Icon;
