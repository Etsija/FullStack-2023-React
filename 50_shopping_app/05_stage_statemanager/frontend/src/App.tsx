import React, { useEffect } from 'react';
import './App.css';
import useAction from './hooks/useAction';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage';
import useAppState from './hooks/useAppState';

function App() {

  const appState = useAppState();

  const action = useAction();

  useEffect(() => {
    if (appState.isLogged) {
      action.getList(appState.token);
    }
  }, [appState.isLogged]);

  let messageArea = <h4 style={{"height": 40}}></h4>

  if (appState.loading) {
    messageArea = <h4 style={{"height": 40}}>Loading...</h4>
  }

  if (appState.error) {
    messageArea = <h4 style={{"height": 40}}>{appState.error}</h4>
  }

  if (appState.isLogged) {
    return (
      <div className="App">
        <Navbar />
        {messageArea}
        <Routes>
          <Route path="/" element={<ShoppingList />} />
          <Route path="/form" element={<ShoppingForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Navbar />
        {messageArea}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />}
          />
        </Routes>
      </div>
    );
  }
}

export default App;
