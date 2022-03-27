import React, { Component } from 'react';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import cookie from 'js-cookie';
import { connect } from 'react-redux';
import Tarjetas from './Tarjetas';
import MapaApiarios from './MapaApiarios';
import ChartApiariosCiudad from './ChartApiariosCiudad';
import UltimosApicultores from './UltimosApicultores';
import ApicultoresComplicados from './ApicultoresComplicados';
import ApicultoresMasColmenas from './ApicultoresMasColmenas';

class AdminHome extends Component {
  
  constructor(props) {  
      super(props);

      this._isMounted = false;
      //init controller
      this.abortController = new window.AbortController();

      this.state = {
          
      }

      // Methods
      
  }



  componentDidMount () {

        this._isMounted = true;

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/colmenas/dashboard");
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
               cookie.remove("token");
               this.abortController.abort();
               this.props.logout();
               return;
            }
            

            
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

    render() {

        return (
          

            <div>
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <h1>
                          Bienvenido
                          <br/>
                          <small>Página Principal</small>
                          <hr/>
                        </h1>
                        <ol className="breadcrumb">
                          <li><a href="#"><i className="fa fa-home" /> Inicio</a></li>
                          <li className="active"><a href="#">Home</a></li>
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
                      
                      <MapaApiarios />


                      {/* ----------------------------- CHART APIARIOS POR CIUDAD + ULTIMOS APICULTORES ------------------------------  */}

                      <div className="row">
                            <ChartApiariosCiudad />

                            <UltimosApicultores />                            
                      </div>

                      
                      {/* ----------------------------- APICULTORES MAS COMPLICADOS + APICULTORES CON MAS COLMENAS ------------------------------  */}

                      <div className="row">
                          <ApicultoresComplicados />

                          <ApicultoresMasColmenas />
                      </div>


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
export default connect(null,mapDispatchToProps)(AdminHome)