import React from "react";

// color is the dataflow from container down to this component
// changeColor() is the inverse dataflow from this component up to the container
interface Props {
    color: string;
    changeColor(): void;
}

const Label: React.FC<Props> = (props: Props) => {
    
    let labelStyle: React.CSSProperties = {
        fontFamily: "sans-serif",
        fontWeight: "bold",
        margin: 0,
        padding: 13
    }

    return(
        <p style={labelStyle} onClick={props.changeColor}>
            {props.color}
        </p>
    )
}

export default Label;