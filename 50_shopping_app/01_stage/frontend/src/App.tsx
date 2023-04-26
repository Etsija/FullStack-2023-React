import React, {useEffect} from 'react';
import './App.css';
import useAction from './hooks/useAction';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import {Routes, Route, Navigate} from "react-router-dom";

function App() {

  const action = useAction();

  useEffect(() => {
    action.getList();
  }, [])

  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={
          <ShoppingList 
            list={action.state.list}
            edit={action.edit}
            remove={action.remove}/>}
        />
        <Route path="/form" element={
          <ShoppingForm 
            add={action.add}/>}
        />
        <Route path="*" element={
          <Navigate to="/"/>}
        />
      </Routes>
    </div>
  );
}

export default App;
