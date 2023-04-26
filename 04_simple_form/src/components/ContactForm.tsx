import React, {useState} from "react";
import Person from "../models/Person";

interface State {
    firstname: string;
    lastname: string;
}

interface Props {
    setGreeting(person: Person): void;
}

const ContactForm: React.FC<Props> = (props: Props) => {

    // State initialisation
    const [state, setState] = useState<State>({
        firstname: "",
        lastname: ""
    })

    // Handle form's input box's onChange events
    // Note that this is two-way binding: editing input box changes form's state. Editing state changes input box
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((state) => {
            return {
                // Copy old state (spread operator ...) and overwrite wanted part of state
                ...state,
                [event.target.name]: event.target.value
            }
        })
    }

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        let person = new Person(state.firstname, state.lastname);
        props.setGreeting(person);
        // Reset state (empty inputs)
        setState({
            firstname: "",
            lastname: ""
        })
    }

    return(
        <form onSubmit = {onSubmit}>
            <label htmlFor="firstname">First Name</label>
            <input type="text"
                    name="firstname"
                    id="firstname"
                    onChange={onChange}
                    value={state.firstname}/>
            <br/>
            <label htmlFor="lastname">Last Name</label>
            <input type="text"
                    name="lastname"
                    id="lastname"
                    onChange={onChange}
                    value={state.lastname}/>
            <br/>
            <input type="submit" value="Greet"/>    
        </form>
    )

}

export default ContactForm;