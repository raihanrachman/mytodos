import React from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import HomeDashboard from './pages/HomeDashboard';


const App = () => {
  return (
    <div className="App">
      <main>
        <Route path="/" component = {SignUp} exact/>
        <Route path="/signin" component = {SignUp} exact/>
        <Route path="/dashboard" component = {HomeDashboard} exact/>
        {/* <Route exact path="/dashboard">
              <HomeDashboard />
        </Route> */}
      </main>
    </div>
  );
}

export default App;
