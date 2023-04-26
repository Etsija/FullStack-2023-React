import {useState, useEffect} from "react";
import ShoppingItem from "../models/ShoppingItem";
import User from "../models/User";

interface State {
    list: ShoppingItem[];
    isLogged: boolean,
    token: string,
    loading: boolean,
    error: string
}

// "Logged in as <username>"
interface UserState {
    username: string;
}

interface UrlRequest {
    request: Request;
    action: string;
}

interface Token {
    token: string
}

const useAction = () => {

    // Initialise states

    const [state, setState] = useState<State>({
        list: [],
        isLogged: false,
        token: "",
        loading: false,
        error: ""
    })

    const [urlRequest, setUrlRequest] = useState<UrlRequest>({
        request: new Request("", {}),
        action: ""
    })

    const [userState, setUserState] = useState<UserState>({
        username: ""
    })

    // State helpers

    // Local browser session storage
    const saveToStorage = (state: State) => {
        sessionStorage.setItem("state", JSON.stringify(state));
    }

    useEffect(() => {
        let temp = sessionStorage.getItem("state");
        if (temp) {
            let state = JSON.parse(temp);
            setState(state);
        }
    }, [])

    const setLoading = (loading: boolean) => {
        setState((state) => {
            return {
                ...state,
                loading: loading,
                error: ""
            }
        })
    }

    const setError = (error: string) => {
        setState((state) => {
            let tempState = {
                ...state,
                error: error
            }
            saveToStorage(tempState);
            return tempState;
        })
    }

    // FETCH useEffect
    useEffect(() => {

        const fetchData = async () => {

            setLoading(true);
            const response = await fetch(urlRequest.request);
            setLoading(false);
            
            if (!response) {
                console.log("Server sent no response!");
                return;
            }
            
            if (response.ok) {
                switch (urlRequest.action) {
                    case "getlist":
                        let temp = await response.json();
                        let list: ShoppingItem[] = temp as ShoppingItem[];
                        setState((state) => {
                            let tempState = {
                                ...state,
                                list: list
                            }
                            saveToStorage(tempState);
                            return tempState;
                        })
                        return;
                    case "additem":
                    case "removeitem":
                    case "edititem":
                        getList(state.token);
                        return;
                    case "register":
                        setError("Register Success");
                        return;
                    case "login":
                        let temp2 = await response.json();
                        let token = temp2 as Token;
                        setState((state) => {
                            let tempState = {
                                ...state,
                                isLogged: true,
                                token: token.token
                            }
                            saveToStorage(tempState);
                            return tempState;
                        })
                        getList(token.token);
                        return;
                    case "logout":
                        let logoutState = {
                            list: [],
                            token: "",
                            error: "",
                            isLogged: false,
                            loading: false
                        }
                        saveToStorage(logoutState);
                        setState(logoutState);
                        return;
                    default:
                        return;
                }
                
            } else {
                if (response.status === 403) {
                    let tempState = {
                        list: [],
                        token: "",
                        isLogged: false,
                        loading: false,
                        error: "Your session has expired.  Logging you out!"
                    }
                    saveToStorage(tempState);
                    setState(tempState);
                    return;
                }
                let errorMessage = "Server responded with a status " + response.status + " " + response.statusText;
                switch (urlRequest.action) {
                    case "register":
                        if (response.status === 409) {
                            errorMessage = "Username already in use";
                        }
                        setError(errorMessage);
                        return;
                    case "login":
                    case "getlist":
                    case "additem":
                    case "edititem":
                        setError(errorMessage);
                        return;
                    case "logout":
                        let tempState = {
                            list: [],
                            token: "",
                            isLogged: false,
                            loading: false,
                            error: "Server responded with an error.  Logging you out."
                        }
                        saveToStorage(tempState);
                        setState(tempState);
                        return;
                    default:
                        return;
                }
            }
        }

        fetchData();

    }, [urlRequest]);

    // Helper functions
    
    const getList = (token: string, search?: string) => {
        let url = "/api/shopping";
        // Added search functionality
        if (search) {
            url = url + "?type=" + search;
        }
        setUrlRequest({
            request: new Request(url, {
                method: "GET",
                headers: {"token": token}
            }),
            action: "getlist"
        })
    }

    const add = (item: ShoppingItem) => {
        setUrlRequest({
            request: new Request("/api/shopping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": state.token
                },
                body: JSON.stringify(item)
            }),
            action: "additem"
        })
    }

    const remove = (id: string) => {
        setUrlRequest({
            request: new Request("/api/shopping/"+id, {
                method: "DELETE",
                headers: {"token": state.token}
            }),
            action: "removeitem"
        })
    }

    const edit = (item: ShoppingItem) => {
        setUrlRequest({
            request: new Request("/api/shopping/"+item.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": state.token
                },
                body: JSON.stringify(item)
            }),
            action: "edititem"
        })
    }

    // Register request
    const register = (user: User) => {
        setUrlRequest({
            request: new Request("/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            }),
            action: "register"
        })
    }

    // Login request
    const login = (user: User) => {
        // "Logged in as <username>"
        setUserState({
            username: user.username
        })
        setUrlRequest({
            request: new Request("/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            }),
            action: "login"
        })
    }

    // Logout request
    const logout = () => {
        setUrlRequest({
            request: new Request("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": state.token
                },
            }),
            action: "logout"
        })
    }

    // All returns from this state handler
    return {state, getList, add, remove, edit, register, login, logout, userState};
}

export default useAction;