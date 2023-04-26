import React, {useContext} from "react";
import ThemeContext from "./ThemeContext";

interface Props {
    children: React.ReactNode;
}

const Headline: React.FC<Props> = (props: Props) => {

    const theme = useContext(ThemeContext);

    return (
        <h2 style={{color: theme.color, backgroundColor: theme.backGroundColor}}>
            {props.children}
        </h2>
    );
}

export default Headline;