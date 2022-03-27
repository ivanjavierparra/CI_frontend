import React, { Component } from 'react'
import CanvasJSReact from './../../assets/canvasjs.react';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
const $ = require('jquery')

var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class ColmenaInfo extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            revisaciones : [],
            datos : [],
            data : {  
              columns: [
                {
                  label: <span>Colmena</span>,
                  field: 'colmena', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Temperatura</span>,
                  field: 'temperatura', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Humedad</span>,
                  field: 'humedad', 
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Fecha</span>,
                  field: 'fecha', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Hora</span>,
                  field: 'hora', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
              ],
              rows: [
                {humedad : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
        }

        // Methods
        this.completarTabla = this.completarTabla.bind(this);
        this.obtenerUltimaRevisacion = this.obtenerUltimaRevisacion.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            colmena : nextProps.colmena,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    
    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

        this._isMounted = true;

        var url = new URL("http://localhost:8000/api/revisacion/apiario/colmena/ultima_semana");
        var params = {
                        apiario: this.state.apiario, 
                        colmena: this.state.colmena['id'], 
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
            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 

            this.setState(
            {
                revisaciones: data['datos'],

            },function(){
                
                
                var bandera = this.obtenerUltimaRevisacion();
                if( bandera ) {
                    this.completarTabla();
                    document.getElementById("contenedor-detalle-colmena").style.display = "block";
                }
                else {
                    document.getElementById("contenedor-detalle-colmena").style.display = "none";
                }
                
            });
            
        })
        .catch(function(error) {
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
        
    }


    obtenerUltimaRevisacion() {
        if( !this.state.revisaciones ) {alert("No hay registros de Temperatura y Humedad en los últimos 7 días.");return false;} // puede venir vacio... :)
        if ( this.state.revisaciones.length == 0 ) {alert("No hay registros de Temperatura y Humedad en los últimos 7 días.");return false;} // puede venir vacio... :)

        var ultima_revisacion = this.state.revisaciones[ this.state.revisaciones.length - 1 ];
        console.log("Ultima revisacion", ultima_revisacion);
        document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerText = ultima_revisacion['temperatura'] + "°C";
        document.getElementById("txt-humedad-" + this.state.colmena['id']).innerText = ultima_revisacion['humedad'] + "%";
        document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "*Últimos datos registrados: " + ultima_revisacion['fecha_revisacion'].split("-")[2]+"-"+ultima_revisacion['fecha_revisacion'].split("-")[1]+"-"+ultima_revisacion['fecha_revisacion'].split("-")[0] + " - " + ultima_revisacion['hora_revisacion'].substr(0,5) + " hs.";

        return true;
    }

    completarTabla() {
       var revisaciones = this.state.revisaciones;
       var datos = [];
       var columns = this.state.data.columns;

       for( var i=0; i<revisaciones.length; i++ ) {
          var row = 
          {
              colmena: this.state.colmena['identificacion'],
              temperatura: revisaciones[i]['temperatura'],
              humedad: revisaciones[i]['humedad'],
              fecha: revisaciones[i]['fecha_revisacion'].split("-")[2]+"-"+revisaciones[i]['fecha_revisacion'].split("-")[1]+"-"+revisaciones[i]['fecha_revisacion'].split("-")[0],
              hora: revisaciones[i]['hora_revisacion'],
          };
    
          datos.push(row);
       }

       this.setState(
        {
            data: {columns: columns, rows: datos},
            show: true,
        },function(){
            // console.log("/////// " + JSON.stringify(this.state.data.rows));

            //document.getElementById("contenedor-colmenas").style.display = "block";
        });
    }
   
    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    handleClickCollapse(event) {
      var id = "box-body-" + this.state.colmena['id'];
      var display = document.getElementById(id).style.display;
      if( display == "none" ) {
        document.getElementById(id).style.display = "block";
      }
      else {
        document.getElementById(id).style.display = "none";
      }
    }

    render() {
        
        

        return (
            
                <div className="col-md-12">
          
          {/* LINE CHART */}
          <div id="contenedor-detalle-colmena" className="box box-primary" style={{dislay:"none"}}>
            <div className="box-header with-border">
              <h3 className="box-title">Detalle Colmena N° {this.state.colmena['identificacion']}</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" onClick={this.handleClickCollapse} data-widget="collapse"><i className="fa fa-minus" /> </button>
                {/* <div className="btn-group">
                  <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-wrench"></i></button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                  </ul>
                </div> */}
                {/* <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button> */}
              </div>
            </div>
            <div id={"box-body-" + this.state.colmena['id']} className="box-body">

                  <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block border-right">
                              <span className="description-percentage text-red"><i className="fa fa-thermometer-full fa-3x fa-fw" /> </span>
                              <h5 id={"txt-temperatura-" + this.state.colmena['id']} className="description-header">35°C</h5>
                              <span className="description-text">Temperatura</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block">
                              <span className="description-percentage text-blue"><i className="fa fa-tint fa-3x fa-fw" /> </span>
                              <h5 id={"txt-humedad-" + this.state.colmena['id']} className="description-header">60%</h5>
                              <span className="description-text">Humedad</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                  </div>
                  <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                      <small> <span id={"txt-descripcion-" + this.state.colmena['id']}> *Últimos datos registrados: 01-01-2020 15:00 hs </span> </small>
                  </div> {/* /.row */}
                  
                  <hr />

                  <strong><i className="fa fa-book margin-r-5" /> Revisaciones  </strong>
                  <p className="text-muted">
                      Temperatura y Humedad de los últimos 7 días.
                  </p>
                  <br />

                  
          
                  <div className="row">
                      <div className="col-md-12"> 
                          <MDBDataTable
                                                striped
                                                //bordered
                                                small
                                                hover
                                                bordered
                                                responsive = { true }
                                                //sorting={false}
                                                sorting = {"true"}
                                                //scrollY
                                                //rows = {this.state.rows}
                                                //columns={this.state.columns}
                                                data={this.state.data}
                                            />
                        </div>
                  </div>
                        


            </div> {/* /.box-body */}

            {/* Footer del Box
            <div className="box-footer" style={{backgroundColor:"rgba(0,0,0,.03)"}}>
                <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-red"><i className="fa fa-thermometer-full fa-3x fa-fw" /> </span>
                      <h5 className="description-header">35°C</h5>
                      <span className="description-text">Temperatura</span>
                    </div>
                    {/* /.description-block */}
                {/*   </div>
                  {/* /.col */}
              {/*     <div className="col-sm-3 col-xs-6">
                    <div className="description-block">
                      <span className="description-percentage text-blue"><i className="fa fa-tint fa-3x fa-fw" /> </span>
                      <h5 className="description-header">60%</h5>
                      <span className="description-text">Humedad</span>
                    </div> {/* /.description-block */}
                {/*   </div> {/* /.col */}
              {/*   </div> {/* /.row */}
        {/*  </div> {/* /.box-footer */}
                  


          </div> {/* /.box */}
        {/* /.col (LEFT) */}
        </div> 
       




                
                
           
        );
    }
}
