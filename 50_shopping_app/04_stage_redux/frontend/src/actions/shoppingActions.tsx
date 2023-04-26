import { loading, stopLoading, logoutFailed } from "./loginActions";
import ShoppingItem from "../models/ShoppingItem";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import * as actionConstants from "../types/actionConstants";

// ASYNC THUNKS

// This function is called from the component
export const getList = (token: string, search: string) => {
    return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        let url = "/api/shopping";
        if (search) {
            url += "?type=" + search;
        }
        let request = new Request(url, {
            method: "GET",
            headers: {
                "token": token
            }
        })
        handleFetch(request, "getlist", dispatch, token);
    }
}

// This function is called from the component
export const add = (token: string, item: ShoppingItem) => {
    return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        let request = new Request("/api/shopping", {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        handleFetch(request, "additem", dispatch, token);
    }
}

// This function is called from the component
export const remove = (token: string, id: string) => {
    return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        let request = new Request("/api/shopping/" + id, {
            method: "DELETE",
            headers: {
                "token": token
            }
        })
        handleFetch(request, "removeitem", dispatch, token);
    }
}

// This function is called from the component
export const edit = (token: string, item: ShoppingItem) => {
    return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        let request = new Request("/api/shopping/" + item.id, {
            method: "PUT",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        handleFetch(request, "edititem", dispatch, token);
    }
}

// This is an internal function that handles the fetch request and dispatches the appropriate action
const handleFetch = async (request: Request, act: string, dispatch: ThunkDispatch<any, any, AnyAction>, token: string) => {
    dispatch(loading());
    const response = await fetch(request);
    dispatch(stopLoading());
    if (!response) {
        dispatch(logoutFailed("No response from server, logging you out"));
        return;
    }
    if (response.ok) {
        switch(act) {
            case "getlist":
                let temp = await response.json();
                if (!temp) {
                    dispatch(fetchListFailed("Failed to parse shopping info.  Logging you out"));
                    return;
                }
                // Typecast to ShoppingItem[]
                let list = temp as ShoppingItem[];
                dispatch(fetchListSuccess(list));
                return;
            case "additem":
                dispatch(fetchItemSuccess(actionConstants.ADD_ITEM_SUCCESS));
                dispatch(getList(token, ""));
                return;
            case "removeitem":
                dispatch(fetchItemSuccess(actionConstants.REMOVE_ITEM_SUCCESS));
                dispatch(getList(token, ""));
                return;
            case "edititem":
                dispatch(fetchItemSuccess(actionConstants.EDIT_ITEM_SUCCESS));
                dispatch(getList(token, ""));
                return;
            default:
                return;
        }
    } else {
        if (response.status === 403) {
            dispatch(logoutFailed("Your session has expired, logging you out"));
            return;
        }
        let errorMessage = "Server responded with a status " + response.status + " " + response.statusText;
        switch (act) {
            case "getlist":
                dispatch(fetchListFailed("Fetching shopping info failed. " + errorMessage));
                return;
            case "additem":
                dispatch(fetchItemFailed(actionConstants.ADD_ITEM_FAILED, "Adding item failed. " + errorMessage));
                return;
            case "removeitem":
                dispatch(fetchItemFailed(actionConstants.REMOVE_ITEM_FAILED, "Removing item failed. " + errorMessage));
                return;
            case "edititem":
                dispatch(fetchItemFailed(actionConstants.EDIT_ITEM_FAILED, "Editing item failed. " + errorMessage));
                return;
            default:
                return;
        }
    }
}

// ACTION CREATORS

const fetchListSuccess = (list: ShoppingItem[]) => {
    return {
        type: actionConstants.FETCH_LIST_SUCCESS,
        list: list
    }
}

const fetchListFailed = (error: string) => {
    return {
        type: actionConstants.FETCH_LIST_FAILED,
        error: error
    }
}

const fetchItemSuccess = (type: string) => {
    return {
        type: type
    }
}

const fetchItemFailed = (type: string, error: string) => {
    return {
        type: type,
        error: error
    }
}
