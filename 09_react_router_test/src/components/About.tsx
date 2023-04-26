import React from "react";
import {useNavigate} from "react-router-dom";

const About: React.FC<{}> = (props) => {
    
    const navigate = useNavigate();

    // div needed due to React not accepting more than one low level component
    return(
        <div>
            <h2>This is a React Router example app</h2>
            <button onClick={() => navigate("/secret")}>Go to secret page</button>
        </div>
    )
}

export default About;