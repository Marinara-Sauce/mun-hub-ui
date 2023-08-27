import React from 'react';
import './App.css';
import AppHeader from './components/header/header';
import AppFooter from './components/footer/footer';
import CommitteeHub from './components/committee/committeePage';
import { Route, Routes } from 'react-router-dom';
import { HeaderProvider } from './contexts/headerContext';
import SelectCommittee from './components/committee/components/selectCommittee/selectCommittee';
import SelectDelegation from './components/delegation/components/selectDelegation/selectDelegation';
import DelegationPage from './components/delegation/delegationPage';

function App() {
  return (
    <div className="App">
      <HeaderProvider>
        <header>
          <AppHeader />
        </header>
        <div className="appBody">
          <Routes>
            <Route path="/committee" Component={SelectCommittee} />
            <Route path="/committee/:id" Component={CommitteeHub} />
            <Route path="/delegation" Component={SelectDelegation} />
            <Route path="/delegation/:id" Component={DelegationPage} />
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
