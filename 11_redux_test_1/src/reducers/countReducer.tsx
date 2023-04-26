import {AnyAction, Reducer} from "redux";

// This needs to be exported!
export interface State {
    count: number;
}

const initialState: State = {
    count: 0
}

const countReducer: Reducer<State, AnyAction> = (state = initialState, action) => {

    console.log(action);

    switch (action.type) {
        case "INCREMENT":
            return {
                count: state.count + 1
            }
        case "DECREMENT":
            return {
                count: state.count - 1
            }
        default:
            return state
    }
}

export default countReducer;