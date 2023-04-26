import React from "react";

interface Props {
    color: string;
}

const Square: React.FC<Props> = (props: Props) => {
    
    let squareStyle: React.CSSProperties = {
        backgroundColor: props.color,
        height: 150
    }

    return(
        <div style={squareStyle}></div>
    )
}

export default Square;