import React, { useState } from "react";
import User from "../models/User";
import useAction from "../hooks/useAction";

interface State {
    username: string;
    password: string;
}

const LoginPage: React.FC<{}> = (props) => {

    const [state, setState] = useState<State>({
        username: "",
        password: ""
    })

    const action = useAction();

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
        let user = new User(state.username, state.password);
        action.register(user);
    }

    const onLogin = (event: React.SyntheticEvent) => {
        event.preventDefault();
        let user = new User(state.username, state.password);
        action.login(user);
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