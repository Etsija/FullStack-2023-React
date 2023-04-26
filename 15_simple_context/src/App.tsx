import React, { useState } from 'react';
import './App.css';
import ThemeContext, { themes, ThemeType } from './ThemeContext';
import Headline from './Headline';
import Paragraph from './Paragraph';
import ToggleButton from './ToggleButton';

interface State {
  theme: ThemeType;
}

function App() {

  const [state, setState] = useState<State>({
    theme: themes.dark
  });

  const toggleTheme = () => {
    if (state.theme === themes.dark) {
      setState({theme: themes.light});
    } else {
      setState({theme: themes.dark});
    }
  }

  return (
    <ThemeContext.Provider value={state.theme}>
      <div className="App">
        <Headline>useContext</Headline>
        <Paragraph>Liirum laarum</Paragraph>
        <ToggleButton toggleTheme={toggleTheme} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
