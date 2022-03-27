import React, { Component } from 'react'
import { connect } from 'react-redux';
import cookie from 'js-cookie';

class ProfileImage extends Component {

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        

        // Creo mis estados.
        this.state = { 
            apiarios : 0,
            colmenas : 0,
        };

        // Methods
        this.get_fecha_de_registro = this.get_fecha_de_registro.bind(this);
        
    }


    componentDidMount () {

        this._isMounted = true;
        
        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios/cantidades");
    
            
        fetch(url, {
            method: 'GET', 
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + cookie.get("token"),
            },
            signal: this.abortController.signal,
        })
        .then(response => response.json())
        .then(data => {
            
            /* Si alguien modificó el token que está en las cookies
             entonces Laravel me responderá que el token es inválido,
            por lo que cerraré automáticamente la sesión
            */
           if ( typeof data.status !== 'undefined' ) {
                console.log("Modificaste el token....", data.status);
                this.abortController.abort();
                return;
            }

            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(data); 

            this.setState({ 
                apiarios : data['apiarios'],
                colmenas : data['colmenas'],
            });
               

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed: get apiarios por ciudad", error);
            //alert("Ha ocurrido un error: " + error);
        });
        

    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }


    get_fecha_de_registro() {
      var fecha_hora = this.props.user.created_at;
      var fecha = fecha_hora.split(" ")[0];
      var hora = fecha_hora.split(" ")[0];
      
      fecha = fecha.split("-")[2] + "-" + fecha.split("-")[1] + "-" + fecha.split("-")[0];

      return fecha;
    }
    
    render() {
        return (
                    <div className="box box-primary">
                      <div className="box-body box-profile">
                        <img
                          className="profile-user-img img-responsive img-circle"
                          //src="../../dist/img/user4-128x128.jpg"
                          src={"https://backendcolmenainteligente.herokuapp.com/api/public/img/" + this.props.user.avatar}
                          alt="User profile picture"
                        />
                        <h3 className="profile-username text-center">
                            {this.props.user.name + " " + this.props.user.lastname}
                        </h3>
                        <p className="text-muted text-center">{  !this.props.user.gender || this.props.user.gender == "Male" || this.props.user.gender == "Other" ? "Administrador" : "Administradora" } </p>
                        <p className="text-muted text-center"><small>{ "Miembro desde el " +  this.get_fecha_de_registro()  } </small></p>
                        {/* <ul className="list-group list-group-unbordered">
                          <li className="list-group-item">
                            <b>Apiarios</b> <a className="pull-right">{this.state.apiarios}</a>
                          </li>
                          <li className="list-group-item">
                            <b>Colmenas</b> <a className="pull-right">{this.state.colmenas}</a>
                          </li>                          
                        </ul> */}
                        {/* <a href="#" className="btn btn-primary btn-block">
                          <b>Follow</b>
                        </a> */}
                      </div>{/* /.box-body */}
                      {/* /.box */}
                    </div>
                    
        )
    }
}

// Acá obtengo de REDUX el usuario actual.
const mapStateToProps = state => {
    return {
      user: state.auth.user
    };
  };
  
  
  export default connect(mapStateToProps,null)(ProfileImage)