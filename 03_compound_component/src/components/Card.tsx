import React, {useState} from "react";
import Square from "./Square";
import Label from "./Label";

interface State {
    color: string;
}

const Card: React.FC<{}> = (props) => {
    
    // Declare state
    const [state, setState] = useState<State>({
        color: "red"
    })

    // Change color state
    const changeColor = () => {
        let color: string = "#";
        const letters: string = "ABCDEF0123456789";
        for (let i=0; i<6; i++) {
            let temp = Math.floor(Math.random() * 16);
            color = color + letters[temp];
        }
        setState({
            color: color
        })
    }

    let cardStyle: React.CSSProperties = {
        height: 200,
        width: 150,
        backgroundColor: "#FFF",
        filter: "drop-shadow(0px 0px 5px #666)"
    }

    return(
        <div style={cardStyle}>
            <Square color={state.color}/>
            <Label color={state.color} changeColor={changeColor}/>
        </div>
    )
}

export default Card;