import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MDBDataTable } from "mdbreact";
import ColmenaChart from "./ColmenaChart";
import ModalEditarApiario from "./ModalEditarApiario";
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

class DataTableApiario extends Component {
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
      apiarios: [],
      colmenas: [],
      apiario_seleccionado: 0,
      apiario_editar: [],
      apiario_consultar: [],
      isOpen: false,
      show: false,
      isCheckedApiario : false,
      isDisabledApiario: true,
      localidad_seleccionada : "",
      data: {
        columns: [
          {
            label: <span>ID</span>,
            field: "apiario_id", // con este campo identificamos las filas.
            sort: "asc",
            width: 150
          },
          {
            label: <span>Localidad</span>,
            field: "localidad",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Dirección</span>,
            field: "direccion",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Nombre Alternativo</span>,
            field: "nombre_fantasia",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Latitud</span>,
            field: "latitud",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Longitud</span>,
            field: "longitud",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Fecha de Creación</span>,
            field: "fecha_creacion",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Propietario de la Chacra</span>,
            field: "propietario",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Descripción</span>,
            field: "descripcion",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Cantidad de Colmenas</span>,
            field: "cant_colmenas",
            sort: "asc",
            width: 150
          },
          {
            label: <span>Estado</span>,
            field: "estado",
            sort: "asc",
            width: 150
          },
          {
            label: <span></span>,
            field: "editar",
            sort: "asc",
            width: 150
          },
          {
            label: <span></span>,
            field: "consultar",
            sort: "asc",
            width: 150
          }
        ],
        rows: [
          {
            fecha_creacion: (
              <div>
                {" "}
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
              </div>
            )
          }
        ]
      },
      isLoadLocalidad : true,
    };

    // Asocio el metodo a la clase.
    this.handleClickBtnConsultar = this.handleClickBtnConsultar.bind(this);
    this.handleClickBtnEditar = this.handleClickBtnEditar.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
    this.mostrarColmenasDelApiario = this.mostrarColmenasDelApiario.bind(this);
    this.buscarApiario = this.buscarApiario.bind(this);
    this.refrescarComponente = this.refrescarComponente.bind(this);
    this.getNombreApiario = this.getNombreApiario.bind(this);
    this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
    this.createMarkersApiarios = this.createMarkersApiarios.bind(this);
    this.handleChangeChkApiario = this.handleChangeChkApiario.bind(this);
    this.filtrarApiarios = this.filtrarApiarios.bind(this);
    this.completarFiltrado = this.completarFiltrado.bind(this);
    this.actualizarDatatable = this.actualizarDatatable.bind(this);  
    this.actualizarMarkers = this.actualizarMarkers.bind(this);
    this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
    this.getApiario = this.getApiario.bind(this);
    this.handleChangeLocalidad = this.handleChangeLocalidad.bind(this);
    this.createTextSelect = this.createTextSelect.bind(this);
    this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
    this.emptySelector = this.emptySelector.bind(this);
    this.buscarTodosMisApiarios = this.buscarTodosMisApiarios.bind(this);
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

      this.buscarMisApiarios();
  }


  buscarMisApiarios() {
      // ---------------   Busqueda de Apiarios ------------
    let todos_los_apiarios = [];
    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios");
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

        todos_los_apiarios = data.map(apiario => {
          return apiario;
        });

        console.log(todos_los_apiarios);

        this.setState(
          {
            apiarios: todos_los_apiarios,
            show: true,
            isLoadLocalidad : false,
          },
          function() {
            if (this._isMounted) {

              this.createMarkersApiarios(data);

              var datos = [];
              var columns = this.state.data.columns;

              for (var i = 0; i < data.length; i++) {
                var row = {
                  apiario_id: data[i]["id_apiario"],
                  localidad: data[i]["localidad_chacra"],
                  direccion: data[i]["direccion_chacra"],
                  nombre_fantasia : data[i]["nombre_fantasia"],
                  latitud: data[i]["latitud"],
                  longitud: data[i]["longitud"],
                  fecha_creacion:
                    data[i]["fecha_creacion"].split("-")[2] +
                    "-" +
                    data[i]["fecha_creacion"].split("-")[1] +
                    "-" +
                    data[i]["fecha_creacion"].split("-")[0],
                  propietario: data[i]["propietario_chacra"],
                  descripcion: data[i]["descripcion"],
                  cant_colmenas: data[i]["colmenas"],
                  estado: data[i]['estado_apiario'] == "verde" ? "Correcto" : data[i]['estado_apiario'] == "amarillo" ? "Alerta" : "Peligro",
                  editar: (
                    <button
                      id={"editar-" + data[i]["id_apiario"]}
                      className="btn btn-warning btn-sm fa fa-pencil"
                      onClick={this.handleClickBtnEditar}
                      data-toggle="modal"
                      data-target="#modal_cp"
                      title="Editar apiario"
                    ></button>
                  ),
                  consultar: (
                    <button
                      id={"consultar-" + data[i]["id_apiario"]}
                      className="btn btn-success btn-sm fa fa-forumbee"
                      onClick={this.handleClickBtnConsultar}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Ver Colmenas"
                    >
                      {" "}
                    </button>
                  )
                };

                datos.push(row);
              }

              this.setState(
                {
                  data: { columns: columns, rows: datos },
                  show: true
                },
                function() {
                  console.log(
                    "/////// " + JSON.stringify(this.state.data.rows)
                  );
                }
              );
            }
          }
        );
      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Falló el request a apiarios: ", error);
        //alert("Falló el request a apiarios: " + error);
      });
  }

  createMarkersApiarios(apiarios) {
      var infowindow = new window.google.maps.InfoWindow();
      for( var i = 0; i < apiarios.length; i++ ) {
      
        // Create An InfoWindow
        var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>Ciudad:</b> ' + apiarios[i]['localidad_chacra']
        
        // Create A Marker
        var marker = new window.google.maps.Marker({
          position: { lat: parseFloat(apiarios[i]['latitud']) , lng: parseFloat(apiarios[i]['longitud']) },
          map: map,
          title: 'Apiario',
          clickable: true
        })

        // Seteo ícono del marker
        if( apiarios[i]['estado_apiario'] == "verde" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        else if( apiarios[i]['estado_apiario'] == "amarillo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        else if( apiarios[i]['estado_apiario'] == "rojo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

        // Agrego un listener al marker
        window.google.maps.event.addListener(marker, 'click', (function(marker, content) {
          return function() {
              infowindow.setContent(content);
              infowindow.open(map, marker);
          }
        })(marker, content));
        
      
        // Agrego el marker al arreglo global de markers.
        markersApiarios.push(marker);
      }
  }

  
  filtrarApiarios(event)  {

    var localidad = document.getElementById("localidad_buscar").value;
    if( !localidad ) { alert("Ingrese localidad."); return; }

    var apiario = document.getElementById("apiario_buscar").value;
    if( this.state.isCheckedApiario && apiario == "" ) { alert("Ingrese apiario."); return; }

    if(  localidad == "Todos" && this.state.isCheckedApiario && apiario != "" ) {this.completarFiltrado(localidad, apiario); return; }
    if(  localidad == "Todos" ) {this.buscarTodosMisApiarios(); return; }
    

    this.completarFiltrado(localidad, apiario);
  }

  buscarTodosMisApiarios() {

    this.actualizarMarkers(this.state.apiarios);
    this.actualizarDatatable(this.state.apiarios);

  }

  completarFiltrado( localidad, apiario ) { 

    var apiarios = [];

    if ( apiario ) {

       apiarios = this.getApiario(apiario);

    }
    else {

      apiarios = this.getApiariosCiudad(localidad);

    }

    this.actualizarMarkers(apiarios);
    this.actualizarDatatable(apiarios);

  }


  getApiario(apiario_id) {
      
      var resultado = [];

      var apiarios = this.state.apiarios;
      for( var i = 0; i < apiarios.length; i++ ) {

        if( apiarios[i]['id_apiario'] == apiario_id) { resultado.push(apiarios[i]); break;}
        
      }

      return resultado;  
  }

  getApiariosCiudad(localidad) {

    var apiarios = this.state.apiarios;
    var resultado = [];
    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['localidad_chacra'] == localidad) resultado.push(apiarios[i]);
      
    }

    return resultado;
  }

  actualizarMarkers(apiarios) {   
    
    // Elimino todos los markers del mapa.
    for (var i = 0; i < markersApiarios.length; i++ ) {
      markersApiarios[i].setMap(null);
    }
    markersApiarios.length = 0;

    this.createMarkersApiarios(apiarios);    
  }


  actualizarDatatable( apiarios ) {

    var datos = [];
    var columns = this.state.data.columns;

    for (var i = 0; i < apiarios.length; i++) {
      var row = {
        apiario_id: apiarios[i]["id_apiario"],
        localidad: apiarios[i]["localidad_chacra"],
        direccion: apiarios[i]["direccion_chacra"],
        nombre_fantasia : apiarios[i]["nombre_fantasia"],
        latitud: apiarios[i]["latitud"],
        longitud: apiarios[i]["longitud"],
        fecha_creacion:
          apiarios[i]["fecha_creacion"].split("-")[2] +
          "-" +
          apiarios[i]["fecha_creacion"].split("-")[1] +
          "-" +
          apiarios[i]["fecha_creacion"].split("-")[0],
        propietario: apiarios[i]["propietario_chacra"],
        descripcion: apiarios[i]["descripcion"],
        cant_colmenas: apiarios[i]["colmenas"],
        estado: apiarios[i]['estado_apiario'] == "verde" ? "Correcto" : apiarios[i]['estado_apiario'] == "amarillo" ? "Alerta" : "Peligro",
        editar: (
          <button
            id={"editar-" + apiarios[i]["id_apiario"]}
            className="btn btn-warning btn-sm fa fa-pencil"
            onClick={this.handleClickBtnEditar}
            data-toggle="modal"
            data-target="#modal_cp"
            title="Editar apiario"
          ></button>
        ),
        consultar: (
          <button
            id={"consultar-" + apiarios[i]["id_apiario"]}
            className="btn btn-success btn-sm fa fa-forumbee"
            onClick={this.handleClickBtnConsultar}
            data-toggle="tooltip"
            data-placement="top"
            title="Ver Colmenas"
          >
            {" "}
          </button>
        )
      };

      datos.push(row);
    }

    this.setState(
      {
        data: { columns: columns, rows: datos },
        show: true
      },
      function() {
        console.log(JSON.stringify(this.state.data.rows));
      }
    );


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
      if ( this.state.ciudad != "" ) {
          var apiarios_encontrados = this.state.apiarios;
          // Todos los apiarios
          if( this.state.localidad_seleccionada == "Todos" ) {
            for( var i=0; i<apiarios_encontrados.length; i++ ) {
                this.createDefaultValueSelector(
                  "apiario_buscar",
                  apiarios_encontrados[i]['id_apiario'], 
                  this.createTextSelect(apiarios_encontrados[i]['direccion_chacra'],apiarios_encontrados[i]['nombre_fantasia']),
                  apiarios_encontrados[i]['id_apiario']
                );
            }
            return;
          }
          // Apiarios filtrados
          for( var i=0; i<apiarios_encontrados.length; i++ ) {
              if( apiarios_encontrados[i]['localidad_chacra'] == this.state.localidad_seleccionada ) {
                this.createDefaultValueSelector(
                  "apiario_buscar",
                  apiarios_encontrados[i]['id_apiario'], 
                  this.createTextSelect(apiarios_encontrados[i]['direccion_chacra'],apiarios_encontrados[i]['nombre_fantasia']),
                  apiarios_encontrados[i]['id_apiario']
                );
              }
          }
      }
    });
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

  /**
   * Handler Onclick on btnEditar.
   * Busca el pedido seleccionado, y lo setea en el estado de la clase.
   *
   * @param {*} event
   */
  handleClickBtnEditar(event) {
    console.log(event.target.id);

    var id = event.target.id;
    var id_apiario = id.split("-")[1];

    var apiario = this.buscarApiario(id_apiario);

    // Oculto el contendor de colmenas y el titulo
    document.getElementById("contenedor").style.display = "none";
    document.getElementById("txt-titulo-colmenas").style.display = "none";

    this.setState(
      {
        apiario_editar: apiario,
        isOpen: !this.state.isOpen
      },
      function() {}
    );

    // *TODO*: buscar el apiario seleccionado.
  }

  buscarApiario(id_apiario) {
    var apiarios = this.state.apiarios;
    for (var i = 0; i < apiarios.length; i++) {
      if (apiarios[i]["id_apiario"] == id_apiario) return apiarios[i];
    }
  }

  /**
   * Obtiene del servidor el pedido ingresado por el usuario.
   *
   * @param {} event
   */
  handleClickBtnConsultar(event) {
    // Oculto el contendor de colmenas y el titulo
    document.getElementById("contenedor").style.display = "none";
    document.getElementById("txt-titulo-colmenas").style.display = "none";

    console.log(event.target.id);

    var id = event.target.id;
    var id_apiario = id.split("-")[1];
    var apiario = this.buscarApiario(id_apiario);

    this.setState({
      apiario_consultar: apiario
    });

    // Buscar todas las colmenas del apiario
    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiario/colmenas");
    var params = {
      apiario_id: id_apiario
    };

    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

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
        console.log(JSON.stringify(data));
        this.setState(
          {
            apiario_seleccionado: id_apiario,
            colmenas: data
          },
          function() {
            this.mostrarColmenasDelApiario();
          }
        );
      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
        //alert("Ha ocurrido un error: " + error);
      });
  }

  mostrarColmenasDelApiario() {
    var graficos = [];
    var colmenas = this.state.colmenas;

    if (colmenas.length == 0) {
      document.getElementById("txt-titulo-colmenas").style.display = "none";
      alert("El apiario seleccionado no tiene colmenas.");
    }
    else document.getElementById("txt-titulo-colmenas").style.display = "block";

    ReactDOM.unmountComponentAtNode(document.getElementById("contenedor"));

    for (var i = 0; i < colmenas.length; i++) {
      graficos.push(
        <ColmenaChart
          apiario={this.state.apiario_seleccionado}
          colmena={colmenas[i]}
        />
      );
    }

    document.getElementById("contenedor").style.display = "block";
    ReactDOM.render(graficos, document.getElementById("contenedor"));
  }

  getNombreApiario() {
    var apiario = this.state.apiario_consultar;
    if (apiario.length == 0) return "";
    return (
      apiario["direccion_chacra"] + " (" + apiario["localidad_chacra"] + ")"
    );
  }

  rerenderParentCallback() {
    console.log("Entre al callback!!!!!!");
    //this.forceUpdate();
    window.location.reload();
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

  render() {
    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>
              Apiarios
              <br />
              <small>Consultar apiarios</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-map-marker" /> Apiarios
                </a>
              </li>
              <li className="active">
                <a href="#">Consultar Apiarios</a>
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
                      <h3 className="box-title">Seleccionar Apiarios</h3>
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
                            disabled = {this.state.isLoadLocalidad}
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
                          <button type="button" className="btn btn-sm btn-primary btn-flat" onClick={this.filtrarApiarios}> 
                            <strong>
                              Buscar
                            </strong>
                          </button>
                        </div>
                    </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="box box-primary">
                      <div className="box-header with-border">
                        <h3 className="box-title">Mapa</h3>
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
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Detalle de los Apiarios</h3>
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
            <h3
              id="txt-titulo-colmenas"
              className="error-content"
              style={{ display: "none" }}
            >
              Colmenas del Apiario {this.getNombreApiario()}{" "}
            </h3>
            <hr />
            <div id="contenedor" className="row"></div> {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
        <ModalEditarApiario
          apiario={this.state.apiario_editar}
          show={this.state.isOpen}
          actionRefresh={this.refrescarComponente}
        />
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
export default connect(null,mapDispatchToProps)(DataTableApiario)
