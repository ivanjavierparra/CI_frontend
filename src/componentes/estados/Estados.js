import React, { Component } from 'react';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import cookie from 'js-cookie';
import { connect } from 'react-redux';
import Tarjetas from './Tarjetas';
import MapaApiarios from './MapaApiarios';
import ContenedorGraficos from "./ContenedorGraficos";


class Estados extends Component {
  
  constructor(props) {  
      super(props);

      this._isMounted = false;
      //init controller
      this.abortController = new window.AbortController();

      this.state = {
        apiario: 0,
        direccion_chacra : "", 
        variable : "",
        showContenedorGraficos : false,
      }

      // Methods
      this.showContenedorGraficos = this.showContenedorGraficos.bind(this);
      this.hideContenedorGraficos = this.hideContenedorGraficos.bind(this);
      
  }



  componentDidMount () {

        this._isMounted = true;

        var url = new URL("http://localhost:8000/api/colmenas/dashboard");
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
            // if ( typeof data.status !== 'undefined' ) {
            //    console.log("Modificaste el token....", data.status);
            //    cookie.remove("token");
            //    this.abortController.abort();
            //    this.props.logout();
            //    return;
            // }
            

            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log('Home', data); 

            this.setState({ 
                
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

    showContenedorGraficos = (apiario_id, direccion_chacra, variable) => {
      console.log("jlfad",apiario_id, variable);
      this.setState({
        showContenedorGraficos: true,
        apiario: apiario_id,
        direccion_chacra : direccion_chacra,
        variable : variable,
      });
    }
  
    hideContenedorGraficos() {
      this.setState({
        showContenedorGraficos: false,
        apiario_seleccionado: [],
        direccion_chacra : "",
        variable : "",
      });
      this.componentDidMount();
    }

    render() {

        if( this.state.showContenedorGraficos ) {
          return (
              <ContenedorGraficos apiario={this.state.apiario} variable={this.state.variable} direccion_chacra={this.state.direccion_chacra} actionHide={this.hideContenedorGraficos} />
          )
        }

        return (
          

            <div>
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <h1>
                          Estado Actual de mis Apiarios
                          <br/>
                          <small>Estados</small>
                          <hr/>
                        </h1>
                        <ol className="breadcrumb">
                          <li><i className="fa fa-heartbeat" /> Estados</li>
                          <li className="active"><a href="#">Estados de los apiarios</a></li>
                        </ol>
                    </section>
                    {/* Main content */}
                    <section className="content">


                      


                      {/* ----------------------------- TARJETAS ------------------------------  */}

                      <div className="row">
                        <div className="col-xs-12">
                          
                          <Tarjetas />
                            

                        </div>{/* /.col */}
                      </div>{/* /.row */}


                      {/* ----------------------------- MAPA APIARIO ------------------------------  */}
                      
                      <MapaApiarios action={this.showContenedorGraficos} />


                      


                    </section>{/* /.content */}
                </div>{/* /.content-wrapper */}
            </div>

            
        )
    }
}



// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = dispatch => {
  return {
      logout: () => dispatch({type:'SET_LOGOUT'})
  };
};
export default connect(null,mapDispatchToProps)(Estados)