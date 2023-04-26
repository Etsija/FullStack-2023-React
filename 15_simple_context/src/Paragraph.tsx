import React, {useContext} from "react";
import ThemeContext from "./ThemeContext";

interface Props {
    children: React.ReactNode;
}

const Paragraph: React.FC<Props> = (props: Props) => {

    const theme = useContext(ThemeContext);

    return (
        <p style={{color: theme.color, backgroundColor: theme.backGroundColor}}>
            {props.children}
        </p>
    );
}

export default Paragraph;