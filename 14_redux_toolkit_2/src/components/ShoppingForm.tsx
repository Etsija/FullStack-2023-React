import React, { useState } from "react";
import ShoppingItem from "../models/ShoppingItem";
import { useDispatch } from "react-redux";
import { add } from "../store/shoppingSlice";
import { ThunkDispatch} from "@reduxjs/toolkit";
import { AnyAction } from "redux";

interface State {
    type: string;
    count: number;
    price: number;
}

const ShoppingForm: React.FC<{}> = (props) => {

    const [state, setState] = useState<State>({
        type: "",
        count: 0,
        price: 0
    })

    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((state) => {
            return {
                ...state,
                [event.target.name]: event.target.value
            }
        })
    }

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (state.type === "") {
            return;
        }
        let item = new ShoppingItem(state.type, state.count, state.price, 0);
        dispatch(add(item));
        setState({
            type: "",
            count: 0,
            price: 0
        })
    }

    return(
        <div style={{"width": 500, "backgroundColor": "lightblue", "margin": "auto"}}>
            <form className="mb-3" onSubmit={onSubmit}>
                <label className="form-label" htmlFor="type">Type</label>
                <input className="form-control"
                        type="text" 
                        name="type" 
                        id="type" 
                        onChange={onChange} 
                        value={state.type}/>
                <label className="form-label" htmlFor="count">Count</label>
                <input className="form-control"
                        type="number" 
                        name="count" 
                        id="count" 
                        onChange={onChange} 
                        value={state.count}/>
                <label className="form-label" htmlFor="price">Price</label>
                <input className="form-control"
                        type="number" 
                        name="price" 
                        id="price" 
                        step="0.01"
                        onChange={onChange} 
                        value={state.price}/>
                <input type="submit" className="btn btn-primary" value="Add"/>
            </form>
        </div>
    )
}

export default ShoppingForm;