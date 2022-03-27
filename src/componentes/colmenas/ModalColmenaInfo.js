import React, { Component } from 'react';
import CanvasJSReact from './../../assets/canvasjs.react';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
const $ = require('jquery')

var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class ModalColmenaInfo extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;  
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            show: this.props.show,
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
        this.resetearTodo = this.resetearTodo.bind(this);
        this.esconderSpinners = this.esconderSpinners.bind(this);
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            colmena : nextProps.colmena,
            show : nextProps.show,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    





    

    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

        this._isMounted = true;

        document.getElementById("spinner-estado-colmenas").style.display = "block";
        document.getElementById("txt-msj").style.display = "none";
        document.getElementById("txt-msj-temperatura").style.display = "none";
        document.getElementById("txt-msj-humedad").style.display = "none";

        if( !this.state.show ) return;

        this.resetearTodo();
        

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
                    //document.getElementById("contenedor-detalle-colmena").style.display = "block";
                }
                else {
                    //document.getElementById("contenedor-detalle-colmena").style.display = "none";
                }
                
            });

            // Acá van los mensajes del estado...
            if( data["mensaje"] != "" ) {
              document.getElementById("txt-msj").style.display = "block";
              document.getElementById("txt-msj").innerText = data["mensaje"];
              document.getElementById("txt-msj-temperatura").style.display = "none";
              document.getElementById("txt-msj-humedad").style.display = "none";
            }
            else{
              document.getElementById("txt-msj").style.display = "none";
              document.getElementById("txt-msj-temperatura").style.display = "flex";
              document.getElementById("txt-msj-temperatura").innerText = data["mensaje_temperatura"];
              document.getElementById("txt-msj-humedad").style.display = "flex";
              document.getElementById("txt-msj-humedad").innerText = data["mensaje_humedad"];
            }
            document.getElementById("spinner-estado-colmenas").style.display = "none";
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }


    resetearTodo() {
      var node_i_1 = document.createElement("i");
      node_i_1.className = "fa fa-spinner fa-pulse fa-lg fa-fw";

      var node_i_2 = document.createElement("i");
      node_i_2.className = "fa fa-spinner fa-pulse fa-lg fa-fw";

      var node_i_3 = document.createElement("i");
      node_i_3.className = "fa fa-spinner fa-pulse fa-lg fa-fw";

      document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerHTML = "";
      document.getElementById("txt-temperatura-" + this.state.colmena['id']).appendChild(node_i_1);

      document.getElementById("txt-humedad-" + this.state.colmena['id']).innerHTML = "";
      document.getElementById("txt-humedad-" + this.state.colmena['id']).appendChild(node_i_2);

      document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerHTML = "";
      document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "*Últimos datos registrados: ";
      document.getElementById("txt-descripcion-" + this.state.colmena['id']).appendChild(node_i_3)

      var columns = this.state.data.columns;
      document.getElementById("txt-mensaje-error-" + this.state.colmena['id']).style.display="none";
      
      this.setState(
        {
            data: {columns: columns, rows: []},
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


    obtenerUltimaRevisacion() {

        
        if( !this.state.revisaciones ) {document.getElementById("txt-mensaje-error-" + this.state.colmena['id']).style.display="block";this.esconderSpinners();document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "Sin datos."; return false;} // puede venir vacio... :)
        if ( this.state.revisaciones.length == 0 ) {document.getElementById("txt-mensaje-error-" + this.state.colmena['id']).style.display="block";this.esconderSpinners();document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "Sin datos."; return false;} // puede venir vacio... :)

        var ultima_revisacion = this.state.revisaciones[ this.state.revisaciones.length - 1 ];
        console.log("Ultima revisacion", ultima_revisacion);
        document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerText = ultima_revisacion['temperatura'] + "°C";
        document.getElementById("txt-humedad-" + this.state.colmena['id']).innerText = ultima_revisacion['humedad'] + "%";
        document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "*Últimos datos registrados: " + ultima_revisacion['fecha_revisacion'].split("-")[2]+"-"+ultima_revisacion['fecha_revisacion'].split("-")[1]+"-"+ultima_revisacion['fecha_revisacion'].split("-")[0] + " - " + ultima_revisacion['hora_revisacion'].substr(0,5) + " hs.";

        return true;
    }



    esconderSpinners() {
      document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerHTML = "---";
      
      document.getElementById("txt-humedad-" + this.state.colmena['id']).innerHTML = "---";
    
      document.getElementById("txt-descripcion-" + this.state.colmena['id']).innerText = "*Últimos datos registrados: ---";

      var columns = this.state.data.columns;
      
      this.setState(
        {
            data: {columns: columns, rows: []},
            show: true,
        },function(){
            // console.log("/////// " + JSON.stringify(this.state.data.rows));

            //document.getElementById("contenedor-colmenas").style.display = "block";
        });
      
    }

    completarTabla() {
       var revisaciones = this.state.revisaciones;
       var datos = [];
       var columns = this.state.data.columns;

       for( var i=0; i<revisaciones.length; i++ ) {
          var row = 
          {
              colmena: this.state.colmena['identificacion'],
              temperatura: revisaciones[i]['temperatura'] + " °C",
              humedad: revisaciones[i]['humedad'] + " %",
              fecha: revisaciones[i]['fecha_revisacion'].split("-")[2]+"-"+revisaciones[i]['fecha_revisacion'].split("-")[1]+"-"+revisaciones[i]['fecha_revisacion'].split("-")[0],
              hora: revisaciones[i]['hora_revisacion'].substr(0,5),
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

    
   

    render() {
        
        

        return (
            
          <div>
          <div className="modal fade" id="modal_colmena_info">
<div className="modal-dialog modal-lg" >
<div className="modal-content">
<div className="modal-header">
<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 className="modal-title" id="modal_ped_label">Detalle Colmena N° {this.state.colmena['identificacion']}</h4>
</div>
<div className="modal-body">
<div className="tab-content">
  <div className="tab-pane fade in active" id="info_pedido">
          <center><p id={"txt-mensaje-error-" + this.state.colmena['id']} style={{color:"red",fontWeight:"bold",display:"none"}}> No hay registros de Temperatura y Humedad en los últimos 7 días. </p></center>
          {/* TODO */}
          <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block border-right">
                              <span className="description-percentage text-red"><i className="fa fa-thermometer-full fa-3x fa-fw" /> </span>
                              <h5 id={"txt-temperatura-" + this.state.colmena['id']} className="description-header"><i className="fa fa-spinner fa-pulse fa-lg fa-fw"/></h5>
                              <span className="description-text">Temperatura</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block">
                              <span className="description-percentage text-blue"><i className="fa fa-tint fa-3x fa-fw" /> </span>
                              <h5 id={"txt-humedad-" + this.state.colmena['id']} className="description-header"><i className="fa fa-spinner fa-pulse fa-lg fa-fw"/></h5>
                              <span className="description-text">Humedad</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                  </div>
                  <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                      <small> <span id={"txt-descripcion-" + this.state.colmena['id']}> *Últimos datos registrados: <i className="fa fa-spinner fa-pulse fa-lg fa-fw"/> </span> </small>
                  </div> {/* /.row */}
                  
                  <hr />

                  <strong><i className="fa fa-forumbee margin-r-5" /> Estado </strong>
                  <i id={"spinner-estado-colmenas"} className="fa fa-spinner fa-pulse fa-sm fa-fw" />
                  <p id={"txt-msj"} className="text-muted" style={{display:"none"}}> { " " } </p>
                  <p id={"txt-msj-temperatura"} className="text-muted" style={{display:"none"}}> { " " } </p>
                  <p id={"txt-msj-humedad"} className="text-muted" style={{display:"none"}}> { " " } </p>
                  
                  <hr />

                  <strong><i className="fa fa-forumbee margin-r-5" /> Revisaciones  </strong>
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




  </div>
</div>
</div>
<div className="modal-footer">
<button type="button" className="btn btn-rounded btn-success pull-right boton-guardar" onClick={(e) => {document.getElementById("txt-mensaje-error-" + this.state.colmena['id']).style.display="none"}} data-dismiss="modal">Cerrar</button>  
</div>
</div>
</div>
</div>
      </div>




                
                
           
        );
    }
}
