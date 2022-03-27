import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import store from "../../store/index"
import axios from 'axios';

// Variables for cancel ajax axios request.
const CancelToken = axios.CancelToken;
let cancel;

class TabSettings extends Component {

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        
        
        
        // Creo mis estados.
        this.state = { 
            email : this.props.user.email,
            name: this.props.user.name,
            lastname: this.props.user.lastname,
            numero_renapa: this.props.user.numero_renapa,
            city: this.props.user.city,
            birthdate: this.props.user.birthdate,
            gender: this.props.user.gender,
            avatar: this.props.user.avatar,
            isDisabledEmail: true,
            errors:[],
        };

        // Methods
        this.fileInput = React.createRef();
      }


    componentDidMount () {

        this._isMounted = true;
            
        

    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

      handleInput = e => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
      };


      handleForm = e => {
           
        e.preventDefault();

        if (cancel !== undefined) {
            cancel();
        }

        // DATA a enviar
        const data = {
          name: this.state.name,
          lastname: this.state.lastname,
          birthdate: this.state.birthdate,
          city: this.state.city,
          gender: this.state.gender,
          numero_renapa : this.state.numero_renapa,
          //avatar: this.state.avatar
        };    
        
         var token = cookie.get("token");
         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
         axios.post("http://localhost:8000/api/auth/edite", data, {cancelToken: new CancelToken(function executor(c) 
                {
                    cancel = c;
                })
            })
           .then(res => {
    
            // Muestro lo devuelto 
            console.log(res);
            // Elimino la cookie que tiene los datos del usuario, porque ya son obsoletos.
            cookie.remove("user");
             
            if (token) {
                 
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                axios.post("http://localhost:8000/api/auth/me")
                .then(res => {
                      alert("Datos actualizados!");
                     // Actualizo REDUX y las cookies con los datos nuevos del usuario.
                     store.dispatch({ type: "SET_LOGIN", payload: res.data });
                     cookie.set('user',res.data);
                })
                .catch(e => this.setState({ errors: e.response.data.errors }));
             }
              

           })
           .catch((e) => {
                if (axios.isCancel(e)) {
                    console.log('post Request canceled');
                }
               this.setState({ errors: e.response.data.errors })
            });
    
      };

      
     


      

      

    render() {
        
        return (
                        
                        <form className="form-horizontal" onSubmit={this.handleForm}>
                            <div className="form-group">
                              <label
                                htmlFor="email"
                                className="col-sm-2 control-label"
                              >
                                Email
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  id="email"
                                  placeholder="Email"
                                  value={this.state.email}
                                  disabled={this.state.isDisabledEmail}
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="inputName"
                                className="col-sm-2 control-label"
                              >
                                Nombre
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  id="name"
                                  placeholder="Nombre"
                                  value={this.state.name}
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="lastname"
                                className="col-sm-2 control-label"
                              >
                                Apellido
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="lastname"
                                  id="lastname"
                                  placeholder="Apellido"
                                  value={this.state.lastname}
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="lastname"
                                className="col-sm-2 control-label"
                              >
                                N° de RENAPA
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="numero_renapa"
                                  id="numero_renapa"
                                  placeholder="Número de RENAPA"
                                  value={this.state.numero_renapa != null ? this.state.numero_renapa : ""}
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="city"
                                className="col-sm-2 control-label"
                              >
                                Ciudad donde vive
                              </label>
                              <div className="col-sm-10">
                                <select 
                                    className="form-control" 
                                    id="city" 
                                    name="city" 
                                    //defaultValue={'Seleccionar'}
                                    value={this.state.city}
                                    onChange={this.handleInput}
                                >
                                    <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                    <option key={1} value={'Puerto Madryn'}>Puerto Madryn</option> 
                                    <option key={2} value={'Rawson'}>Rawson</option> 
                                    <option key={3} value={'Trelew'}>Trelew</option>
                                    <option key={4} value={'Gaiman'}>Gaiman</option>
                                    <option key={5} value={'Dolavon'}>Dolavon</option>
                                    <option key={6} value={'28 de Julio'}>28 de Julio</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="birthdate"
                                className="col-sm-2 control-label"
                              >
                                Fecha de Nacimiento
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="date"
                                  className="form-control"
                                  name="birthdate"
                                  id="birthdate"
                                  defaultValue={this.state.birthdate}
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="gender"
                                className="col-sm-2 control-label"
                              >
                                Sexo
                              </label>
                              <div className="col-sm-10">
                                <div className="radio">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Male"
                                            checked={this.state.gender === 'Male'} 
                                            onChange={this.handleInput}
                                        />
                                     Masculino
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Female"
                                            checked={this.state.gender === 'Female'} 
                                            onChange={this.handleInput}
                                        />
                                     Femenino
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Other" 
                                            checked={this.state.gender === 'Other'} 
                                            onChange={this.handleInput}
                                        />
                                     Otro
                                    </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-primary btn-flat">
                                 <strong> Guardar </strong>
                                </button>
                              </div>
                            </div>
                          </form>
        )
    }
}


// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({type:'SET_LOGOUT'})
    };
  };

// Acá obtengo de REDUX el usuario actual.
const mapStateToProps = state => {
    return {
      user: state.auth.user
    };
  };
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(TabSettings)