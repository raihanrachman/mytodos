import React from 'react'

export class SignButton extends React.Component {
  render(){
    return (
      <div>
        <button className={`${this.props.buttonStyle}`} onClick={this.props.onSubmit} type="submit">{this.props.buttonText}</button>
      </div>
    )
  }
  
}
