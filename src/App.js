import React from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import HomeDashboard from './pages/HomeDashboard';




const App = () => {
  return (
    <div className="App">
      <Route path="/" component = {SignUp} exact/>
      <Route path="/signup" component = {SignUp} exact/>
      <Route path="/signin" component = {SignUp} exact/>
      <Route exact path="/dashboard">
            <HomeDashboard />
      </Route>
    </div>
  );
}

export default App;
