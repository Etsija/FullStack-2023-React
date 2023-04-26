import React, {SyntheticEvent, useState} from "react";
import ShoppingItem from "../models/ShoppingItem";
import Row from "./Row";
import RemoveRow from "./RemoveRow";
import EditRow from "./EditRow";

interface Props {
    list: ShoppingItem[];
    remove(id: string): void;
    edit(item: ShoppingItem): void;
    getList(token: string, search?: string): void;
    token: string;
}

interface State {
    removeIndex: number;
    editIndex: number;
}

interface SearchState {
    search: string;
}

const ShoppingList: React.FC<Props> = (props: Props) => {

    const [state, setState] = useState<State>({
        removeIndex: -1,
        editIndex: -1
    })

    const [search, setSearch] = useState<SearchState>({
        search: ""
    })

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

    const removeItem = (id: string) => {
        props.remove(id);
        changeMode(0, "cancel");
    }

    const editItem = (item: ShoppingItem) => {
        props.edit(item);
        changeMode(0, "cancel");
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch({
            search: event.target.value
        })
    }

    const searchByType = (event: React.SyntheticEvent) => {
        event.preventDefault();
        props.getList(props.token, search.search);
    }

    const shoppingItems = props.list.map((item, index) => {
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
        <div>
            <div style={{"margin": "auto"}}>
                <label htmlFor="search">Search by item:</label>
                <input type="text"
                        name="search"
                        id="search"
                        onChange={onChange}
                        value={search.search}/>
                <button className="btn btn-primary" onClick={searchByType}>Search</button>
            </div>
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
        </div>
    )
}

export default ShoppingList;