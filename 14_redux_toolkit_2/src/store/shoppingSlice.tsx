import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ShoppingItem from "../models/ShoppingItem";

export interface AppState {
    list: ShoppingItem[];
}

export const getList = createAsyncThunk("getlist", async (data, ThunkAPI) => {
    const request = new Request("/api/shopping", {
        method: "GET"
    })
    const response = await fetch(request);
    const temp = await response.json();
    const list = temp as ShoppingItem[];
    return list;
})

export const add = createAsyncThunk("add", async (item: ShoppingItem, ThunkAPI) => {
    const request = new Request("/api/shopping", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
    const response = await fetch(request);
    if (response.ok) {
        ThunkAPI.dispatch(getList());
    }
    return {"Message": "Done"};
})

export const remove = createAsyncThunk("remove", async (id: number, ThunkAPI) => {
    const request = new Request("/api/shopping/"+id, {
        method: "DELETE",
    })
    const response = await fetch(request);
    if (response.ok) {
        ThunkAPI.dispatch(getList());
    }
    return {"Message": "Done"};
})

export const edit = createAsyncThunk("edit", async (item: ShoppingItem, ThunkAPI) => {
    const request = new Request("/api/shopping/"+item.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
    const response = await fetch(request);
    if (response.ok) {
        ThunkAPI.dispatch(getList());
    }
    return {"Message": "Done"};
})

const initialState: AppState = {
    list: []
}

const shoppingSlice = createSlice({
    name: "shopping",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getList.fulfilled, (state, action) => {
            state.list = action.payload;
        });
        builder.addCase(add.fulfilled, (state, action) => {
            console.log(action);
        });
        builder.addCase(remove.fulfilled, (state, action) => {
            console.log(action);
        });
        builder.addCase(edit.fulfilled, (state, action) => {
            console.log(action);
        });
    },
})

export default shoppingSlice.reducer;