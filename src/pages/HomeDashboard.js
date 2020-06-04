import React, { Component } from 'react';
import '../assets/styles/HomeDashboard.scss';
import HeaderTodos from '../layout/HeaderTodos';
import axios from 'axios';

const baseUrl = "https://team-g-miniproject.herokuapp.com/api/v1"

export default class HomeDashboard extends Component {
  state = {
    todos : [],
    viewTodos:[],
    tempTask:"",
    tempEdit: "",
    showImportant: false,
    showCompleted: false,
    userName: "",
    userId: null,
    userImageUrl: null,
    tempUserName: "",
    isModalActive: false,
    selectedFile: null,
    idEdited: null
  }

  validateToken = async () => {
    const token = localStorage.getItem("token")
    !token && this.props.history.replace("/signin" )
  }

  getUserProfile = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios({
        method:"GET",
        url: `${baseUrl}/user`, 
        headers: {
          Authorization: token
        }
      })
      if (res.status === 200) {
        await this.setState({userName: res.data.data.userData.Profile.name})
        await this.setState({userImageUrl: res.data.data.userData.Profile.picture})
        this.setState({userId: res.data.data.userData.Profile.id})
      } 
    } catch(error) {
      console.log(error, "error")
    }
  }

  getAllTask = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.get(`${baseUrl}/tasks`,{
        headers: {
          Authorization: token 
        }
      })
      console.log(res.data)
      await this.setState({  
        todos: [...res.data.data.tasks]})
      this.setState({
        viewTodos: [...this.state.todos],
        tempTask:""
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount(){
    this.validateToken()
    this.getAllTask()
    this.getUserProfile()
  }
    
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  signOut = () => {
    localStorage.clear();
    this.props.history.replace("/signin")
  }

  filter = () => {
    this.state.showImportant && this.state.showCompleted ?
    this.setState({viewTodos: this.state.todos.filter( todo => todo.importance && todo.completed) }) 
    : 
    (this.state.showImportant ? this.setState({viewTodos: this.state.todos.filter( todo => todo.importance)})
    : 
    (this.state.showCompleted ? this.setState({viewTodos: this.state.todos.filter( todo => todo.completed)}) : this.setState({viewTodos: this.state.todos})))
  }

  onSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const data = {
      name: this.state.tempTask,
      description: null,
      due_date: "2021-10-06"
    }
    try {
      if(this.state.tempTask === "") {
        alert("why empty dude?")
      } else {
        const res = await axios({
          method:"POST",
          url: `${baseUrl}/tasks`, 
          headers: {
            Authorization: token
          },
          data: data
        })
        if(res.status === 200){
          await this.getAllTask()
          this.filter()
        }
      }
    } catch (error) {
      console.log(error,"error")
    } 
  }


  delTodo = async id => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios({
        method:"DELETE",
        url: `${baseUrl}/tasks/${id}`, 
        headers: {
          Authorization: token
        }
      })
      if (res.data.status === "success") {
        this.setState({todos: this.state.todos.filter( todo => todo.id !== id)})
        this.filter()
      } 
    } catch(error) {
      console.log(error, "error")
    } 
  }

  findTodo = id => {
    const found = this.state.todos.find( todo => todo.id === id)
    return found
  }

  toggleImportant = async id => {
    const token = localStorage.getItem("token")
    const data = this.findTodo(id)
    const dataImportance = !data.importance
    console.log(data)
    try {
      const res = await axios({
        method: "PUT",
        url: `${baseUrl}/tasks/${id}`, 
        headers: {
          Authorization: token
        },
        data: {importance: dataImportance}
      })
      console.log(res.data)
      if (res.data.status === "success") {
        await this.setState({
          todos: this.state.todos.map( todo => 
            todo.id === id ?  {...todo, importance: !todo.importance} : todo
          )
        })
        this.filter()
      } 
    } catch(error) {
      console.log(error, "error")
    }   
  }

   toggleCompleted = async id => {
    const token = localStorage.getItem("token")
    const data = this.findTodo(id)
    const dataCompleted = !data.completed
    try {
      const res = await axios({
        method: "PUT",
        url: `${baseUrl}/tasks/${id}`, 
        headers: {
          Authorization: token
        },
        data: {completed: dataCompleted}
      })
      if (res.data.status === "success") {
        await this.setState({
          todos: this.state.todos.map( todo => 
            todo.id === id ?  {...todo, completed: !todo.completed} : todo
          )
        })
        this.filter()
      } 
    } catch(error) {
      console.log(error, "error")
    }   
   }

  showImportant = async () => {
    await this.setState({showImportant: !this.state.showImportant})
    this.filter()
  }

  showCompleted = async () => {
    await this.setState({showCompleted: !this.state.showCompleted})
    this.filter()
  }

  showAll = async () => {
    await this.setState({
      viewTodos: this.state.todos
    })
    this.setState({
      showImportant: false,
      showCompleted: false,
    })
  }

  onChangeFile = e => {
    this.setState({
      [e.target.name]: e.target.files[0]
    })
  }

  profileUpdateSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const data = new FormData()
    this.state.tempUserName !== "" && data.append('name',this.state.tempUserName)
    data.append('image',this.state.selectedFile)

    try {
      if(this.state.selectedFile === null && this.state.tempUserName === "") {
        alert("why empty dude?")
      } else {
        console.log("run")
        const res = await axios({
          method:"PUT",
          url: `${baseUrl}/user/${this.state.userId}`, 
          headers: {
            Authorization: token
          },
          data: data
        })

        if(res.status === 200){
          if(res.data.data.url === true && res.data.data.name === true ){
            await this.setState({  
              userName: res.data.data.name,
              userImageUrl: res.data.data.url 
            })
          } else if(res.data.data.name === undefined) {
            await this.setState({
              userImageUrl: res.data.data.url 
            })
          } else {
            await this.setState({  
              userName: res.data.data.name
            })
          } 
        }
      }
    } catch (error) {
      console.log(error,"error")
    } 
  }

  toggleEdit = async id => {
    if (this.state.idEdited === id) {
      await this.setState({
        tempEdit: "",
        idEdited: id,
        isModalActive: !this.state.isModalActive,
        })
    } else if(this.state.idEdited === null) {
      await this.setState({
        tempEdit: "",
        idEdited: id,
        isModalActive: !this.state.isModalActive,
      })
    } else {
      await this.setState({
        tempEdit: "",
        idEdited: id,
        isModalActive: true,
      })
    }
    console.log(this.state.idEdited,this.state.isModalActive)
  }

  editSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const data = {
      name: this.state.tempEdit
    }

    try {
      if(this.state.tempEdit === "" ){
        return alert("send nudes my dudes")
      } else {
        const res = await axios({
          url:`${baseUrl}/tasks/${this.state.idEdited}`,
          method:"PUT",
          headers: {
            Authorization: token
          },
          data: data
        })
        if(res.status === 200){
          await this.setState({
            todos: this.state.todos.map( todo => 
              todo.id === this.state.idEdited ? {...todo, name: this.state.tempEdit } : todo
            ),
            isModalActive: false
          })
          
          this.filter()
        }
      }
    } catch(error) {
      console.log(error,"error")
    }
  }
  
  modal = (params,name) => {
    if(this.state.isModalActive && this.state.idEdited === params) {
      return ( 
        <form onSubmit={this.editSubmit}>
          <input autoFocus style={{width:240}} className="input-text-edit" onChange={this.onChange} name="tempEdit" value={this.state.tempEdit}  type="text"/>
        </form>
      )

    } else {
      return (<p className="task-name">{name}</p>)
    }
  }

  render() {
    return (
      <section className="section-wrapper animated reveal">
        <HeaderTodos signOut ={this.signOut} headerStyle={"header-style-dashboard white"}/>
        <section className="home-dashboard-wrapper flex">
          <section className="profile">
            <div className="profile-user flex">
              
              <div className="profile-user_image">
                <img src={this.state.userImageUrl === null ? require("../assets/images/user.svg"): this.state.userImageUrl} alt=""/>
              </div>
              <div className="profile-user_name">
                {this.state.userName}
              </div>
              <form action="" onSubmit={this.profileUpdateSubmit}>
                <input onChange={this.onChangeFile} type="file" name="selectedFile" id=""/>
                <input onChange={this.onChange} value={this.state.tempUserName} name="tempUserName" placeholder="kimi no nawa" type="text"/>
                <button>send nudes</button>
                <p>cancel</p>
              </form>
            
            </div>
            <div className="profile-filter">
              <p onClick={this.showAll}>My Day</p>
              <p className={this.state.showImportant && "red"} onClick={this.showImportant}><i className="fas fa-star"></i>Important</p>
              <p className={this.state.showCompleted && "red"} onClick={this.showCompleted}><i className="fas fa-check-double"></i>Completed</p>
            </div>
          </section>
          
          <section className="todos">
            
            <form action="" onSubmit={this.onSubmit} className="todos-form-wrapper">
              <div className="input-wrapper">
                <input onChange={this.onChange} value={this.state.tempTask} name="tempTask" placeholder="add task..." type="text"/>
                <button>+</button>
              </div>
            </form>
            <section className="todos-list">
              <div className="todos-list-label-row">
                <p>Task</p>
                <p>Important</p>
              </div>
              
              <div className="todo-wrapper">
                {this.state.viewTodos.map( todo => {
                  return(
                    <div className="todo flex" key={todo.id}>
                      <input className="input-checkbox" type="checkbox" onChange={()=>this.toggleCompleted(todo.id)} checked={todo.completed} name={todo.id} id=""/>
                      {this.modal(todo.id,todo.name)}
                      <i onClick={()=>this.toggleImportant(todo.id)} className={todo.importance ? "fas fa-star" : "far fa-star"}></i>
                      <i onClick={()=>this.toggleEdit(todo.id)} className="fas fa-edit"></i>
                      <i onClick={()=>this.delTodo(todo.id)} className="fas fa-trash-alt"></i>
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
