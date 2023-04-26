import React, {useContext} from "react";
import ThemeContext from "./ThemeContext";

interface Props {
    toggleTheme(): void
}

const ToggleButton: React.FC<Props> = (props: Props) => {

    const theme = useContext(ThemeContext);

    return (
        <button 
            style={{color: theme.color, backgroundColor: theme.backGroundColor}} 
            onClick={props.toggleTheme}>Toggle Theme
        </button>
    );
}

export default ToggleButton;