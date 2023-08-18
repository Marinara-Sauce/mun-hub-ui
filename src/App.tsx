import React from 'react';
import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import Committee from './components/committee/committee';

function App() {
  return (
    <div className="App">
      <header>
        <AppHeader />
      </header>
      <div className="appBody">
        <Committee />
      </div>
      <footer>
        <AppFooter />
      </footer>
    </div>
  );
}

export default App;
