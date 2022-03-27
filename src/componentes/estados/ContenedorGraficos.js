import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Grafico from './Grafico';
import GraficoSenial from './GraficoSenial';
import cookie from 'js-cookie';
export default class ContenedorGraficos extends Component {


    constructor(props) {
       
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        

        // Defino las variables de la clase.
        this.state = {
          apiario: this.props.apiario,
          direccion_chacra : this.props.direccion_chacra,
          variable: this.props.variable,
          apiario_posta : [],
          colmenas: [], 
        }

        // Methods
        this.crear_graficos = this.crear_graficos.bind(this);
        this.crear_titulo_variable = this.crear_titulo_variable.bind(this);
        this.setBoxTitle = this.setBoxTitle.bind(this);
        this.handleClickTyH = this.handleClickTyH.bind(this);
        this.handleClickSenal = this.handleClickSenal.bind(this);
      }
      
      /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            direccion_chacra : nextProps.direccion_chacra,
            variable : nextProps.variable,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    setBoxTitle(apiario) {
        var text = apiario['direccion_chacra'];
        if( !apiario['nombre_fantasia'] ) return text;
        text = apiario['nombre_fantasia'] + " (" + text + ")";
        return text;
    }

    /**
     * 
     * @param {*} event 
     */
    handleClickTyH(event) {
        //this.props.history.push("/revisaciones/tempyhum");
    }
    
    /**
     * 
     * @param {*} event 
     */
    handleClickSenal(event) {
        //this.props.history.push("/revisaciones/signal");
    }

    /**
     *  Busco las colmenas del apiario.
     * 
     * 
     */
    componentDidMount() {

        this._isMounted = true;

        console.log("testvalue", this.state.apiario);
        console.log("testvalue", this.state.direccion_chacra);
        console.log("testvalue", this.state.variable);
        
        var url = 'http://localhost:8000/api/apiarios/'+ this.state.apiario + '/colmenas';     
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

            this.setState(
                {
                    apiario_posta: data['apiario'],
                    colmenas: data['colmenas'],
                    titulo: this.setBoxTitle(data['apiario']),
                },
                function() { 
                    console.log("Colmenas encontradas: " + JSON.stringify(this.state.colmenas));
                    this.crear_graficos();
                }
            );
            
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Falló al tratar de obtener colmenas del apiario.", error);
            //alert("Ha ocurrido un error al tratar de obtener las colmenas del apiarios: " + error);
        }); 

    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    
    crear_titulo_variable() {
        if( this.state.variable == "" ) return "";
        if( this.state.variable == "temperatura" ) return "Temperatura"; 
        if( this.state.variable == "humedad" ) return "Humedad";
        if( this.state.variable == "senial" ) return "Señal";
    }
    

    /**
     * Recorre las colmenas del apiario seleccionado, y delega al componente Chart que renderice 
     * el gráfico adecuado en base a los parámetros pasados.
     * 
     * 
     */
    crear_graficos() {
        
        var graficos = [];
        var colmenas = this.state.colmenas;

        ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));

        var tipoAccion = {
            accion: 'Rango',
            tipo: '7',
            fecha_actual: '',
            fecha_pasada: '',
            horario_desde: 'Todo el dia', // 'Todo el dia'
            horario_hasta: 'Todo el dia',
            rango: "120", // Es el Rango horario en minutos, o sea, en este caso, 2 horas: [00:00, 02:00, ..., 20:00, 22:00]
        };
           
        if( colmenas.length == 0 ) {
            document.getElementById("txt-mensaje-no-hay-colmenas-" + this.state.apiario).style.display = "block";
            return;
        }
        
        if( this.state.variable == "temperatura" ) {
            for(var i=0; i<colmenas.length; i++) {
                graficos.push(<Grafico apiario={this.state.apiario} colmena={colmenas[i]} key={colmenas[i]['id']} variable={"temperatura"} tipoAccion={tipoAccion} variable_ambiental={""} rango={60} titulo={"Últimos 7 días"} tipo_grafico={"line"} />);
            }
        }
        else if( this.state.variable == "humedad" ){
            for(var i=0; i<colmenas.length; i++) {
                graficos.push(<Grafico apiario={this.state.apiario} colmena={colmenas[i]} key={colmenas[i]['id']} variable={"humedad"} tipoAccion={tipoAccion} variable_ambiental={""} rango={60} titulo={"Últimos 7 días"} tipo_grafico={"line"} />);
            }
        }
        else {
            for(var i=0; i<colmenas.length; i++) {
                graficos.push(<GraficoSenial apiario={this.state.apiario} colmena={colmenas[i]} key={colmenas[i]['id']} variable={"senial"} tipoAccion={tipoAccion} variable_ambiental={""} rango={60} titulo={"Últimos 7 días"} tipo_grafico={"stepLine"} />);
            }
        }
          

        ReactDOM.render(graficos, document.getElementById('contenedor'));
    }


    
    

    

    
    render() {
        
        
        console.log("Apiarioooo", this.state.apiario);
        return (
            <div>
  
                <div className="content-wrapper">

                      {/* Content Header (Page header) */}
                      <section className="content-header">
                          <h1>
                              Apiario {this.state.direccion_chacra} 
                              <br/>
                              <small>{this.crear_titulo_variable()}</small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><a href="fake_url"><i className="fa fa-dashboard" /> Estados</a></li>
                              <li className="active">Apiario</li>
                          </ol>
                        
                          {/* Row: Cabecera */}
                          <div className="row" style={{marginTop: 10}}>
                          
                                {/* ComboBox Apiario' */}
                                <div className="form-group">
                                    <label htmlFor="txt-apiario" className="col-md-12">Apiario</label>
                                    <div className="col-md-3">
                                        <input type="text" className="form-control" id="txt-apiario" name="txt-apiario" value={this.state.titulo || ''} disabled />
                                        <br />
                                    </div>
                                </div>

                                {/* ComboBox Variable' */}
                                <div className="form-group">
                                    <label htmlFor="txt-variable" className="col-md-12">Variable de la Colmena</label>
                                    <div className="col-md-3">
                                    <input type="text" className="form-control" id="txt-variable" name="txt-variable" value={this.crear_titulo_variable()} disabled />
                                        <br />
                                    </div>
                                </div>

                                
                                <div id="mensajes-boton-buscar" className="form-group">
                                    <div className="col-xs-12 col-md-12 col-lg-12">
                                        <br />
                                        <label> <small> * Se muestran datos desde hace 7 días. </small></label> <br></br>
                                        <label> <small> ** Ir a "Revisaciones" para mayor información sobre el apiario. </small></label>
                                        <br />
                                        { this.state.variable == "temperatura" || this.state.variable == "humedad" ?
                                        <Link to={{pathname: "/revisaciones/tempyhum"}} data-key={"abcde"}><button  className="btn btn-xs btn-primary btn-flat pull-left" data-toggle="tooltip" data-placement="top" onClick={this.handleClickTyH} title="Ir a Temperatura y Humedad"><strong> Temperatura y Humedad <i className="fa fa-chevron-circle-right" /></strong></button></Link>
                                        :
                                        <Link to={{pathname: "/revisaciones/signal"}} data-key={"abcdee"}><button  className="btn btn-xs btn-primary btn-flat pull-left" data-toggle="tooltip" onClick={this.handleClickSenal} data-placement="top" title="Ir a Señal"><strong> Señal <i className="fa fa-chevron-circle-right" /></strong></button></Link>
                                        }
                                    </div>
                                    
                                </div>
                                

                                 {/* Btn Volver */}
                                 <div className="form-group">
                                     <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                    <div className="col-xs-3 col-md-3 col-lg-3">
                                        <button style={{display:"none"}} id="btn-buscar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-left"><i className="fa fa-search" /> <strong>Buscar datos &nbsp;</strong></button>
                                    </div>                                  
                                    <div className="col-xs-8 col-md-8 col-lg-9">
                                        <button  className="btn btn-sm btn-primary btn-flat pull-right" onClick={this.props.actionHide} data-toggle="tooltip" data-placement="top" title="Editar"><i className="fa fa-chevron-circle-left" /> <strong> Volver </strong></button>
                                    </div>
                                </div>                                

                                <div id="mensajes-boton-buscar" className="form-group">
                                    <div className="col-xs-12 col-md-12 col-lg-12">
                                    <br />
                                    <label id={"txt-mensaje-no-hay-colmenas-" + this.state.apiario} style={{display:"none",color:"red"}}> <small> (*) Este apiario no tiene colmenas. </small></label> <br/>
                                    </div>
                                </div>
                                
                        </div>
                        
                        <hr/>
                    </section>
      
                    {/* Main content */}
                    <section className="content">
                        <div id="contenedor" className="row"> 
                           
                        </div>
                        {/* /.row */}
                    </section>
                    {/* /.content */}

              </div>
          </div>

        )
    }
}

