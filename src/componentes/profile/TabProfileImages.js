import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import store from "../../store/index"
import axios from 'axios';

// Variables for cancel ajax axios request.
const CancelToken = axios.CancelToken;
let cancel;

class TabProfileImages extends Component {

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        
        // Creo mis estados.
        this.state = { 
            avatar: this.props.user.avatar,
            errors:[],
        };

        // Methods
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }


    componentDidMount () {
        this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

      
    /**
     * Envia el archivo al backend.
     * @param {*} e 
     */
    onFormSubmit(e) {

      e.preventDefault();

      const data = new FormData();
      data.append('profile_pic', this.state.avatar);
 
      var token = cookie.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
     .post("http://localhost:8000/api/auth/avatar", data, { }) // controller will handle the upload etc
     .then(response => {
          console.log(response.data);                
          console.log(response.statusText);     

          // Obtengo mis nuevos datos
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          axios.post("http://localhost:8000/api/auth/me")
          .then(res => {
                console.log("buenas!!");
                alert("Imagen actualizada!");
                // Actualizo REDUX y las cookies con los datos nuevos del usuario.
                store.dispatch({ type: "SET_LOGIN", payload: res.data });
                cookie.remove("user");
                cookie.set('user',res.data); 
          })
          .catch(e => this.setState({ errors: e.response.data.errors }));       
     })
     .catch(function (error) {                   
         console.log('Error', error.message)                
     })
    }

    
    /**
     * 
     * @param {*} event 
     */
    onChange(event) {
      console.log(event.target.files[0]);
      
      // Previsualizacion de la imagen
      var reader = new FileReader();
      reader.onload = function(e) {
          document.getElementById("imagen_cargada").src = e.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);

      // Seteo el archivo seleccionado por el usuario al state "avatar" 
      this.setState({
        avatar: event.target.files[0],
      })
    }    

    render() {
        
        return (
                        
                        <form className="form-horizontal" onSubmit={this.onFormSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label
                                    htmlFor="imagen_cargada"
                                    className="col-sm-2 control-label"
                                >
                                    Imagen de Perfil
                                </label>
                                <div className="col-sm-10"> 
                                <img id="imagen_cargada" 
                                      src={"http://localhost:8000/api/public/img/" + this.props.user.avatar}
                                      alt="avatar" className="img-fluid" style={{borderRadius:150,height:168, width:168}} />
                                </div>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="avatar"
                                className="col-sm-2 control-label"
                              >
                                
                              </label>
                              <div className="col-sm-10">
                                <p> 
                                    <input 
                                        id="avatar" 
                                        type="file" 
                                        name="avatar" 
                                        accept="image/png, .jpeg, .jpg, image/gif"
                                        onChange={this.onChange}
                                    /> 
                                    </p>
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
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(TabProfileImages)