import React from 'react'

export class SignButton extends React.Component {
  render(){
    return (
      <div>
        <button type="submit">{this.props.buttonText}</button>
      </div>
    )
  }
  
}
