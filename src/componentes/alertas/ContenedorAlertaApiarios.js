import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import AlertaApiarios from './AlertaApiarios';
import cookie from 'js-cookie';
export default class ContenedorAlertaApiarios extends Component {

    

    /**
     * Constructor: defino propiedades, estados y métodos.
     * @props propiedades que me pasa el padre como parámetros.
     */ 
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Creo mis estados.
        this.state = { 
          ciudad : !this.props.location.state ? {ciudad:"Trelew"} : this.props.location.state['ciudad'], // {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}  
          apiarios : [],
        };


        // Methods
        this.refrescarComponente = this.refrescarComponente.bind(this);
        
    }



    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
          ciudad : nextProps.location.state['ciudad'],
      }, //() => this.componentDidMount() 
      ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }


    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

        this._isMounted = true;
        document.getElementById("titulo-contenedor").innerText = "Estado de los Apiarios en " + this.state.ciudad;
        
        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios/ciudad");
        var params = {
                        ciudad: this.state.ciudad, 
                    };
        
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
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
              //var token = cookie.get("token");
              //if(token) cookie.remove("token");
              return;
            }

            console.log("Datos encontrados: ", data);

            this.setState(
                {
                    apiarios: data,
                },
                function() { 
                    // Naranja fanta....
                }
            );


            var apiarios = [];
            ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));
            
            for( var i=0; i<data.length; i++ ) {
                apiarios.push(<AlertaApiarios apiario={data[i]} />);
            }

            ReactDOM.render(apiarios, document.getElementById('contenedor'));
            
            
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request apiarios failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
        
        
   }


   refrescarComponente() {
      window.location.reload(true);
   }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    rerenderParentCallback() {
        console.log('Entre al callback!!!!!!');
        //this.forceUpdate();
        window.location.reload();
    }

    render() {

      

          
        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Alertas 
        <br/>
        <small> <span id="titulo-contenedor"> Estado de los Apiarios en Trelew </span></small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-exclamation-triangle" /> Alertas</a></li>
        <li className="active"><a href="#">Alertas por Apiarios</a></li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">

        
    <div className="row">
        <div className="col-md-12">  
          <div id="contenedor"> 

                                
          </div> {/* /.row contenedor */}
        </div>
    </div>
    
    

          
            

    </section>{/* /.content */}
  </div>{/* /.content-wrapper */} 
</div>

        )
    }
}
