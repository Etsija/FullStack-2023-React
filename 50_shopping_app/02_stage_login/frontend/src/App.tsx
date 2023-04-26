import React, {useEffect} from 'react';
import './App.css';
import useAction from './hooks/useAction';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import {Routes, Route, Navigate} from "react-router-dom";
import LoginPage from './components/LoginPage';

function App() {

  const action = useAction();

  let messageArea = <h4></h4>

  if (action.state.loading) {
    messageArea = <h4>Loading...</h4>
  }

  if (action.state.error) {
    messageArea = <h4>{action.state.error}</h4>
  }

  if (action.state.isLogged) {
    return (
      <div className="App">
        <Navbar logout={action.logout} isLogged={action.state.isLogged} token={action.state.token}/>
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
  } else {
    return (
      <div className="App">
        <Navbar logout={action.logout} isLogged={action.state.isLogged} token={action.state.token}/>
        {messageArea}
        <Routes>
          <Route path="/" element={
            <LoginPage
              register={action.register}
              login={action.login}
            />}
          />
          <Route path="*" element={
            <Navigate to="/"/>}
          />
        </Routes>
      </div>
    );
  }
}

export default App;
