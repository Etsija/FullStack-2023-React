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

  let messageArea = <h4 style={{"height": 40}}></h4>

  if (action.state.loading) {
    messageArea = <h4 style={{"height": 40}}>Loading...</h4>
  }

  if (action.state.error) {
    messageArea = <h4 style={{"height": 40}}>{action.state.error}</h4>
  }

  if (action.state.isLogged) {
    return (
      <div className="App">
        <Navbar logout={action.logout} isLogged={action.state.isLogged} token={action.state.token} username={action.userState.username}/>
        <Routes>
          <Route path="/" element={
            <ShoppingList 
              list={action.state.list}
              edit={action.edit}
              remove={action.remove}
              getList={action.getList}
              token={action.state.token}/>}
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
        <Navbar logout={action.logout} isLogged={action.state.isLogged} token={action.state.token} username={action.userState.username}/>
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
