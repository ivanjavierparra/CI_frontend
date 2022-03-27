import React, { Component } from "react";
import cookie from 'js-cookie';
import { MDBDataTable } from 'mdbreact';
import ReactDOM from 'react-dom';
import Apiario from "./Apiario";
import Colmena from "./Colmena";

var map = [];
var markersArray = [];


export default class TabApiarios extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apicultor : this.props.apicultor,
            apiarios : [],
            ciudad : "",
            ciudad_seleccionada : "",
            apiario_seleccionado : [],
            
            direccion_apiario : "",
            nombre_apiario : "",
            cantidad_colmenas : "",
            colmenas_verde : 0,
            colmenas_amarillo: 0,
            colmenas_rojo: 0,
            isCheckedApiario: false,
            isDisabledApiario: true,
            isDisabledEstadoApiario: true,

            variable : "",
            showContenedorGraficos : false,

            data : {  
              columns: [ 
                {
                  label: <span>Apiario</span>,
                  field: 'apiario', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Ciudad</span>,
                  field: 'ciudad', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Colmenas en Buen Estado</span>,
                  field: 'colmenas_buen_estado', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Colmenas en Alerta</span>,
                  field: 'colmenas_alerta', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Colmenas en Peligro</span>,
                  field: 'colmenas_peligro', 
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Total Colmenas</span>,
                  field: 'total_colmenas', 
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Acciones</span>,
                  field: 'acciones', 
                  sort: 'asc',
                  width: 150
                },
              ],
              rows: [
                {colmenas_alerta : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
        }

        // Methods
        this.buscarApiarios = this.buscarApiarios.bind(this);
        this.crearMarkers = this.crearMarkers.bind(this);
        this.crearFooter = this.crearFooter.bind(this);
        this.handleChangeChkApiario = this.handleChangeChkApiario.bind(this);
        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this);
        this.createDefaultValueSelector  = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.handleClickBuscar = this.handleClickBuscar.bind(this);
        this.getApiario = this.getApiario.bind(this);
        this.buscarApiarioCiudad = this.buscarApiarioCiudad.bind(this);
        this.actualizarMarkers = this.actualizarMarkers.bind(this);
        this.actualizarFooter = this.actualizarFooter.bind(this);
        this.actualizarDatatable = this.actualizarDatatable.bind(this);
        this.crearDataTable = this.crearDataTable.bind(this);
        this.handleClickVerColmenas = this.handleClickVerColmenas.bind(this);
        this.handleClickLimpiarFiltros = this.handleClickLimpiarFiltros.bind(this);
        this.filtrarApiariosEstado = this.filtrarApiariosEstado.bind(this);
        this.crearApiarios = this.crearApiarios.bind(this);
        this.handleClickEstadoColmena = this.handleClickEstadoColmena.bind(this);
        this.buscarColmenas = this.buscarColmenas.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.renderMap();
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDa66qPWnvxts56tHudQJ_eQF0pZhUWPBQ&libraries=geometry,drawing,places&language=es&types=(cities)&callback=initMap");
        window.initMap = this.initMap;
    }
    

    /**
     * 
     */
    initMap = () => {
        // Create A Map
        map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -43.3, lng: -65.3},
        zoom: 8
        });

        
        // Busco todos los apiarios
        this.buscarApiarios();
        
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


    buscarApiarios() {

        var url = new URL("http://localhost:8000/api/apiarios/apicultor/id");
        var params = {
                        apicultor_id: this.state.apicultor.id, 
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

            /* Si alguien modificó el token que está en las cookies entonces Laravel me responderá que el token es inválido, por lo que cerraré automáticamente la sesión */
            // if ( typeof data.status !== 'undefined' ) {
            //     console.log("Modificaste el token....", data.status);
            //     cookie.remove("token");
            //     this.abortController.abort();
            //     return;
            // }

            console.log("TabApiarios",data);

            this.setState(
            {
                apiarios: data,
            },
            function() {
                
            }
            );

            this.crearMarkers(data);
            this.crearFooter(data);
            // this.crearDataTable(data);
            //this.crearApiarios(data);
            
            

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
            var content = '<b>Apiario:</b> ' + apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>En buen estado:</b> ' + apiarios[i]['contador']['verde'] + ' <br><b>En alerta:</b> ' + apiarios[i]['contador']['amarillo'] + ' <br><b>En peligro:</b> ' + apiarios[i]['contador']['rojo']
            
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
                    //apicultor : apiarios[i]["apicultor"],
                    direccion_apiario : apiarios[i]["apiario"]["direccion_chacra"],
                    nombre_apiario : apiarios[i]["apiario"]["nombre_fantasia"],
                    cantidad_colmenas : apiarios[i]['colmenas'],
                });

                // Centro el mapa donde el usuario hizo click.
                map.panTo(new window.google.maps.LatLng(apiarios[i]["apiario"]["latitud"],apiarios[i]["apiario"]["longitud"]));
            }
            })(marker, content, apiarios, i).bind(this));
        
      
            // Agrego el marker al arreglo global de markers.
            markersArray.push(marker);
        }
    }


    crearFooter(apiarios) {

        var contador = {
           "verde" : 0,
           "amarillo" : 0,
           "rojo" : 0,
        };

        for( var i=0; i < apiarios.length; i++ ) {
          
          contador["verde"] += apiarios[i]["contador"]["verde"];
          contador["amarillo"] += apiarios[i]["contador"]["amarillo"];
          contador["rojo"] += apiarios[i]["contador"]["rojo"];
          
        }

        this.setState({
            colmenas_verde : contador['verde'],
            colmenas_amarillo : contador['amarillo'],
            colmenas_rojo : contador['rojo'],
        });

        console.log("Contadores",contador);
    }


    crearDataTable(apiarios) {

      var datos = [];
      var columns = this.state.data.columns;

      for( var i=0; i<apiarios.length; i++ ) {
        var row = 
            {   
                apiario: apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'],
                ciudad: apiarios[i]['apiario']['localidad_chacra'],
                colmenas_buen_estado: apiarios[i]['contador']['verde'],
                colmenas_alerta: apiarios[i]['contador']['amarillo'],
                colmenas_peligro: apiarios[i]['contador']['rojo'],
                total_colmenas : apiarios[i]['colmenas'],
                //acciones : <span data-toggle="modal" data-target="#modal_colmena_info"><button id={'consultar-' + data[i]['id']} className="btn btn-success btn-sm fa fa-eye" onClick={this.handleClickBtnConsultar} data-toggle="tooltip" data-placement="top" title="Ver Temperatura y Humedad"> </button></span>
                acciones : <button id={'consultar-' + apiarios[i]['apiario']['id']} className="btn btn-success btn-sm fa fa-eye" onClick={this.handleClickVerColmenas} data-toggle="tooltip" data-placement="top" title="Ver Colmenas"> </button>
            };
        
          datos.push(row);
      }
      
      this.setState(
      {
          data: {columns: columns, rows: datos},
          show: true,
      },function(){
          // console.log("/////// " + JSON.stringify(this.state.data.rows));
      });

    }


    handleClickVerColmenas(event) { 
        
      // console.log( event.target.id );
      var id = event.target.id;      
      var apiario_id = id.split("-")[1];
      
      console.log( "Apiario Seleccionado", apiario_id );


      

      // this.setState(
      //   {
      //       colmena_consultar: colmena,
      //       isOpenInfo: true,//!this.state.isOpenInfo,
      //       isOpen: false,
            
      //   },function(){
            
      //   });  

      //var graficos = [];

      //ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));
      
      //graficos.push(<ColmenaInfo apiario={this.state.apiario_seleccionado} colmena={colmena} />);
      
      //ReactDOM.render(graficos, document.getElementById('contenedor')); 

    }

    /**
     * 
     * @param {*} event 
     */
    handleChangeChkApiario(event) {
      console.log(event.target.id);

      var rbtn_seleccionado = event.target.id;
      // rbtn-apiario rbtn-estado-apiario
      if( rbtn_seleccionado == "rbtn-apiario" ) {
        this.setState({
          isDisabledApiario : false,
          isDisabledEstadoApiario: true,
        });
      }
      else {
        this.setState({
          isDisabledApiario : true,
          isDisabledEstadoApiario: false,
        });
      }

      // this.setState({
      //     isCheckedApiario: !this.state.isCheckedApiario,
      //     isDisabledApiario : !this.state.isDisabledApiario,
      // }, () => {
          
      // });
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


  handleChangeCiudad(event) {
    
    this.setState({ ciudad_seleccionada : event.target.value }, () => {
      this.emptySelector("selector-apiario");
      this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----',"");
      if ( this.state.ciudad_seleccionada != "" ) {
        
          var apiarios_existentes = this.state.apiarios;
          
          
          for( var i=0; i<apiarios_existentes.length; i++ ) {
              
              if( apiarios_existentes[i]['apiario']['localidad_chacra'] == this.state.ciudad_seleccionada ) {
                this.createDefaultValueSelector(
                  "selector-apiario",  
                  apiarios_existentes[i]['apiario']['id'], 
                  this.createTextSelect(apiarios_existentes[i]['apiario']['direccion_chacra'], apiarios_existentes[i]['apiario']['nombre_fantasia']),
                  apiarios_existentes[i]['apiario']['id']
                );
              }
          }
      }
    });
  }


  handleClickBuscar(event) {
      var ciudad = this.state.ciudad_seleccionada;
      var apiario_id = document.getElementById("selector-apiario").value;
      var apiario_checked = document.getElementById("rbtn-apiario").checked;
      var estado = document.getElementById("selector-estado-apiario").value;
      var estado_apiario_checked = document.getElementById("rbtn-estado-apiario").checked;

      if( ciudad == "" ) { alert("Ingrese una localidad."); return; }

      if( apiario_checked && apiario_id == "" ) { alert("Ingrese un apiario."); return; }
      if( estado_apiario_checked && estado == "" ) { alert("Ingrese un estado."); return; }

      
      var apiarios = [];

      if( ciudad == "Todos" ) {
          console.log("Todos");
          apiarios = this.state.apiarios;
          if( estado_apiario_checked ) {
            console.log("estado_checked todos");
            apiarios = this.filtrarApiariosEstado(apiarios,estado);
          }
      }
      else if ( apiario_checked ) {
        console.log("apiario_checked");
         apiarios = this.getApiario(apiario_id);
      }
      else if ( estado_apiario_checked ) {
        console.log("estado_checked y ciudad");
        apiarios = this.buscarApiarioCiudad(ciudad);
        apiarios = this.filtrarApiariosEstado(apiarios,estado);
      }
      else {
        console.log("ciudad");
          apiarios = this.buscarApiarioCiudad(ciudad);
      }

      // Actualizo markers
      this.actualizarMarkers(apiarios);

      // Actualzo footer
      this.actualizarFooter(apiarios);

      // Actualizo datatable
      //this.actualizarDatatable(apiarios);

      // Creo Detalle de Apiarios
      this.crearApiarios(apiarios);
      
  }


  getApiario(apiario_id) {  

    var apiarios = this.state.apiarios;
    var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {
      
      if( apiarios[i]['apiario']['id'] == apiario_id ) { resultado.push(apiarios[i]); break; }
    }

    return resultado;
  }

  filtrarApiariosEstado(apiarios, estado) {

      var resultado = [];

      for( var i = 0; i < apiarios.length; i++ ) {
      
        if( apiarios[i]['color'] == estado )  resultado.push(apiarios[i]);
      }
  
      return resultado;

  }


  buscarApiarioCiudad(ciudad) {
    var apiarios = this.state.apiarios;
    var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {
      
      if( apiarios[i]['apiario']['localidad_chacra'] == ciudad ) resultado.push(apiarios[i]);
    }

    return resultado;
  }


  actualizarMarkers(apiarios) {

    // Elimino todos los markers del mapa.
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;

    this.crearMarkers(apiarios);

  }

  
  actualizarFooter(apiarios) {

    this.crearFooter(apiarios);
    
  }


  actualizarDatatable(apiarios) {
      // this.crearDataTable(apiarios);
  }

  crearApiarios(apiarios) {

    var resultado = [];

    // Recorro apiarios y creo componentes
    for( var i=0; i< apiarios.length; i++ ) {
         resultado.push(<Apiario apiario={apiarios[i]['apiario']} apiario_id={apiarios[i]['apiario']['id']} direccion_chacra={apiarios[i]['apiario']['direccion_chacra']} key={apiarios[i]['apiario']['id']} action={this.props.action}  />); 
    }
    
    // buscaria las colmenas, y nada mas...despues que el chart maneje sus cosas.
    ReactDOM.render(resultado, document.getElementById('contenedor-apiarios'));

  }

  handleClickLimpiarFiltros(event) {
    this.setState({
      isDisabledApiario: true,
      isDisabledEstadoApiario : true,
    });

    document.getElementById("rbtn-apiario").checked = false;
    document.getElementById("rbtn-estado-apiario").checked = false;
    document.getElementById("selector-apiario").value = "";
    document.getElementById("selector-estado-apiario").value = "";
  }
  
  /**
   * 
   * @param {*} event 
   */
  handleClickEstadoColmena(event) {

    if( this.state.apiario_seleccionado == "" ) {alert("Seleccione un apiario del mapa.");return;}

    ReactDOM.unmountComponentAtNode(document.getElementById("contenedor-apiarios"));
    console.log("apiario seleccionado",this.state.apiario_seleccionado);
    this.buscarColmenas(this.state.apiario_seleccionado);

  }


  buscarColmenas(apiario_id) {

        var url = new URL("http://localhost:8000/api/apiario/colmenas");
        var params = {
                         apiario_id: apiario_id, 
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
        
        //     //  Muestro por consola todos los datos que vinieron del servidor
            console.log(data); 

            var graficos = [];

            for (var i = 0; i < data.length; i++) {
              graficos.push(
                <Colmena
                  apiario={apiario_id}
                  colmena={data[i]}
                />
              );
            }
        
            ReactDOM.render(graficos, document.getElementById("contenedor-apiarios"));
            
            
        })
        .catch(function(error) {
            console.log("Request failed", error);
        //     //alert("Ha ocurrido un error: " + error);
        });
    

  }

  
    render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div>
            <div className="box-header with-border">
              <h3 className="box-title"><strong>Estado Actual de los Apiarios</strong></h3>
            </div>
            {/* /.box-header */}
            <div className="box-body">
              <div className="row">
                <div className="col-md-8">
                <div className="row">
                    <div className="col-md-12"> 
                      <div className="form-group">
                        <label htmlFor="selector-ciudad">Localidad</label>
                        <select
                          className="form-control"
                          style={{ width: "100%" }}
                          id="selector-ciudad"
                          name="selector-ciudad"
                          onChange={this.handleChangeCiudad}
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
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <div className="form-group">
                          <label htmlFor="selector-apiario"><input type="radio" id="rbtn-apiario" name="radio-opcion" defaultChecked={this.state.isCheckedApiario} onChange={this.handleChangeChkApiario} /> Apiario</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="selector-apiario"
                            name="selector-apiario"
                            disabled={this.state.isDisabledApiario}
                          >
                            <option value={""}>----- Seleccionar -----</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="selector-estado-apiario"><input type="radio" id="rbtn-estado-apiario" name="radio-opcion" defaultChecked={this.state.isCheckedApiario} onChange={this.handleChangeChkApiario} /> Estado del Apiario</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="selector-estado-apiario"
                            name="selector-estado-apiario"
                            disabled={this.state.isDisabledEstadoApiario}
                          >
                            <option key={1} value={""}>----- Seleccionar -----</option>
                            <option key={2} value={"verde"}>Buen Estado</option>
                            <option key={3} value={"amarillo"}>En Alerta</option>
                            <option key={4} value={"rojo"}>En Peligro</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12" style={{marginBottom:"20px"}}>
                      
                      <div className="btn-group pull-left">
                        
                          {/* <div className="form-group"> */}
                            <button 
                              id="btn-buscar"
                              type="button" 
                              className="btn btn-sm btn-primary btn-flat"
                              onClick={this.handleClickBuscar}
                            > 
                              <strong>
                                Buscar
                              </strong>
                            </button>
                          {/* </div> */}
                      </div>
                      <div className="btn-group pull-right">
                        
                          {/* <div className="form-group"> */}
                            <button 
                              id="btn-buscar"
                              type="button" 
                              className="btn btn-sm btn-primary btn-flat"
                              onClick={this.handleClickLimpiarFiltros}
                            > 
                              <strong>
                                Limpiar Filtros
                              </strong>
                            </button>
                          {/* </div> */}

                      </div>
                      
                    </div>
                    <div className="col-md-12">
                      <br></br>
                    </div>
                    <div className="col-md-12">
                      <div id="map" style={{height: '400px'}}></div>
                    </div>
                    {/* /.chart-responsive */}
                </div>
                </div>
                {/* /.col */}
                <div className="col-md-4">
                  <p className="text-center">
                    <strong>Leyenda</strong>
                  </p>
                  <p><small><i className="fa fa-map-marker fa-lg margin-r-5" style={{color:'green'}}></i> Apiarios en Buen Estado</small></p>
                  <p><small><i className="fa fa-map-marker fa-lg margin-r-5" style={{color:'orange'}}></i> Apiarios en Alerta</small></p>
                  <p><small><i className="fa fa-map-marker fa-lg margin-r-5" style={{color:'red'}}></i> Apiarios en Peligro</small></p>
                  <hr />
                  <p className="text-center">
                    <strong>Detalle del Apiario</strong>
                  </p>
                  <small>
                  <div className="progress-group">
                    <strong><i className="fa fa-forumbee margin-r-5"></i> Ciudad</strong>
                    <p className="text-muted">
                        {this.state.ciudad}
                    </p>
                  </div>
                  {/* /.progress-group */}
                  <div className="progress-group">
                    <strong><i className="fa fa-forumbee margin-r-5"></i> Dirección Chacra</strong>
                    <p className="text-muted">
                        {this.state.direccion_apiario}
                    </p>
                  </div>
                  {/* /.progress-group */}
                  <div className="progress-group">
                    <strong><i className="fa fa-forumbee margin-r-5"></i> Nombre del Apiario </strong>
                    <p className="text-muted">
                        {this.state.nombre_apiario}
                    </p>
                  </div>
                  {/* /.progress-group */}
                  <div className="progress-group">
                    <strong><i className="fa fa-forumbee margin-r-5"></i> Cantidad de Colmenas</strong>
                    <p id="txt-mapa-colmenas" className="text-muted">
                        {this.state.cantidad_colmenas}
                    </p>
                  </div>
                  {/* /.progress-group */}
                  <center>
                  <div className="form-group">
                      <button 
                        type="button" 
                        className="btn btn-xs btn-success btn-flat"
                        onClick={this.handleClickEstadoColmena}
                      > 
                        <strong>
                          Ver Estado de Colmenas
                        </strong>
                      </button>
                    </div>
                    </center>
                  </small>
                </div>
                {/* /.col */}
              </div>
              {/* /.row */}
            </div>
            {/* ./box-body */}
            <div className="box-footer">
              <div className="row">
                <div className="col-sm-4 col-xs-6">
                  <div className="description-block border-right">
                    <span className="description-percentage text-green">
                      <i className="fa fa-caret-up" /> {this.state.colmenas_verde}
                    </span>
                    <h5 className="description-header">Colmenas en Buen Estado</h5>
                    {/* <span className="description-text">TOTAL REVENUE</span> */}
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-4 col-xs-6">
                  <div className="description-block border-right">
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.colmenas_amarillo}
                    </span>
                    <h5 className="description-header">Colmenas en Alerta</h5>
                    {/* <span className="description-text">TOTAL REVENUE</span> */}
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-4 col-xs-6">
                  <div className="description-block border-right">
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.colmenas_rojo}
                    </span>
                    <h5 className="description-header">Colmenas en Peligro</h5>
                    {/* <span className="description-text">TOTAL REVENUE</span> */}
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
              </div>
              {/* /.row */}
            </div>
            {/* /.box-footer */}
          </div>
          {/* /.box */}
          <div id="contenedor-apiarios"></div>
        </div>
        {/* /.col */}
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
