import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { type ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Theme {
        layout: {
            sidebarWidth: number;
            sidebarCollapsedWidth: number;
            sidebarHeight: number;
            appBarHeight: number;
        };
        customShadows: {
            card: string;
            dialog: string;
            button: string;
        };
        borderRadius: {
            small: number;
            medium: number;
            large: number;
        };
    }

    interface ThemeOptions {
        layout?: {
            sidebarWidth?: number;
            sidebarCollapsedWidth?: number;
            sidebarHeight?: number;
            appBarHeight?: number;
        };
        customShadows?: {
            card?: string;
            dialog?: string;
            button?: string;
        };
        borderRadius?: {
            small?: number;
            medium?: number;
            large?: number;
        };
    }

    interface Palette {
        alternate: Palette["primary"];
        customColors: {
            dark: string;
            light: string;
            darkBg: string;
            lightBg: string;
            border: string;
            tableHeader: string;
            divider: string;
        };
    }

    interface PaletteOptions {
        alternate?: PaletteOptions["primary"];
        customColors?: {
            dark?: string;
            light?: string;
            darkBg?: string;
            lightBg?: string;
            border?: string;
            tableHeader?: string;
            divider?: string;
        };
    }
}

const baseThemeOptions: ThemeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600, // Mobile
            md: 960, // Tablet
            lg: 1280, // Laptop
            xl: 1920, // Desktop
        },
    },
    typography: {
        fontFamily: "'Lato', 'Roboto', sans-serif",
        fontSize: 16,
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
        h1: { fontSize: "2.5rem", fontWeight: 600 },
        h2: { fontSize: "2rem", fontWeight: 600 },
        h3: { fontSize: "1.75rem", fontWeight: 600 },
        h4: { fontSize: "1.5rem", fontWeight: 600 },
        h5: { fontSize: "1.25rem", fontWeight: 600 },
        h6: { fontSize: "1rem", fontWeight: 700 },
    },
    palette: {
        primary: {
            main: "#4E3D42",
            light: "#6D6466",
            dark: "#3A2E31",
            contrastText: "#FFF",
        },
        secondary: {
            main: "#C9D5B5",
            light: "#E3DBDB",
            dark: "#9F9F92",
            contrastText: "#4E3D42",
        },
        info: {
            main: "#6D6466",
            light: "#9F9F92",
            dark: "#4E3D42",
            contrastText: "#FFF",
        },
        error: {
            main: "#DC1F1F",
            light: "#FF3B3B",
            dark: "#B71C1C",
        },
        warning: {
            main: "#FFA000",
            light: "#FFB333",
            dark: "#CC8000",
        },
        success: {
            main: "#2E7D32",
            light: "#4CAF50",
            dark: "#1B5E20",
        },
        grey: {
            50: "#E3DBDB",
            100: "#D9D0D0",
            200: "#C9C0C0",
            300: "#9F9F92",
            400: "#8A8A7E",
            500: "#6D6466",
            600: "#5A5254",
            700: "#4E3D42",
            800: "#3A2E31",
            900: "#2A2123",
        },
        alternate: {
            main: "#E3DBDB",
            dark: "#4E3D42",
        },
        background: {
            default: "#FFF",
            paper: "#E3DBDB",
        },
        customColors: {
            dark: "#4E3D42",
            light: "#E3DBDB",
            darkBg: "#6D6466",
            lightBg: "#C9D5B5",
            border: "#9F9F92",
            tableHeader: "#E3DBDB",
            divider: "#9F9F92",
        },
    },
    layout: {
        sidebarWidth: 271,
        sidebarCollapsedWidth: 72,
        sidebarHeight: 100,
        appBarHeight: 72,
    },
    customShadows: {
        card: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        dialog: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        button: "0px 1px 2px rgba(0, 0, 0, 0.05)",
    },
    borderRadius: {
        small: 4,
        medium: 8,
        large: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 16px",
                },
                contained: {
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#F5F5F5",
                    fontWeight: 600,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                // Override the styles for the 'success' variant
                filledSuccess: {
                    backgroundColor: "green", // Your custom success color
                },
                // Override the styles for the 'error' variant
                filledError: {
                    backgroundColor: "#d32f2f", // Your custom error color
                },
                // You can also customize other variants
                filledWarning: {
                    backgroundColor: "orange",
                },
                filledInfo: {
                    backgroundColor: "lightblue",
                },
            },
        },
    },
};

export const createAppTheme = (mode: "light" | "dark" = "light") => {
    let theme = createTheme({
        ...baseThemeOptions,
        palette: {
            ...baseThemeOptions.palette,
            mode,
        },
    });

    theme = responsiveFontSizes(theme);

    return theme;
};
