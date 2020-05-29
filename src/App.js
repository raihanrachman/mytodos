import React from 'react';
import {SignUp} from './pages/SignUp';
import {Route} from 'react-router-dom';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Route path="/" component = {SignUp} exact/>
      <Route path="/:sign" component = {SignUp} exact/>
    </div>
  );
}

export default App;
