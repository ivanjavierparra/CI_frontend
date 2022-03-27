import React, { Component } from 'react'
import { connect } from 'react-redux';
import cookie from 'js-cookie';

class ProfileImage extends Component {

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        this.apiarios = this.props.apiarios;
        this.colmenas = this.props.colmenas;

        // Creo mis estados.
        this.state = { 
            apiarios : this.props.apiarios,
            colmenas : this.props.colmenas,
            apicultor : this.props.apicultor,  
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
      var fecha_hora = this.state.apicultor.created_at;
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
                          src={"https://backendcolmenainteligente.herokuapp.com/api/public/img/" + this.state.apicultor.avatar}
                          alt="User profile picture"
                        />
                        <h3 className="profile-username text-center">
                            {this.state.apicultor.name + " " + this.state.apicultor.lastname}
                        </h3>
                        <p className="text-muted text-center">{  !this.state.apicultor.gender || this.state.apicultor.gender == "Male" || this.state.apicultor.gender == "Other" ? "Apicultor" : "Apicultora" } </p>
                        <p className="text-muted text-center"><small>{ "Miembro desde el " +  this.get_fecha_de_registro()  } </small></p>
                        <ul className="list-group list-group-unbordered">
                          <li className="list-group-item">
                            <b>Apiarios</b> <a className="pull-right">{this.apiarios}</a>
                          </li>
                          <li className="list-group-item">
                            <b>Colmenas</b> <a className="pull-right">{this.colmenas}</a>
                          </li>                          
                        </ul>
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