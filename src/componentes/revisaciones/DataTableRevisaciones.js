import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import axios from "axios";
const $ = require('jquery');

var map = [];
var markersApiarios = [];
class DataTableRevisaciones extends Component {


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
            revisaciones : [],
            show : false,
            isDisableCiudad: true,     
            data : {  
              columns: [
                {
                  label: <span>Apiario</span>,
                  field: 'apiario', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Colmena</span>,
                  field: 'colmena', // con este campo identificamos las filas.
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
              ],
              rows: [
                {identificacion : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
        };

        // Methods
        this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
        this.handleClickParametros = this.handleClickParametros.bind(this);
        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.handleChangeApiario = this.handleChangeApiario.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this); 
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);
        this.descargarDatosPorDefecto = this.descargarDatosPorDefecto.bind(this);
        this.obtenerDatos = this.obtenerDatos.bind(this);
        this.createMarkersApiarios = this.createMarkersApiarios.bind(this);
        this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
        this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
        this.actualizarMarkers = this.actualizarMarkers.bind(this);
        this.getApiario = this.getApiario.bind(this);
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

    componentDidMount() {
        
      this._isMounted = true;
      this.renderMap();
    }
    
    buscarMisApiarios() {
      var url = 'https://backendcolmenainteligente.herokuapp.com/api/apiarios/colmenas';     
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

          console.log("Apiarios encontrados: ", data);

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

          this.setState(
              {
                  apiarios: data,
                  isDisableCiudad : false,
              },
              function() { 
                  
              }
          );

          document.getElementById("spinner-selector-apiario").style.display = "none";
          
          this.createMarkersApiarios(data);
          
      })
      .catch(function(error) {
          if (error.name == "AbortError") return;
          console.log("Request apiarios failed", error);
          //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
    }
  

    createMarkersApiarios(apiarios) {

      var infowindow = new window.google.maps.InfoWindow();
      for( var i = 0; i < apiarios.length; i++ ) {
      
        // Create An InfoWindow
        var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'].length + ' <br><b>Ciudad:</b> ' + apiarios[i]['localidad_chacra']
        
        // Create A Marker
        var marker = new window.google.maps.Marker({
          position: {lat: apiarios[i]['latitud'] , lng: apiarios[i]['longitud']},
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


    

  /**
   * 
   * @param {*} event 
   */
  handleChangeCiudad(event) {

      this.setState({ ciudad: event.target.value }, () => {
          this.emptySelector("selector-apiario");
          this.emptySelector("selector-colmena");
          this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----','Seleccionar');
          this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');
          if ( this.state.ciudad != "Seleccionar" ) {

              this.actualizarMarkers(this.state.ciudad);
            
              var apiarios_existentes = this.state.apiarios;
              console.log(apiarios_existentes);
              for( var i=0; i<apiarios_existentes.length; i++ ) {
                  
                  console.log("Apiarios",apiarios_existentes[i]);
                  if( apiarios_existentes[i]['localidad_chacra'] == this.state.ciudad ) {
                    this.createDefaultValueSelector(
                      "selector-apiario",  
                      apiarios_existentes[i]['id_apiario'], 
                      this.createTextSelect(apiarios_existentes[i]['direccion_chacra'], apiarios_existentes[i]['nombre_fantasia']),
                      apiarios_existentes[i]['id_apiario']
                    );
                  }
              }
          }
        });
  }


  handleChangeApiario(event) {
      this.setState({ apiario_id_seleccionado: event.target.value }, () => {
          this.emptySelector("selector-colmena");
          this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');
          if ( this.state.apiario_id_seleccionado != "Seleccionar" ) {
            
              var apiarios_existentes = this.state.apiarios;
              for( var i=0; i<apiarios_existentes.length; i++ ) {
                  if( apiarios_existentes[i]['id_apiario'] == this.state.apiario_id_seleccionado ) {
                    
                    var colmenas = apiarios_existentes[i]['colmenas'];
                    for( var j=0; j<colmenas.length; j++ ) {

                      this.createDefaultValueSelector(
                          "selector-colmena",
                          colmenas[j]['id'], 
                          this.createTextSelect(colmenas[j]['identificacion']),
                          colmenas[j]['id']
                        );
                    }
                  }
              }
          }
        });

        // Actualizo el marker.
        var apiario_id = event.target.value;
        var apiarios = this.getApiario(apiario_id);

        // Elimino todos los markers del mapa.
        for (var i = 0; i < markersApiarios.length; i++ ) {
        markersApiarios[i].setMap(null);
        }
        markersApiarios.length = 0;

        this.createMarkersApiarios(apiarios);
  }

  getApiario(apiario_id) {
      
    var resultado = [];

    var apiarios = this.state.apiarios;
    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['id_apiario'] == apiario_id) { resultado.push(apiarios[i]); break;}
      
    }

    return resultado;  
  }

  actualizarMarkers(ciudad) {  
        
    var apiarios = this.getApiariosCiudad(ciudad);

    // Elimino todos los markers del mapa.
    for (var i = 0; i < markersApiarios.length; i++ ) {
      markersApiarios[i].setMap(null);
    }
    markersApiarios.length = 0;

    this.createMarkersApiarios(apiarios);

}


getApiariosCiudad(ciudad) {

    var apiarios = this.state.apiarios;
    var resultados = [];

    for( var i = 0; i < apiarios.length; i++ ) {
      if( apiarios[i]['localidad_chacra'] == ciudad ) resultados.push(apiarios[i]);
    }

    return resultados;
}
   
 

  descargarDatosPorDefecto(event) {
    
      // Obtengo datos seleccionados por el usuario
      var apiario = document.getElementById("selector-apiario").value;
      if( apiario == 'Seleccionar' ) { alert("Seleccione un apiario"); return; }
      var colmena = document.getElementById("selector-colmena").value;
      if( colmena == 'Seleccionar' ) { alert("Seleccione una colmena"); return; }

      // Valido Si el usuario no seleccionó un rango
      var rango_seleccionado = document.getElementById("select-rango-fechas").value;
      if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

      var fecha_desde = '';
      var fecha_hasta = '';
      
      // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
      if( rango_seleccionado == "personalizado" ) {
          fecha_desde = document.getElementById("fecha-desde-rango").value;
          fecha_hasta = document.getElementById("fecha-hasta-rango").value;

          if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
          if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
          if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
      }

      // Datos
      var tipoAccion = {
          accion: "Rango",
          tipo: rango_seleccionado,
          fecha_actual: fecha_desde,
          fecha_pasada: fecha_hasta,
          horario_desde: "Todo el dia",
          horario_hasta: "Todo el dia",
          rango: 60,
      };

      
      
       document.getElementById("datatable-revisaciones").style.display = "block";
       console.log("tipoAccion",tipoAccion)
       this.crearCSV(apiario, colmena, tipoAccion); //ACA HAGO EL FETHC

  }


   
  crearCSV(apiario, colmena, tipoAccion) {

    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/revisaciones/datatable/csv");
    var params = {
      apiario: apiario, 
      colmena: colmena,
      tipoAccion: JSON.stringify(tipoAccion),
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));


    axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
        headers:{
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + cookie.get("token"),
        },
      }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.csv'); //or any other extension
          document.body.appendChild(link);
          link.click();
      })
      .catch(e => this.setState({ errors: e.response.data.errors }));
  }

  
   



   handleClickBuscarDatos(event) {
        
        // Obtengo datos seleccionados por el usuario
        var apiario = document.getElementById("selector-apiario").value;
        if( apiario == 'Seleccionar' ) { alert("Seleccione un apiario"); return; }
        var colmena = document.getElementById("selector-colmena").value;
        if( colmena == 'Seleccionar' ) { alert("Seleccione una colmena"); return; }

        // Valido Si el usuario no seleccionó un rango
        var rango_seleccionado = document.getElementById("select-rango-fechas").value;
        if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

        var fecha_desde = '';
        var fecha_hasta = '';
        
        // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
        if( rango_seleccionado == "personalizado" ) {
            fecha_desde = document.getElementById("fecha-desde-rango").value;
            fecha_hasta = document.getElementById("fecha-hasta-rango").value;

            if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
            if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
            if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
        }

        // Datos
        var tipoAccion = {
            accion: "Rango",
            tipo: rango_seleccionado,
            fecha_actual: fecha_desde,
            fecha_pasada: fecha_hasta,
            horario_desde: "Todo el dia",
            horario_hasta: "Todo el dia",
            rango: 60,
        };

        
        
         document.getElementById("datatable-revisaciones").style.display = "block";
         console.log("tipoAccion",tipoAccion)
         this.obtenerDatos(apiario, colmena, tipoAccion);
   }


   obtenerDatos(apiario, colmena, tipoAccion) {

    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/revisacion/apiario/colmena");
    var params = {
                    apiario: apiario, 
                    colmena: colmena,
                    tipoAccion: JSON.stringify(tipoAccion),
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
            cookie.remove("token");
            this.abortController.abort();
            this.props.logout();
            return;
          }

          
          console.log("Data",data);
          
          this.setState(
              {
                revisaciones: data['datos'],
                show: true,
              },
              function() { 
                  

                  var datos = [];
                  var columns = this.state.data.columns;
                  var datos_procesar = data['datos']; 

                  var nombre_apiario = "";
                  for( var i = 0; i < document.getElementById("selector-apiario").length; i++ ) {
                      if( document.getElementById("selector-apiario")[i].value == apiario ) {nombre_apiario = document.getElementById("selector-apiario")[i].text; break;}
                  }

                  var nombre_colmena = "";
                  for( var i = 0; i < document.getElementById("selector-colmena").length; i++ ) {
                    if( document.getElementById("selector-colmena")[i].value == colmena ) {nombre_colmena = document.getElementById("selector-colmena")[i].text; break;}
                  }
                  
                  console.log("Nombre apiario",nombre_apiario, nombre_colmena);

                  if( datos_procesar ) {

                        for( var i=0; i<datos_procesar.length; i++ ) {
                            var row = 
                                {
                                    apiario: nombre_apiario,//document.getElementById("selector-apiario")[parseInt(apiario)].text,
                                    colmena: nombre_colmena,//document.getElementById("selector-colmena")[parseInt(colmena)].text,
                                    fecha: datos_procesar[i]['fecha_revisacion'].split("-")[2]+"-"+datos_procesar[i]['fecha_revisacion'].split("-")[1]+"-"+datos_procesar[i]['fecha_revisacion'].split("-")[0],
                                    hora: datos_procesar[i]['hora_revisacion'].substr(0,5),
                                    temperatura: datos_procesar[i]['temperatura'] + " °C",
                                    humedad : datos_procesar[i]['humedad'] + " %",
                                };
                            
                            datos.push(row);
                        }
                  }
                  // Seteo los datos del DataTable.
                  this.setState(
                  {
                      data: {columns: columns, rows: datos},
                      show: true,
                  },function(){
                      console.log("Datos del DataTable",JSON.stringify(this.state.data.rows));
                  });
              }
          );
      
        
    })
    .catch(function(error) {
        if (error.name == "AbortError") return;
        console.log("Fallo en el Request a Clima", error);
        //alert("Ha ocurrido un error al obtener Clima: " + error);
    });

   }




   /**
     * Handler Onclick on btnEditar. 
     * Busca el pedido seleccionado, y lo setea en el estado de la clase.
     * 
     * @param {*} event 
     */
    handleClickBtnEditar(event) {
      
      console.log( event.target.id );

    }

    /**
     * Obtiene del servidor el pedido ingresado por el usuario.
     * 
     * @param {} event 
     */
    handleClickBtnConsultar(event) { 
        
      console.log( event.target.id );

     
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


     /**
     * El usuario cambio el rango de fechas en el panel de rango de fechas.
     * Muesto/oculto el div de rango de fechas personalizado.
     * 
     * @param {*} event 
     */
    handleChangeRangoFechas(event) {
        var rango_seleccionado = document.getElementById("select-rango-fechas").value;
        if( rango_seleccionado == "personalizado" ) {
            document.getElementById("div-rangos-personalizados").style.display = "block";
        }
        else {
            document.getElementById("div-rangos-personalizados").style.display = "none";
        }
    }

    /**
     * 
     * @param {*} event 
     */
    handleClickParametros(event) {
        if(  document.getElementById("div-parametros").style.display == "none" ) {
          document.getElementById("div-parametros").style.display = "block";
        }
        else {
          document.getElementById("div-parametros").style.display = "none";
        }
    }


    render() {


          
        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Revisaciones 
        <br/>
        <small>Histórico de Revisaciones de Temperatura y Humedad</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><i className="fa fa-thermometer-full active" /> Revisaciones</li>
        <li className="active">Histórico Revisaciones</li>
      </ol>
       {/* ComboBox 'Seleccionar Apiario' */}
       <div className="row">
              <div className="col-xs-6 col-md-6 col-lg-6">
                  <div id="box-revisaciones" className="box box-primary">
                      <div className="box-header with-border">
                          <h3 className="box-title">Parámetros de Búsqueda</h3>
                      </div>
                      <div className="box-body">

                          <div id="div-parametros">    
                            <div className="form-group">
                                <label htmlFor="b-buscar-datos" className="col-md-12"></label>
                                <div className="col-xs-12 col-md-12 col-lg-12">
                                  <b id="b-buscar-datos"> Ingrese parámetros:  </b>
                                  <hr /> 
                                </div>                                    
                            </div>
                            
                            {/* ComboBox Ciudad' */}
                            <div className="form-group">
                                  <label htmlFor="selector-ciudad" className="col-md-12">Ciudad <i id="spinner-selector-apiario" className="fa fa-spinner fa-pulse fa-sm fa-fw" /></label>
                                  <div className="col-md-12">
                                      <select className="form-control" id="selector-ciudad" name="selector-ciudad" defaultValue={'Seleccionar'} onChange={this.handleChangeCiudad} disabled={this.state.isDisableCiudad}>
                                          <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                          <option key={1} value={'Rawson'}>Rawson</option> 
                                          <option key={2} value={'Trelew'}>Trelew</option>
                                          <option key={3} value={'Gaiman'}>Gaiman</option>
                                          <option key={4} value={'Dolavon'}>Dolavon</option>
                                          <option key={5} value={'28 de Julio'}>28 de Julio</option>
                                      </select>
                                      <br />
                                  </div>
                              </div>

                              {/* ComboBox Apiario' */}
                              <div className="form-group">
                                  <label htmlFor="selector-apiario" className="col-md-12">Apiario </label>
                                  <div className="col-md-12">
                                      <select className="form-control" id="selector-apiario" name="selector-apiario" defaultValue={'Seleccionar'} onChange={this.handleChangeApiario} >
                                          <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                          {/* {optionItems} */}
                                      </select>
                                      <br />
                                  </div>
                              </div>

                              {/* ComboBox Colmena' */}
                              <div className="form-group">
                                  <label htmlFor="selector-colmena" className="col-md-12">Colmena <i id="spinner-colmena" className="fa fa-spinner fa-pulse fa-fw" style={{display:"none"}}></i> </label>
                                  <div className="col-md-12">
                                      <select className="form-control" id="selector-colmena" name="selector-colmena" defaultValue={'Seleccionar'} >
                                          <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                      </select>
                                      <br />
                                  </div>
                              </div>

                              {/* ComboBox Fechas' */}
                              <div className="form-group">
                                  <label htmlFor="select-rango-fechas" className="col-md-12">Rango de fechas</label>
                                  <div className="col-md-12">
                                      <select className="form-control" id="select-rango-fechas" name="select-rango-fechas" defaultValue={'Seleccionar'} onChange={this.handleChangeRangoFechas}>
                                          <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option>
                                          <option key={1} value={'hoy'}>Hoy</option>
                                          <option key={2} value={'7'}>Últimos 7 días</option>
                                          <option key={3} value={'14'}>Últimos 14 días</option>
                                          <option key={4} value={'30'}>Últimos 30 días</option>
                                          <option key={5} value={'personalizado'}>Rango personalizado</option>
                                      </select>
                                      <br />
                                  </div>
                              </div>

                              <div id="div-rangos-personalizados" style={{display : 'none'}}>
                                    
                                    <div className="form-group">
                                        <label htmlFor="rango-fechas-personalizado" className="col-md-12">Rango de fechas personalizado</label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="rango-fechas" className="col-md-12">Desde</label>
                                        <div className="col-md-12">
                                            <input id="fecha-desde-rango" className="form-control" type="date" name="bday" />  
                                            <br />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="rango-fechas" className="col-md-12">Hasta</label>
                                        <div className="col-md-12">
                                            <input id="fecha-hasta-rango" className="form-control" type="date" name="bday" />  
                                            <br />
                                        </div>
                                    </div>

                              </div>

                              <div className="form-group">
                                  <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                  <div className="col-xs-12 col-md-12 col-lg-12">
                                      <button id="btn-buscar-datos" type="button" onClick={this.handleClickBuscarDatos} className="btn btn-sm btn-success btn-flat pull-left"><i className="fa fa-search" /><strong> Buscar datos &nbsp;</strong></button>
                                      <button id="btn-descargar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-right" onClick={this.descargarDatosPorDefecto}><i className="fa fa-search" /> <strong>Descargar datos &nbsp;</strong></button>
                                  </div>                                    
                              </div>

                          </div>      
                          {/* ./div-parametros */}
                          
                      </div>
                      {/* ./box-body */}
                  </div>
                  {/* ./box */}
              </div> 
              {/* ./LEFT col */}
              <div className="col-xs-6 col-md-6 col-lg-6">
                  <div className="box box-primary">
                      <div className="box-header with-border">
                          <h3 className="box-title">Mapa</h3>
                      </div>
                      {/* /.box-header */}
                      <div className="box-body">
                          <div id="map"  style={{height: '400px'}}></div>
                      </div>
                  </div>
              </div>
              {/* ./RIGHT col */}
        </div>  
        {/* ./row */}
                
    </section>
    {/* Main content */}
    <section className="content">
      <div className="row">
        <div className="col-xs-12">
          {/* Aca comienza la tabla */}
          <div id="datatable-revisaciones" className="box box-primary" style={{display:"none"}}>
            <div className="box-header with-border">
              <h3 className="box-title">Histórico de Revisaciones</h3>
            </div>{/* /.box-header */}
            <div className="box-body">
             
               


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

               
            </div>{/* /.box-body */}
          </div>{/* /.box */}
        </div>{/* /.col */}
      </div>{/* /.row */}
    </section>{/* /.content */}
  </div>{/* /.content-wrapper */}
</div>

        )
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
export default connect(null,mapDispatchToProps)(DataTableRevisaciones)