import React from 'react';
import './App.css';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import {Routes, Route, Navigate} from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={
          <ShoppingList />}
        />
        <Route path="/form" element={
          <ShoppingForm />}
        />
        <Route path="*" element={
          <Navigate to="/"/>}
        />
      </Routes>
    </div>
  );
}

export default App;
