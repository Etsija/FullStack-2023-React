import React, {useState} from 'react';
import './App.css';
import Contact from './models/Contact';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

interface State {
  list: Contact[];
  id: number;
}

function App() {

  const [state, setState] = useState<State>({
    list: [],
    id: 100
  })

  const addContact = (contact: Contact) => {
    setState((state) => {
      contact.id = state.id;
      return {
        list: state.list.concat(contact),
        id: state.id + 1
      }
    })
  }
    
  const removeContact = (id: number) => {
    setState((state) => {
      // Return all list elements except one that has the id
      let tempList = state.list.filter(contact => contact.id !== id);
      // Replace state's list-element with this new modified list
      return {
        ...state,
        list: tempList
      }
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
