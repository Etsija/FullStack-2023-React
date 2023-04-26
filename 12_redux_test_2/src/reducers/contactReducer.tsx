import {AnyAction, Reducer} from 'redux';
import Contact from '../models/Contact';

export interface AppState {
    list: Contact[];
    id: number;
}

const initialState: AppState = {
    list: [],
    id: 100
}

const contactReducer: Reducer<AppState, AnyAction> = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_CONTACT':
            return {
                id: state.id + 1,
                list: state.list.concat(action.contact)
            }
        case 'REMOVE_CONTACT':
            let tempList = state.list.filter(c => c.id !== action.id);
            return {
                ...state,
                list: tempList
            }
        default:
            return state;
    }
}

export default contactReducer;