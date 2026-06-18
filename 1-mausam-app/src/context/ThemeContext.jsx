import { useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import ThemeContext from "./themeContext";

function getPreferredTheme() {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("mausam-theme", getPreferredTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () =>
                setTheme((currentTheme) =>
                    currentTheme === "dark" ? "light" : "dark"
                ),
        }),
        [theme, setTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
