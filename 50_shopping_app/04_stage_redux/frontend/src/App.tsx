import './App.css';
import ShoppingForm from './components/ShoppingForm';
import ShoppingList from './components/ShoppingList';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "./types/states";

function App() {

  const stateSelector = (state: AppState) => state;
  const state = useSelector(stateSelector);

  let messageArea = <h4 style={{"height": 40}}></h4>

  if (state.login.loading) {
    messageArea = <h4 style={{"height": 40}}>Loading...</h4>
  }

  if (state.shopping.error) {
    messageArea = <h4 style={{"height": 40}}>{state.shopping.error}</h4>
  }

  // If the user is logged in, show the shopping list and the form
  if (state.login.isLogged) {
    return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<ShoppingList />} />
          <Route path="/form" element={<ShoppingForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
    
  // Else show the login page
  } else {
    return (
      <div className="App">
        <Navbar />
        {messageArea}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }
}

export default App;