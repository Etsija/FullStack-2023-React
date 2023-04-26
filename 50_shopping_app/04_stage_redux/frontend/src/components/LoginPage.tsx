import React, { useState } from "react";
import User from "../models/User";
import { register, registerFailed, login } from "../actions/loginActions";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

interface State {
    username: string;
    password: string;
}

const LoginPage: React.FC<{}> = (props) => {

    const [state, setState] = useState<State>({
        username: "",
        password: ""
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

    const onRegister = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (state.username.length < 4 || state.password.length < 8) {
            dispatch(registerFailed("Username must be at least 4 characters and password must be at least 8 characters"));
            return;
        }
        let user = new User(state.username, state.password);
        dispatch(register(user));
    }

    const onLogin = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (state.username.length < 4 || state.password.length < 8) {
            dispatch(registerFailed("Username must be at least 4 characters and password must be at least 8 characters"));
            return;
        }
        let user = new User(state.username, state.password);
        dispatch(login(user));
    }

    return(
        <div style={{"width": 500, "backgroundColor": "pink", "margin": "auto"}}>
            <form className="mb-3">
                <label className="form-label" htmlFor="username">Username</label>
                <input type="text"
                        name="username"
                        id="username"
                        className="form-control"
                        onChange={onChange}
                        value={state.username}/>
                <label className="form-label" htmlFor="password">Password</label>
                <input type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        onChange={onChange}
                        value={state.password}/>
                <button name="register" className="btn btn-primary" onClick={onRegister}>Register</button>
                <button name="login" className="btn btn-primary" onClick={onLogin}>Login</button>   
            </form>
        </div>
    )
}

export default LoginPage;