import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {SignButton} from '../components/SignButton'
import '../assets/styles/SignUp.scss'
import axios from 'axios';
import HeaderTodos from '../layout/HeaderTodos'

export default class SignUp extends Component {
  state = {
    title: this.props.match.path === "/signin" ? "Sign in to Task Manager":"Create Account",
    greet: this.props.match.path === "/signin" ? "HELLO THERE!" : "WELCOME BACK!",
    greetDescription: this.props.path === "signin" ? "Don't have account? Sign up here!": "Sign in here!",
    buttonAside: this.props.match.path === "/signin" ? <Link to="/signup">SIGN UP</Link> : <Link to="/signin">SIGN IN</Link>,
    buttonForm: this.props.match.path === "/signin" ? "SIGN IN": "SIGN UP",
    formText: this.props.match.path === "/signin" ? "or use your email account" : "or use your email for registration",
    name: "",
    email: "",
    password: "",
    user: {
      useremail:"",
      userpassord:""
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name] : e.target.value,
      // name: e.target.value,
      // email: e.target.value
    })
  }

  onSubmit = async e => {
    e.preventDefault()
    console.log("run")
    // try {
    //   const res = await axios.post('https://team-g-miniproject.herokuapp.com/api/v1/register')
    //   console.log(res)
    // }catch(err) {
    //   console.log(err)
    // }
   
    const res = await axios.post('https://team-g-miniproject.herokuapp.com/api/v1/register',{
      headers : {'Content-Type': 'application/json'},
      body : {
        email : this.state.email,
	      password : this.state.password
      }
    })
    console.log(res)
  }

  login = () => {
    this.props.history.push("/dashboard")
  }

  render(){
    console.log(this.props.match.path)
    return (
      <main className="main-wrapper animated reveal">
        <HeaderTodos/>
        <aside className="side-sign animated reveal animation-delay-2">
          <h2 className="side-sign__greet">{this.state.greet}</h2>
          <p className="side-sign__description">{this.state.greetDescription}</p>
          <SignButton buttonText = {this.state.buttonAside}/>
          <button onClick={this.login}>to dashboard with push fuction for login</button>
        </aside>
        <section className="main animated reveal animation-delay-1">
          <h1 className="side-sign_title">{this.state.title}</h1>
          <div className="icon">
            <a href=""><i className="fab fa-facebook-f"></i></a>
            <a href=""><i className="fab fa-google-plus-g"></i></a>
            <a href=""><i className="fab fa-linkedin-in"></i></a>
          </div>
          <form className="" onSubmit={this.onSubmit}>
            <p className="form-text">{this.state.formText}</p>
            <div className="input-wrapper">
              {this.props.match.params.sign === "signin" ? "": 
              <input required onChange={this.onChange} type="text" name="name" id="input-name" placeholder="Name" value={this.state.name}/>}
              <input required onChange={this.onChange} type="email" name="email" id="input-email"  placeholder="Email" value={this.state.email}/>
              <input required onChange={this.onChange} type="password" name="password" id="input-password"  placeholder="Password" value={this.state.password}/>
            </div>
            <SignButton click = {this.login} buttonText = {this.state.buttonForm}/>
          </form>
        </section>
      </main>
    )
  }
}
