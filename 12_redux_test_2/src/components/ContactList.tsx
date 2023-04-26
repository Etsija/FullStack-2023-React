import React from "react";
import Contact from "../models/Contact";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers/contactReducer";

const ContactList: React.FC<{}> = (props) => {

    const dispatch = useDispatch();
    const listSelector = (state: AppState) => state.list;
    const list = useSelector(listSelector);

    let contactJSX = list.map((contact) => {
        return(
            <tr key={contact.id}>
                <td>{contact.firstname}</td>
                <td>{contact.lastname}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>
                    <button className="btn btn-danger" onClick={() => dispatch({
                        type: "REMOVE_CONTACT",
                        id: contact.id
                    })}>Remove</button>
                </td>
            </tr>
        )
    })

    return(
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>{contactJSX}</tbody>
        </table>
    )
}

export default ContactList;