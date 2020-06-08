import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import SignUp from '../pages/SignUp';
import HomeDashboard from '../pages/HomeDashboard';

export default class Routes extends Component {
  state = {
    name: "tets"
  }

  render() {
    return (
      <div>
        <Route path="/" component = {SignUp} exact/>
        <Route path="/signin" component = {SignUp} exact/>
        <Route path="/dashboard" component = {HomeDashboard} exact/>
      </div>
    )
  }
}