import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import  {data} from '../DummyData';
import '../assets/styles/HomeDashboard.scss'
import HeaderTodos from '../layout/HeaderTodos'

export default class HomeDashboard extends Component {
  state = {
    todos : [],
    viewTodos:[],
    tempTask:"",
    tempEdit: "",
  }

  componentDidMount(){
    this.setState({
      todos: [...data],
      viewTodos: [...data],
    })
  }
    
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const data = {
      id: this.state.todos.length + 1,
      task: this.state.tempTask,
      isCompleted: false,
      isImportant: false,
      isEdit: false
    }
    console.log(data)
    this.state.tempTask === "" ? alert("why empty dude?") :
    this.setState({
      todos: [...this.state.todos, data],
      tempTask: ""
    })
  }

  delTodo = async id => {
    await this.setState({todos: this.state.todos.filter( todo => todo.id !== id)})
    this.setState({viewTodos: this.state.todos})
  }

  toggleImportant = async id => {
    await this.setState({
      todos: this.state.todos.map( todo => 
        todo.id === id ?  {...todo, isImportant: !todo.isImportant} : todo
      )
    })
    this.setState({
      viewTodos: this.state.todos
    })
  }

  showImportant = async () => {
    await this.setState({
      viewTodos: this.state.todos.filter( todo => 
        todo.isImportant
      )
    })
    console.log(this.state.viewTodos)
  }

  showAll = () => {
    this.setState({
      viewTodos: this.state.todos
    })
    console.log(this.state.viewTodos)
  }

  toggleEdit = id => {}

  render() {
    return (
      <section className="section-wrapper animated reveal">
        <HeaderTodos/>
        <section className="home-dashboard-wrapper flex">
          <section className="profile">
            <Link to="/">to home</Link>
            <div className="profile-user">
              <div className="profile-user_image">
                image
              </div>
              <div className="profile-user_name">
                raihan raihan
              </div>
            </div>
            <div className="profile-selection">
              <p onClick={this.showAll}>My Day</p>
              <p onClick={this.showImportant}>Important</p>
              <p>Completed</p>
            </div>
          </section>
          
          <section className="todos">
            <form action="" onSubmit={this.onSubmit} className="todos-form-wrapper">
              <div className="input-wrapper">
                <input onChange={this.onChange} value={this.state.tempTask} name="tempTask" placeholder="add task" type="text"/>
                <button>+</button>
              </div>
            </form>
            <section className="todos-list">
              <div className="todo-wrapper">
                {this.state.viewTodos.map( todo => {
                  return(
                    <div className="todo">
                      <input type="checkbox" name="checkbox" id=""/>
                      <p className="task-name">{todo.task}</p>
                      <p onClick={()=>this.toggleImportant(todo.id)} className={todo.isImportant && "red"}>star</p>
                      {/* <input onChange={this.onChange} value={todo.isEdit ? this.state.tempTas : todo.task} name="tempEdit" type="text"/> */}
                      <p>edit?</p>
                      <p onClick={()=>this.delTodo(todo.id)}>bin</p>
                    </div>
                  )
                } )}
              </div>
            </section>
          </section>
        </section>
      </section>
    )
  }
}
