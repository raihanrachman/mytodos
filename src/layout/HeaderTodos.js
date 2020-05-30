import React, { Component } from 'react'

export default class HeaderTodos extends Component {
  render() {
    return (
      <header className="header-wrapper">
        <div className="title-wrapper">
          <p>Todos</p>
        </div>
        <div className="signout-wrapper">
        <p>Sign Out</p>
        </div>
      </header>
    )
  }
}
