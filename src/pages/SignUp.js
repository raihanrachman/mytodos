import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {SignButton} from '../components/SignButton'
import '../assets/styles/SignUp.scss'
import axios from 'axios';
import HeaderTodos from '../layout/HeaderTodos'

export default class SignUp extends Component {
  state = {
    title: this.props.match.path === "/signin" ? "Sign in to Task Manager":"Create Account",
    greet: this.props.match.path === "/signin" ? "Hello There !" : "Welcome Back !",
    greetDescription: this.props.match.path === "/signin" ? "Welcome to mYToDoSs ! Sign up here !": "Sign in here !",
    buttonAside: this.props.match.path === "/signin" ? <Link className="link" to="/">SIGN UP</Link> : <Link className="link" to="/signin">SIGN IN</Link>,
    buttonForm: this.props.match.path === "/signin" ? "SIGN IN": "SIGN UP",
    formText: this.props.match.path === "/signin" ? "or use your email account" : "or use your email for registration",
    name: "",
    email: "",
    password: "",
    isLoading: false,
    token:"",
    data:{}
  }

  onChange = e => {
    this.setState({
      [e.target.name] : e.target.value,
    })
  }


  onSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('https://team-g-miniproject.herokuapp.com/api/v1/user/register',{
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
      if (res.data.status === "success") {
        this.setState({data: this.state.data})
        localStorage.setItem("token", res.data.token)
        this.props.history.push("/dashboard")
      }
    
    } catch(err) {
      console.log(err)
    }
  }

  linkSign = () => {
    this.props.match.path === "/signin" ? this.props.history.push("/") : this.props.history.push("/signin")
  }

  login = async (e) => {
    e.preventDefault()
    try {
      const res = await axios({
        method: "POST",
        url: 'https://team-g-miniproject.herokuapp.com/api/v1/user/login',
        data: {
          email: this.state.email,
          password: this.state.password
        }
      })
      if (res.data.status === "success") {
        this.setState({data: res.data})
        localStorage.setItem("token", this.state.data.data.token)
        this.props.history.push("/dashboard")
        console.log(res.data, localStorage.getItem("token"))
      }
    } catch {
      console.log("nice")
    }
  }

  render(){
    return (
      <section className="section-wrapper">
        <HeaderTodos headerStyle={"header-sign-style animated reveal animation-delay-2"} />
        <section className="sign-wrapper flex">
          
          <aside className="side-sign flex animated reveal">
            
            <h1 className="side-sign__greet">{this.state.greet}</h1>
            <p className="side-sign__description">{this.state.greetDescription}</p>
            <SignButton buttonStyle={"button-sign-style"} buttonText = {this.state.buttonAside}/>
            {/* <button onClick={this.login}>to dashboard</button> */}
          
          </aside>

          <section className="main animated fadeslideright animation-delay-1">
            <h1 className="main-title">{this.state.title}</h1>
            <div className="main-icon">
              <a href={"test"}><i className="fab fa-facebook-f"></i></a>
              <a href={"tets"}><i className="fab fa-google-plus-g"></i></a>
              <a href={"tets"}><i className="fab fa-linkedin-in"></i></a>
            </div>

            <form className="main-form" onSubmit={this.props.match.path === "/signin" ? this.login : this.onSubmit}>
              <p className="main-form__text">{this.state.formText}</p>
              <div className="main-form__input-wrapper">
                {this.props.match.path === "/signin" ? "": 
                <input required onChange={this.onChange} type="text" name="name" id="input-name" placeholder="Name" value={this.state.name}/>}
                <input required onChange={this.onChange} type="email" name="email" id="input-email"  placeholder="Email" value={this.state.email}/>
                <input required onChange={this.onChange} type="password" name="password" id="input-password"  placeholder="Password" value={this.state.password}/>
              </div>
              <SignButton buttonStyle={"button-sign-style white"}  buttonText = {this.state.buttonForm}/>
            </form>

          </section>
          
        </section>
      </section>
    )
  }
}

