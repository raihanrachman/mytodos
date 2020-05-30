import React from 'react'



export class SignButton extends React.Component {
  render(){
    return (
      <div>
        <button onClick={this.props.login} type="submit">{this.props.buttonText}</button>
      </div>
    )
  }
  
}
