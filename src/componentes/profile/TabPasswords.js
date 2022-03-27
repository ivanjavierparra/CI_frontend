import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import store from "../../store/index"
import axios from 'axios';

// Variables for cancel ajax axios request.
const CancelToken = axios.CancelToken;
let cancel;

class TabPasswords extends Component {

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        
        
        
        // Creo mis estados.
        this.state = { 
            password_actual: "",
            password_nuevo: "",
            password_confirmacion: "",
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

        var result = window.confirm("Está a punto de cambiar su contraseña. ¿Está seguro?");
        if (!result) return;
           
        e.preventDefault();

        if (cancel !== undefined) {
            cancel();
        }

        // Validamos
        if( !this.state.password_actual ) return alert("Ingrese password actual");
        if( !this.state.password_nuevo ) return alert("Ingrese password nuevo");
        if( !this.state.password_confirmacion ) return alert("Ingrese password confirmación");
        if( this.state.password_nuevo != this.state.password_confirmacion  ) return alert("Confirmación no coincide.");


        // DATA a enviar
        const data = {
          password_actual: this.state.password_actual, 
          password_nuevo: this.state.password_nuevo,
          password_confirmacion: this.state.password_confirmacion,
        };    
        
         var token = cookie.get("token");
         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
         axios.post("https://backendcolmenainteligente.herokuapp.com/api/auth/password", data, {cancelToken: new CancelToken(function executor(c) 
                {
                    cancel = c;
                })
            })
           .then(res => {
    
            // Muestro lo devuelto 
            console.log(res);
            // Elimino la cookie que tiene los datos del usuario, porque ya son obsoletos.
            cookie.remove("user");

            alert("Contraseña cambiada!.");
             
            if (token) {
                 
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                axios.post("https://backendcolmenainteligente.herokuapp.com/api/auth/me")
                .then(res => {

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
                                htmlFor="password_actual"
                                className="col-sm-2 control-label"
                              >
                                Contraseña Actual
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password_actual"
                                  id="password_actual"
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="password_nuevo"
                                className="col-sm-2 control-label"
                              >
                                Contraseña Nueva
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password_nuevo"
                                  id="password_nuevo"
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="password_confirmacion"
                                className="col-sm-2 control-label"
                              >
                                Repetir Contraseña Nueva
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password_confirmacion"
                                  id="password_confirmacion"
                                  onChange={this.handleInput}
                                />
                              </div>
                            </div>
                            
                            <div className="form-group">
                              <div className="col-sm-offset-2 col-sm-10">
                                <a href="#" className="pull-right">Olvidé mi contraseña</a>
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
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(TabPasswords)