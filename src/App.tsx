import React from 'react';
import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import CommitteeHub from './components/committee/committeePage';
import { Route, Routes } from 'react-router-dom';
import { HeaderProvider } from './contexts/headerContext';

function App() {
  return (
    <div className="App">
      <HeaderProvider>
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
      </HeaderProvider>
    </div>
  );
}

export default App;
