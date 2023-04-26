import React from "react";
import HelloWorld from "./HelloWorld";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h2>Hello World</h2>
      <HelloWorld />
      <HelloWorld name = "Jyrki"/>
    </div>
  );
}

export default App;
