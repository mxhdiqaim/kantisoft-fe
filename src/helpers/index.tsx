import {Breadcrumbs, Link as MuiLink, Typography} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const AppBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // Helper to check if a string is a UUID (prevents showing long IDs in breadcrumbs)
    const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small"/>}
            sx={{mb: 3, mt: 1}}
        >
            <MuiLink component={Link} to="/" underline="hover" color="inherit">
                Home
            </MuiLink>

            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                // Logic to clean up the display name
                let displayName = value.replace(/-/g, " ");
                if (isUuid(value)) {
                    displayName = "Details"; // or "View"
                }

                return last ? (
                    <Typography
                        key={to}
                        color="text.primary"
                        sx={{textTransform: 'capitalize', fontWeight: 500}}
                    >
                        {displayName}
                    </Typography>
                ) : (
                    <MuiLink
                        key={to}
                        component={Link}
                        to={to}
                        underline="hover"
                        color="inherit"
                        sx={{textTransform: 'capitalize'}}
                    >
                        {displayName}
                    </MuiLink>
                );
            })}
        </Breadcrumbs>
    );
};