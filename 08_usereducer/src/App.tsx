import React, { useReducer } from 'react';
import './App.css';
import Contact from './models/Contact';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';

interface State {
  list: Contact[];
  id: number;
} 

interface Action {
  type: string;
  payload: any;
}

const initialState: State = {
  list: [],
  id: 100
}

const contactReducer = (state: State, action: Action): State => {
  switch(action.type) {
    case "ADD_CONTACT":
      let tempContact = action.payload as Contact;
      tempContact.id = state.id;
      return {
        list: state.list.concat(tempContact),
        id: state.id + 1
      }
    case "REMOVE_CONTACT":
      let tempId = action.payload as number;
      let tempList = state.list.filter(contact => contact.id !== tempId);
      return {
        ...state,
        list: tempList
      }
    default:
      return state;
  }
}

function App() {

  const [state, dispatch] = useReducer(contactReducer, initialState);

  const addContact = (contact: Contact) => {
    dispatch({
      type: "ADD_CONTACT",
      payload: contact
    })
  }

  const removeContact = (id: number) => {
    dispatch({
      type: "REMOVE_CONTACT",
      payload: id
    })
  }

  return (
    <div className="App">
      <ContactForm addContact={addContact}/>
      <hr/>
      <ContactList list={state.list} removeContact={removeContact}/>
    </div>
  );
}

export default App;
