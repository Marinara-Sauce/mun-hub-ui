import React from 'react';
import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import CommitteeHub from './components/committee/committee';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header>
        <AppHeader />
      </header>
      <div className="appBody">
        <Routes>
          <Route path="/committee/:id" Component={CommitteeHub} />
        </Routes>
      </div>
      <footer>
        <AppFooter />
      </footer>
    </div>
  );
}

export default App;
