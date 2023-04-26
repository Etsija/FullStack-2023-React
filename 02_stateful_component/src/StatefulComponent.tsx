import React, {useState, useEffect} from "react";

interface State {
    seconds: number;
}

// React.FC gets an empty constructor, because no props are sent to this component
const StatefulComponent: React.FC<{}> = (props) => {
    
    // This is a JSON object
    const [state, setState] = useState<State>({
        seconds: 0
    })

    const tick = () => {
        setState((state) => {
            // This is also a JSON object
            return {
                seconds: state.seconds + 1
            }
        })
    }

    // This trigger hook is in practise run only once, since second arg is [], so it's for initialisation of the timer
    // For example, all back-end calls are done via useEffect() trigger hook
    useEffect(() => {
        // This effectively starts the timer (only once)
        let interval = setInterval(tick, 1000);
        // When user navigates away from the page, timer is reset
        return () => clearInterval(interval);
    }, []);

    return(
        <h2>{state.seconds} seconds since you entered the page</h2>
    )
}

export default StatefulComponent;