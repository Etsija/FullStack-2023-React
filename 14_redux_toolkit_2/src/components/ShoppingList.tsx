import React, {useState} from "react";
import ShoppingItem from "../models/ShoppingItem";
import Row from "./Row";
import RemoveRow from "./RemoveRow";
import EditRow from "./EditRow";
import { ThunkDispatch} from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store/shoppingSlice";
import { remove, edit } from "../store/shoppingSlice";

interface State {
    removeIndex: number;
    editIndex: number;
}

const ShoppingList: React.FC<{}> = (props) => {

    const [state, setState] = useState<State>({
        removeIndex: -1,
        editIndex: -1
    })

    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
    const stateSelector = (state: AppState) => state;
    const appState = useSelector(stateSelector);

    const changeMode = (index: number, mode: string) => {
        // Would be mode elegant using switch...case
        if (mode === "remove") {
            setState({
                removeIndex: index,
                editIndex: -1
            })
        }
        if (mode === "edit") {
            setState({
                removeIndex: -1,
                editIndex: index
            })
        }
        if (mode === "cancel") {
            setState({
                removeIndex: -1,
                editIndex: -1
            })
        }
    }

    const removeItem = (id: number) => {
        dispatch(remove(id));
        changeMode(0, "cancel");
    }

    const editItem = (item: ShoppingItem) => {
        dispatch(edit(item));
        changeMode(0, "cancel");
    }

    const shoppingItems = appState.list.map((item, index) => {
        if (state.removeIndex === index) {
            return(
                <RemoveRow key={item.id} item={item} changeMode={changeMode} removeItem={removeItem}/>
            )
        }
        if (state.editIndex === index) {
            return(
                <EditRow key={item.id} item={item} changeMode={changeMode} editItem={editItem}/>
            )
        }
        return(
            <Row key={item.id} item={item} index={index} changeMode={changeMode}/>
        )
    })

    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Price</th>
                    <th>Remove</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {shoppingItems}
            </tbody>
        </table>
    )
}

export default ShoppingList;