import React from "react";
import {Link} from "react-router-dom";
import useAppState from "../hooks/useAppState";
import useAction from "../hooks/useAction";

const Navbar: React.FC<{}> = (props) => {

    const appState = useAppState();
    const action = useAction();

    if (appState.isLogged) {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <p className="navbar-brand" style={{marginLeft: 10}}>Shopping App</p>
                <ul className="navbar-nav">
                    <li className="nav-item" style={{marginLeft: 10}}>
                        <Link to="/" className="nav-link">Shopping List</Link>
                    </li>
                    <li className="nav_item" style={{marginLeft: 10}}>
                        <Link to="/form" className="nav-link">Add new item</Link>
                    </li>
                    <li className="nav_item" style={{marginLeft: 10}}>
                        <p className="nav-link" style={{"color": "blue"}}>Logged in as {appState.username}</p>
                    </li>
                    <li className="nav_item" style={{marginLeft: 10}}>
                        <Link to="/" className="nav-link" onClick={action.logout}>Logout</Link>
                    </li>
                </ul>
            </nav>
        );
    } else {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <p className="navbar-brand" style={{marginLeft: 10}}>Shopping App</p>
            </nav>
        );
    }
}

export default Navbar;