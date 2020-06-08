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
    idEdited: null,
    isLoading: false,
    profileEdit: false,
    data: this.props.data
  }

  validateToken = async () => {
    const token = localStorage.getItem("token")
    !token && this.props.history.replace("/signin")
    try {
      await axios.get(`${baseUrl}/tasks`,{
        headers: {
          Authorization: token 
        }
      })
    } catch (error) {
      if(error.response.status === 401){
        return false
      }
    }
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
      alert("failed to load profile")
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

      if(res.status === 200){
        await this.setState({  
          todos: [...res.data.data.tasks]})
        await this.setState({
          viewTodos: [...this.state.todos],
          tempTask:""
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false
      })
    }
  }

  async componentDidMount(){
    this.setState({
      isLoading: true
    })
    await this.validateToken() === false ? this.props.history.replace("/signin") : 
    this.getAllTask() && this.getUserProfile() && this.setState({isLoading:false})
    
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
          this.getAllTask()
          this.filter()
        }
      }
    } catch (error) {
      alert("failed")
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
    try {
      const res = await axios({
        method: "PUT",
        url: `${baseUrl}/tasks/${id}`, 
        headers: {
          Authorization: token
        },
        data: {importance: dataImportance}
      })
      if (res.data.status === "success") {
        await this.setState({
          todos: this.state.todos.map( todo => 
            todo.id === id ?  {...todo, importance: !todo.importance} : todo
          )
        })
        this.filter()
      } 
    } catch(error) {
  
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

  profileUpdateSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const data = new FormData()
    this.state.tempUserName !== "" && data.append('name',this.state.tempUserName)
    data.append('image',this.state.selectedFile)
    this.setState({isLoading: true})

    try {
      if(this.state.selectedFile === null && this.state.tempUserName === "") {
        alert("why empty dude?")
        this.setState({isLoading: false})
      } else {

        const res = await axios({
          method:"PUT",
          url: `${baseUrl}/user`, 
          headers: {
            Authorization: token
          },
          data: data
        })


        if(res.status === 200){
          if(res.data.data.url !== undefined  && res.data.data.name !== undefined  ){
            await this.setState({  
              userName: res.data.data.name,
              userImageUrl: res.data.data.url,
              profileEdit: false,
              isLoading: false
            })
        
          } else if(res.data.data.name === undefined) {
            await this.setState({
              userImageUrl: res.data.data.url ,
              isLoading: false,
              profileEdit: false,
            })
          
          } else {
            await this.setState({  
              userName: res.data.data.name,
              isLoading: false,
              profileEdit: false,
            })
          } 
        }
  
      }
    } catch (error) {

      this.setState({isLoading: false})
    } 
  }

  getId = id => {
    this.setState({
      idEdited: id,
    })
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
 
    }
  }
  
  modal = (params,name) => {
    if(this.state.isModalActive && this.state.idEdited === params) {
      return ( 
        <input autoFocus className="input-text-edit" onChange={this.onChange} name="tempEdit" value={this.state.tempEdit}  type="text"/>
      )
    } else {
      return (<p className="task-name">{name}</p>)
    }
  }

  profileEditModal = () => {
   if (this.state.profileEdit) {
     return (
      <form className="modal-profile animated reveal" action="" onSubmit={this.profileUpdateSubmit}>
        <div className="input-username-wrapper">
          <label className="label-username" htmlFor="tempUserName">Full Name</label>
          <input autoFocus className="input-username" onChange={this.onChange} value={this.state.tempUserName} name="tempUserName"  type="text"/>
        </div>
        <input className="input-userimage" onChange={this.onChangeFile} type="file" name="selectedFile" id=""/> 
        <div className="button-wrapper">
          {this.state.isLoading ? <button className="button-username"><i className="fas fa-spinner fa-spin"></i></button> : <button className="button-username">SEND</button>}
          <p onClick={this.toggleProfileEdit} className="cancel-edit-profile">Cancel</p>
        </div>
      </form> 
     )
   } 
  }

  editClass = id =>{
   if(this.state.isModalActive && this.state.idEdited === id) {
    return "fas fa-times"
   } else {
     return "fas fa-edit"
   }
  }

  toggleProfileEdit = ()=> {
    this.setState({profileEdit : !this.state.profileEdit})
  }

  render() {
    return (
        <>
        {this.profileEditModal()}
        {this.state.profileEdit ? "" : this.state.isLoading ? <div><i className="fas fa-spinner fa-spin center"> LOADING</i></div> : 
        (<section className="section-wrapper animated reveal">
        <HeaderTodos signOut ={this.signOut} headerStyle={"header-style-dashboard white"}/>
        <section className="home-dashboard-wrapper flex">
          <section className="profile">
            <div className="profile-user flex">

            
              <div className="profile-user_image">
                <img src={this.state.userImageUrl === null ? require("../assets/images/user.svg"): this.state.userImageUrl} alt=""/>
              </div>
              <div className="profile-user_name">
                <p>{this.state.userName}</p>
                  <div className="profile-edit">
                    <p onClick={this.toggleProfileEdit}>Edit Profile</p>
                  </div>
              </div>
            
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
                      <div>
                        <input className="input-checkbox" type="checkbox" onChange={()=>this.toggleCompleted(todo.id)} checked={todo.completed} name={todo.id} id=""/>
                      </div>
                      <form className="input-text-edit-wrapper" onSubmit={this.editSubmit}>
                        {this.modal(todo.id,todo.name)}
                      </form>
                      <div className="icon-wrapper">
                        <i onClick={()=>this.toggleImportant(todo.id)} className={todo.importance ? "fas fa-star" : "far fa-star"}></i>
                        <i onClick={()=>this.toggleEdit(todo.id)} className={this.editClass(todo.id)}></i>
                        <i onClick={()=>this.delTodo(todo.id)} className="fas fa-trash-alt"></i>
                      </div>
                    </div>
                  )
                } )}
              </div>
            </section>
          </section>
        </section>
      </section>)}
        </>
      
    )
  }
}
