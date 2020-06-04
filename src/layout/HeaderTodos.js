import React, { Component } from 'react'

export default class HeaderTodos extends Component {
  render() {
    return (
      <header className={`${this.props.headerStyle} header-wrapper`}>
        <div className="title-wrapper">
          <p>mYToDoSs</p>
        </div>
        <div onClick={this.props.signOut} className="signout-wrapper">
          <p>Sign Out</p>
        </div>
      </header>
    )
  }
}
