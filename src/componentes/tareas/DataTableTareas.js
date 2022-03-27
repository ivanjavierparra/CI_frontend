import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MDBDataTable } from "mdbreact";
import { CSVLink } from "react-csv";
import { connect } from 'react-redux';
import cookie from 'js-cookie';
const $ = require("jquery");

var markersArray = [];
var markersApiarios = [];
var map = [];
var coordenadas = {
    "Rawson": {
      "latitud" : "-43.3001600",
      "longitud" : "-65.1022800"
      },
      "Trelew": {
        "latitud" : "-43.248951",
        "longitud" : "-65.3050537"
      },
      "Gaiman": {
        "latitud" : "-43.28333",
        "longitud" : "-65.48333"
      },
      "Dolavon": {
        "latitud" : "-43.3917",
        "longitud" : "-66.0333"
      },
      "28 de Julio": {
        "latitud" : "-43.390569",
        "longitud" : "-65.839479"
      },
};

class DataTableTareas extends Component {
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
      apiarios : [],
      ciudad : "",
      ciudad_seleccionada : "",
      apiario_seleccionado : [],
      apicultor : "",
      direccion_apiario : "",
      nombre_apiario : "",
      cantidad_colmenas : "",
      
      colmenas_a_revisar : [],

      colmenas: [],
      apiario_seleccionado: 0,
      apiario_editar: [],
      apiario_consultar: [],

      isDisabledLocalidad : true,

      isOpen: false,
      show: false,
      isCheckedApiario : false,
      isDisabledApiario: true,
      localidad_seleccionada : "",
      headers_csv : [
        { label: "Ciudad", key: "ciudad" },
        { label: "Apiario", key: "apiario" },
        { label: "Colmena", key: "colmena" },
        { label: "Temperatura", key: "temperatura" },
        { label: "Humedad", key: "humedad" },
        { label: "Fecha", key: "fecha" },
        { label: "Hora", key: "hora" },
        { label: "Estado", key: "estado" },
      ],
      data_csv : [],
      data: {
        columns: [
          {
            label: <span>Ciudad</span>,
            field: "ciudad", // con este campo identificamos las filas. 
            sort: "asc",
            width: 150
          },
          {
            label: <span>Apiario</span>,
            field: "apiario",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Colmena</span>,
            field: "colmena",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Temperatura</span>,
            field: "temperatura",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Humedad</span>,
            field: "humedad",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Fecha</span>,
            field: "fecha",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Hora</span>,
            field: "hora",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Estado</span>,
            field: "estado",
            sort: "asc",
            width: 150
          },
                    
        ],
        rows: [
          {
            temperatura: (
              <div>
                {" "}
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
              </div>
            )
          }
        ]
      }
    };

    // Asocio el metodo a la clase.
    this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
    this.crearMarkers = this.crearMarkers.bind(this);

    this.handleChangeLocalidad = this.handleChangeLocalidad.bind(this);
    this.handleChangeChkApiario = this.handleChangeChkApiario.bind(this);
    this.handleClickFiltrarApiarios = this.handleClickFiltrarApiarios.bind(this);
    
    this.createTextSelect = this.createTextSelect.bind(this);
    this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
    this.emptySelector = this.emptySelector.bind(this);
    
    this.buscarColmenas = this.buscarColmenas.bind(this);
    this.completarDataTable = this.completarDataTable.bind(this);
    this.actualizar_markers = this.actualizar_markers.bind(this);

    this.eliminar_markers = this.eliminar_markers.bind(this);
    this.resetear_markers = this.resetear_markers.bind(this);
    this.existe_apiario = this.existe_apiario.bind(this);
  }


  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDa66qPWnvxts56tHudQJ_eQF0pZhUWPBQ&libraries=geometry,drawing,places&language=es&types=(cities)&callback=initMap");
    window.initMap = this.initMap;
  }

  /**
   * 
   * 
   * 
   */
  initMap = () => {
      // Create A Map
      map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -43.3, lng: -65.3},
        zoom: 8
      });

      // Busco todos los apiarios
      this.buscarMisApiarios();
        
      // Si el usuario clickea sobre mapa se crear un marker
      map.addListener('click',function(event) {
      
        // Obtengo Latitud y Longitud.
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log( latitude + ', ' + longitude );


        // Centro el mapa donde el usuario hizo click.
        map.panTo(new window.google.maps.LatLng(latitude,longitude));


      }.bind(this));
  }


  buscarMisApiarios() {
      
        var url = "https://backendcolmenainteligente.herokuapp.com/api/apiarios/apicultor";
        fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + cookie.get("token"),
        },
        signal: this.abortController.signal
        })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            this.setState(
            {
                apiarios: data,
                isDisabledLocalidad : false,
            },
            function() {
                
            }
            );

            this.crearMarkers(data);
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
  }


  crearMarkers(apiarios) {

    var infowindow = new window.google.maps.InfoWindow();
    

    for( var i=0; i < apiarios.length; i++ ) {

        // Create An InfoWindow
        var content = '<b>Apiario:</b> ' + apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'] + ' <br><b>Ciudad:</b> ' + apiarios[i]['apiario']['localidad_chacra']  + ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>En buen estado:</b> ' + apiarios[i]['contador']['verde'] + ' <br><b>En alerta:</b> ' + apiarios[i]['contador']['amarillo'] + ' <br><b>En peligro:</b> ' + apiarios[i]['contador']['rojo']
        
        // Create A Marker
        var marker = new window.google.maps.Marker({
            position: {lat: apiarios[i]['apiario']['latitud'] , lng: apiarios[i]['apiario']['longitud']},
            map: map,
            title: 'Apiario',
            clickable: true
        })

        if( apiarios[i]['color'] == "verde" ) {
            // Seteo ícono del marker
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        }
        else if( apiarios[i]['color'] == "amarillo" ) {
            // Seteo ícono del marker
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        }
        else {
            // Seteo ícono del marker
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        }


        // Agrego un listener al marker
        window.google.maps.event.addListener(marker, 'click', (function(marker, content, apiarios, i) {
        return function() {

            console.log(apiarios,i);
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
            this.setState({
                apiario_seleccionado : apiarios[i]["apiario"]["id"],
                ciudad : apiarios[i]["apiario"]["localidad_chacra"],
                apicultor : apiarios[i]["apicultor"],
                direccion_apiario : apiarios[i]["apiario"]["direccion_chacra"],
                nombre_apiario : apiarios[i]["apiario"]["nombre_fantasia"],
                cantidad_colmenas : apiarios[i]['colmenas'],
            });

            // Centro el mapa donde el usuario hizo click.
            map.panTo(new window.google.maps.LatLng(apiarios[i]["apiario"]["latitud"],apiarios[i]["apiario"]["longitud"]));
        }
        })(marker, content, apiarios, i).bind(this));
    
  
        // Agrego el marker al arreglo global de markers.
        markersApiarios.push(marker);
    }
  }


  /**
     * Elimina todos los options del selector-apiario.
     */
    emptySelector(selector_id) {
      var select = document.getElementById(selector_id);
      var length = select.options.length;
      for (var i = length-1; i >= 0; i--) {
        select.options[i] = null;
      }
        
    }

    
    /**
     * Creo un nuevo option para el selector-apiario con los datos
     * pasados como parámetros.
     * @param {*} key 
     * @param {*} text 
     * @param {*} value 
     */
    createDefaultValueSelector(selector_id, key, text, value) {
      
      var selector = document.getElementById(selector_id);
    
      // create new option element
      var opt = document.createElement('option');
    
      // create text node to add to option element (opt)
      opt.appendChild( document.createTextNode(text) );
    
      // set value property of opt
      opt.value = value; 
      opt.key = key;
    
      // add opt to end of select box (sel)
      selector.appendChild(opt); 
    }
    
    /**
     * Devuelvo el nombre del apiario.
     * @param {*} direccion_chacra 
     * @param {*} nombre_fantasia 
     */
    createTextSelect(direccion_chacra, nombre_fantasia) {
      var text = direccion_chacra;
      if ( !nombre_fantasia ) return text;
    
      text = text + " - " + nombre_fantasia;
    
      return text;
    }

  handleChangeLocalidad(event) {

    this.setState({ localidad_seleccionada: event.target.value }, () => {
      
      this.emptySelector("apiario_buscar");
      this.createDefaultValueSelector("apiario_buscar",0,'----- Seleccionar -----', "");
      if ( this.state.localidad_seleccionada != "" ) {

          var apiarios_encontrados = this.state.apiarios;
          if( this.state.localidad_seleccionada == "Todos" ) {
            // Selecciono 'Todos' 
            for( var i=0; i<apiarios_encontrados.length; i++ ) {
              
                this.createDefaultValueSelector(
                  "apiario_buscar",
                  apiarios_encontrados[i]['apiario']['id'], 
                  this.createTextSelect(apiarios_encontrados[i]['apiario']['direccion_chacra'],apiarios_encontrados[i]['apiario']['nombre_fantasia']),
                  apiarios_encontrados[i]['apiario']['id']
                );
              
            }
          }
          else { 
            // Selecciono una localidad especifica. 
            for( var i=0; i<apiarios_encontrados.length; i++ ) {
              if( apiarios_encontrados[i]['apiario']['localidad_chacra'] == this.state.localidad_seleccionada ) {
                this.createDefaultValueSelector(
                  "apiario_buscar",
                  apiarios_encontrados[i]['apiario']['id'], 
                  this.createTextSelect(apiarios_encontrados[i]['apiario']['direccion_chacra'],apiarios_encontrados[i]['apiario']['nombre_fantasia']),
                  apiarios_encontrados[i]['apiario']['id']
                );
              }
            }
          }
      }
    });
  }

  /**
   * 
   * @param {*} event 
   */
  handleChangeChkApiario(event) {
    this.setState({
        isCheckedApiario: !this.state.isCheckedApiario,
        isDisabledApiario : !this.state.isDisabledApiario,
    }, () => {
        
    });
  }


  handleClickFiltrarApiarios(event)  {
    
    // Oculto box y muestro spinner
    document.getElementById("box-hoja-de-trabajo").style.display = "none";
    document.getElementById("spinner-btn-buscar").style.display = "block";

    var localidad = document.getElementById("localidad_buscar").value;
    if( !localidad ) { alert("Ingrese localidad."); return; }
    
    var apiario = document.getElementById("apiario_buscar").value;
    if( this.state.isCheckedApiario && apiario == "" ) { alert("Ingrese apiario."); return; }
    if( !this.state.isCheckedApiario ) apiario = "";


    // Busco colmenas en alerta y peligro.
    this.buscarColmenas(localidad, apiario); 
  }


  buscarColmenas(localidad, apiario_id) {

    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/colmenas/estado/alerta_peligro");
    var params = {
                    ciudad: localidad, 
                    apiario : apiario_id,
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

        console.log(data);

        this.setState({
          colmenas_a_revisar : data,
        });

        this.completarDataTable(data);
        this.actualizar_markers(data);

        // Muestro box y oculto spinner
        document.getElementById("box-hoja-de-trabajo").style.display = "block";
        document.getElementById("spinner-btn-buscar").style.display = "none";

    })
    .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
        //alert("Ha ocurrido un error: " + error);
    });

  }

  

  completarDataTable(colmenas) {

      var data = [];
      var columns = this.state.data.columns;

      for( var i = 0; i < colmenas.length; i++ ) {
               
        var colmenas_en_alerta = colmenas[i]['amarillo'];
        for( var j = 0; j < colmenas_en_alerta.length; j++ ){

          var row = "";
          row = 
          { 
              // ciudad apiario comena temperatura humedad fecha hora estado
              ciudad: colmenas[i]['apiario']['localidad_chacra'], 
              apiario: colmenas[i]['apiario']['direccion_chacra'] + " - "  + colmenas[i]['apiario']['nombre_fantasia'],
              colmena: colmenas_en_alerta[j][0]['identificacion'],
              temperatura: colmenas_en_alerta[j][1] ? colmenas_en_alerta[j][1]['temperatura'] + "°C" : " - ",
              humedad: colmenas_en_alerta[j][1] ? colmenas_en_alerta[j][1]['humedad'] + "%" : " - ",
              fecha: colmenas_en_alerta[j][1] ? colmenas_en_alerta[j][1]['fecha_revisacion'].split("-")[2] + "-" + colmenas_en_alerta[j][1]['fecha_revisacion'].split("-")[1] + "-" + colmenas_en_alerta[j][1]['fecha_revisacion'].split("-")[0]  : " - ",
              hora: colmenas_en_alerta[j][1] ? colmenas_en_alerta[j][1]['hora_revisacion'].substring(0,5) : " - ",
              estado: "En Alerta",
          };

          data.push(row);
        }

        var colmenas_en_peligro = colmenas[i]['rojo'];
        for( var j = 0; j < colmenas_en_peligro.length; j++ ){

          var row = "";
          row = 
          { 
              // ciudad apiario comena temperatura humedad fecha hora estado
              ciudad: colmenas[i]['apiario']['localidad_chacra'], 
              apiario: colmenas[i]['apiario']['direccion_chacra'] + " - "  + colmenas[i]['apiario']['nombre_fantasia'],
              colmena: colmenas_en_peligro[j][0]['identificacion'],
              temperatura: colmenas_en_peligro[j][1] ? colmenas_en_peligro[j][1]['temperatura']  + "°C": " - ",
              humedad: colmenas_en_peligro[j][1] ? colmenas_en_peligro[j][1]['humedad'] + "%" : " - ",
              fecha: colmenas_en_peligro[j][1] ? colmenas_en_peligro[j][1]['fecha_revisacion'].split("-")[2] + "-"+ colmenas_en_peligro[j][1]['fecha_revisacion'].split("-")[1] + "-" + colmenas_en_peligro[j][1]['fecha_revisacion'].split("-")[0]   : " - ",
              hora: colmenas_en_peligro[j][1] ? colmenas_en_peligro[j][1]['hora_revisacion'].substring(0,5) : " - ",
              estado: "En Peligro",
          };

          data.push(row);
        } 

      }

      // Seteo los datos del DataTable.
      this.setState({
        data: {columns: columns, rows: data},
        data_csv: data,
      });

  }


 
  

  actualizar_markers(colmenas) {

    this.eliminar_markers();

    var infowindow = new window.google.maps.InfoWindow();

    var apiarios = this.state.apiarios;
    var apiarios_aux = [];
    
    for( var i = 0; i < apiarios.length; i ++ ) {

      if( this.existe_apiario( colmenas, apiarios[i]['apiario']['id'] ) ) {

        apiarios_aux.push(apiarios[i]);

      }

    }

    this.crearMarkers(apiarios_aux);

  }


  eliminar_markers() {
    // Elimino todos los markers del mapa.
    for (var i = 0; i < markersApiarios.length; i++ ) {
      markersApiarios[i].setMap(null);
    }
    markersApiarios.length = 0;
  }

  resetear_markers(event) {
    this.crearMarkers(this.state.apiarios);
  }
  

  
  existe_apiario(colmenas, apiario_id) {

    for(  var i = 0; i < colmenas.length; i++  ) {

      if( colmenas[i]['apiario']['id'] == apiario_id) return true;
      
    }

    return false;

  }

  componentDidMount() {
    this._isMounted = true;
    this.renderMap();
  }

  refrescarComponente() {
    window.location.reload(true);
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
              Tareas
              <br />
              <small>Hoja de Trabajo</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-car" /> Tareas
                </a>
              </li>
              <li className="active">
                <a href="#">Hoja de Trabajo</a>
              </li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
          <div className="row">
              {/* left column */}
              <div className="col-md-6">
                  <div className="box box-primary">
                    <div className="box-header with-border">
                      <h3 className="box-title">Apiarios a Visitar </h3>
                    </div>
                    {/* /.box-header */}
                    <div className="box-body">
                        <div className="form-group">
                          <label htmlFor="localidad_buscar">Localidad</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="localidad_buscar"
                            name="localidad_buscar"
                            onChange={this.handleChangeLocalidad}
                            disabled = {this.state.isDisabledLocalidad}
                          >
                            <option value={""}>----- Seleccionar -----</option>
                            <option value={"Rawson"}>Rawson</option>
                            <option value={"Trelew"}>Trelew</option>
                            <option value={"Gaiman"}>Gaiman</option>
                            <option value={"Dolavon"}>Dolavon</option>
                            <option value={"28 de Julio"}>28 de Julio</option>
                            <option value={"Todos"}>Todos</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="apiario_buscar"><input type="checkbox" id="chk-apiario" name="chk-apiario" defaultChecked={this.state.isCheckedApiario} onChange={this.handleChangeChkApiario} /> Apiario</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="apiario_buscar"
                            name="apiario_buscar"
                            disabled = {this.state.isDisabledApiario}
                          >
                            <option value={""}>----- Seleccionar -----</option>
                          </select>
                        </div>
                        {/* /.box-body */}
                        <div className="form-group">
                          <button type="button" className="btn btn-sm btn-primary btn-flat" onClick={this.handleClickFiltrarApiarios}> 
                            <strong>
                              Buscar
                            </strong>
                          </button>
                          {/* <br /><br /><label> <small> * Se buscarán apiarios en alerta y/o en peligro. </small></label> <br /> */}
                        </div>
                        <center><i id="spinner-btn-buscar" style={{display:'none'}} className="fa fa-spinner fa-pulse fa-sm fa-fw"></i></center>
                    </div>
                    <div className="box-footer">
                      <label> <small> * Se buscarán apiarios en alerta y/o en peligro. </small></label>
                    </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="box box-primary">
                      <div className="box-header with-border">
                        <h3 className="box-title">Mapa</h3>
                        <button type="button" onClick={this.resetear_markers} className="btn btn-flat btn-success btn-xs pull-right"><strong><i className="fa fa-refresh" /> Resetear</strong></button>
                      </div>
                      {/* /.box-header */}
                      <div className="box-body">
                        <div id="map"  style={{height: '300px'}}></div>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                {/* Aca comienza la tabla */}
                <div id="box-hoja-de-trabajo" className="box box-primary" style={{display:'none'}}>
                  <div className="box-header with-border">
                    <h3 className="box-title">Hoja de Trabajo</h3>
                    
                    
                    <CSVLink data={this.state.data_csv} headers={this.state.headers_csv}
                      filename={"hoja_de_trabajo.csv"}
                      className="btn btn-flat btn-success btn-xs pull-right"
                      target="_blank"
                    >
                        <strong><i className="fa fa-download" /> Descargar</strong>
                    </CSVLink>
                    
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <MDBDataTable
                          striped
                          //bordered
                          small
                          hover
                          bordered
                          responsive={true}
                          //sorting={false}
                          sorting={"true"}
                          //scrollY
                          //rows = {this.state.rows}
                          //columns={this.state.columns}
                          data={this.state.data}
                        />
                      </div>
                    </div>
                  </div>
                  {/* /.box-body */}
                </div>
                {/* /.box */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = dispatch => {
  return {
      logout: () => dispatch({type:'SET_LOGOUT'})
  };
};
export default connect(null,mapDispatchToProps)(DataTableTareas)
