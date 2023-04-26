import React from "react";

export const themes = {
    light: {
        color: "#000000",
        backGroundColor: "#d3d3d3"
    },
    dark: {
        color: "#ffffff",
        backGroundColor: "#595959"
    }
}

export interface ThemeType {
    color: string;
    backGroundColor: string;
}

const ThemeContext = React.createContext(themes.dark);

ThemeContext.displayName = "ThemeContext";

export default ThemeContext;