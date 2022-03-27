import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact'
import ModalColmenaEstado from './ModalColmenaEstado';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
const $ = require('jquery')

var map = [];
var markersApiarios = [];

class DataTableEstadoColmena extends Component {

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
            colmenas : [],
            apiario_seleccionado : 0,
            colmena_seleccionada : 0,
            ciudad: "",
            colmena_editar : [],
            colmena_consultar : [],
            isOpen: false,
            isOpenInfo: false,
            isDisableCiudad: true,
            show : false,     
            data : {  
              columns: [
                {
                  label: <span>ID</span>,
                  field: 'colmena_id', // con este campo identificamos las filas. 
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Identificación</span>,
                  field: 'identificacion', // con este campo identificamos las filas. 
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
                  field: 'humedad', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Fecha y Hora</span>,
                  field: 'fecha_hora', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Estado</span>,
                  field: 'estado', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span></span>,
                  field: 'consultar', 
                  sort: 'asc',
                  width: 150
                },
              ],
              rows: [
                {temperatura : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
            identificacion_colmena : "",
            estado_colmena : [],
            temperatura : "",
            humedad : "",
            senial : "",
            isOpenModalEstado : false,
        };


        // Methods
        this.handleClickParametros = this.handleClickParametros.bind(this);
        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);
        this.obtenerNombreApiario = this.obtenerNombreApiario.bind(this);
        this.obtenerColmena = this.obtenerColmena.bind(this);
        this.handleClickBtnConsultar = this.handleClickBtnConsultar.bind(this);
        this.handleClickBtnEditar = this.handleClickBtnEditar.bind(this);
        this.refrescarComponente = this.refrescarComponente.bind(this);
        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this);
        this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
        this.createMarkersApiarios = this.createMarkersApiarios.bind(this);
        this.actualizarMarkers = this.actualizarMarkers.bind(this);
        this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
        this.handleChangeApiario = this.handleChangeApiario.bind(this);
        this.getApiario = this.getApiario.bind(this);

        this.obtenerEstado = this.obtenerEstado.bind(this);

        this.getColmenas = this.getColmenas.bind(this);

        this.handleChangeColmena = this.handleChangeColmena.bind(this);

        this.getIDColmenas = this.getIDColmenas.bind(this);
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

      var url = 'http://localhost:8000/api/apiarios/estados';     
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

          this.setState(
              {
                  apiarios: data,
                  isDisableCiudad: false,
              },
              function() { 
                  console.log("Apiarios encontrados: " + JSON.stringify(this.state.apiarios));
              }
          ); 
          
          document.getElementById("spinner-apiario-sm").style.display = "none";
          document.getElementById("spinner-ciudad").style.display = "none";
          

          this.createMarkersApiarios(data);
          
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Request apiarios failed", error);
          //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
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

    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

      this._isMounted = true;
      this.renderMap();
      
      // Seteo variable para que no se ejecute ModalColmenaInfo.js
      this.setState(
        {
            isOpenInfo : false,
        },
        function() { 
            // Naranja fanta...
        }
      );
        
   }

   createMarkersApiarios(apiarios) {

    var infowindow = new window.google.maps.InfoWindow();
    for( var i = 0; i < apiarios.length; i++ ) {
    
      // Create An InfoWindow
      var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>Ciudad:</b> ' + apiarios[i]['localidad_chacra']
      
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



   handleClickBuscarDatos(event) {

        this.setState(
          {
              isOpenInfo : false,
          },
          function() { 
              // Naranja fanta...
          }
        );

       
        var id_apiario = document.getElementById("selector-apiario").value;
        var id_colmena = document.getElementById("selector-colmena").value;

        if( id_apiario == "Seleccionar" ) { alert("Seleccione un apiario."); return; }
        if( id_colmena == "Seleccionar" ) { alert("Seleccione una colmena."); return; }

        // Mostramos el spinner
        document.getElementById("spinner-btn-buscar").style.display = "block";
       
        var url = new URL("http://localhost:8000/api/apiarios/colmenas/estado");
        var params = {
                        apiario_id: id_apiario, 
                        colmena_id : id_colmena,
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

            console.log("Datos", data);
            var estados = data;

              this.setState({
                    estado_colmena : data,
                    show: true,
              },
              function() { 
                    
                        var datos = [];
                        var columns = this.state.data.columns;
                        

                        if( estados ) {
                          var row = 
                              {
                                  colmena_id: estados['colmena_id'], 
                                  identificacion: estados['identificacion'],
                                  temperatura: estados['temperatura'],
                                  humedad: estados['humedad'],
                                  fecha_hora: estados['fecha_hora'],
                                  estado: estados['estado'],
                                  consultar: <span data-toggle="modal" data-target="#modal_colmena_estado"><button id={'consultar-' + id_colmena} className="btn btn-success btn-sm fa fa-eye" onClick={this.handleClickBtnConsultar} data-toggle="tooltip" data-placement="top" title="Ver Temperatura y Humedad"> </button></span>
                              };
                          
                          datos.push(row);
                        }

                         

                        this.setState(
                          {
                              data: {columns: columns, rows: datos},
                          },function(){
                              // Mostramos el contenedor
                              document.getElementById("contenedor-colmenas").style.display = "block";
                              document.getElementById("spinner-btn-buscar").style.display = "none";
                          });
                  }
              );
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Fallo en el Request a Colmenas", error);
        });
   }

   obtenerNombreApiario() {
      var id_apiario = this.state.apiario_seleccionado;
      var apiarios = this.state.apiarios;

      for( var i=0; i < apiarios.length; i++ ) {
          if( apiarios[i]['id_apiario'] == id_apiario ) {
            var text = apiarios[i]['direccion_chacra'];
            if ( !apiarios[i]['nombre_fantasia'] ) return text;
            text = text + " - " + apiarios[i]['nombre_fantasia'];
            return text;
          };
      }
      
      return "";
   }

   obtenerEstado(id_colmena, array_estados) {

      for( var i = 0; i < array_estados.length; i++ ) {
        if( id_colmena == array_estados[i][0] ) return array_estados[i][1];
      }

   }


emptySelector(id_selector) {
  var select = document.getElementById(id_selector);
  var length = select.options.length;
  for (var i = length-1; i >= 0; i--) {
    select.options[i] = null;
  }
    
}

createDefaultValueSelector(id_selector, key, text, value) {
  
  var selector = document.getElementById(id_selector);

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


    // Completo selector-apiario
    this.setState({ ciudad: event.target.value }, () => {
      this.emptySelector("selector-apiario");
      this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----','Seleccionar');
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

    // Elimino selector-colmena
    this.emptySelector("selector-colmena");
    this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');

   }


   handleChangeApiario(event) {

    var apiario_id = event.target.value;
    var apiarios = this.getApiario(apiario_id);

    // Elimino todos los markers del mapa.
    for (var i = 0; i < markersApiarios.length; i++ ) {
      markersApiarios[i].setMap(null);
    }
    markersApiarios.length = 0;

    this.createMarkersApiarios(apiarios);
    
    this.setState({ apiario_seleccionado: event.target.value }, () => {
        this.emptySelector("selector-colmena");
        this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');
        
        if ( this.state.apiario_seleccionado != "Seleccionar" ) { 
          var colmenas = this.getColmenas(apiario_id);
          console.log(colmenas);
          for( var i = 0; i < colmenas.length; i++ ){
            this.createDefaultValueSelector(
              "selector-colmena",
              colmenas[i]['id'], 
              colmenas[i]['identificacion'], 
              colmenas[i]['id']
            );
          }
        }
    });

   }

   
   getColmenas(apiario_seleccionado) {
      var apiarios = this.state.apiarios;
      console.log("dadasd",apiarios);
      for( var i = 0; i < apiarios.length; i++ ) {
          if(apiarios[i]["id_apiario"] == apiario_seleccionado) return apiarios[i]['colmena'];
      }
      return [];
   }


   getApiario(apiario_id) {
      
    var resultado = [];

    var apiarios = this.state.apiarios;
    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['id_apiario'] == apiario_id) { resultado.push(apiarios[i]); break;}
      
    }

    return resultado;  
  }


  handleChangeColmena(event) {
    this.setState({ colmena_seleccionada: event.target.value, identificacion_colmena : this.getIDColmenas(event.target.value)}, () => {

      
      
    });
  }


  getIDColmenas(colmena_id) {
      var colmenas = this.getColmenas(this.state.apiario_seleccionado);
      for( var i = 0; i < colmenas.length; i++ ) {
        if(colmenas[i]["id"] == colmena_id) return colmenas[i]['identificacion'];
      }
      return "";
  }


   refrescarComponente() {
      window.location.reload(true);
   }


   /**
     * Handler Onclick on btnEditar. 
     * Busca el pedido seleccionado, y lo setea en el estado de la clase.
     * 
     * @param {*} event 
     */
    handleClickBtnEditar(event) {
      
      console.log( event.target.id );

      var id = event.target.id;
      var id_colmena = id.split("-")[1];
      
      var colmena = this.obtenerColmena(id_colmena);
      

      this.setState(
      {
          colmena_editar: colmena,
          isOpen: true,//!this.state.isOpen,
          isOpenInfo: false,
          
      },function(){
          
      });  

    }

    /**
     * Obtiene del servidor el pedido ingresado por el usuario.
     * 
     * @param {} event 
     */
    handleClickBtnConsultar(event) { 
        
      console.log( event.target.id );
      var id = event.target.id;      
      var colmena_id = id.split("-")[1];

      var id_apiario = document.getElementById("selector-apiario").value;
      var id_colmena = document.getElementById("selector-colmena").value;

      if( id_apiario == "Seleccionar" ) { alert("Seleccione un apiario."); return; }
      if( id_colmena == "Seleccionar" ) { alert("Seleccione una colmena."); return; }
      
      var url = new URL("http://localhost:8000/api/colmenas/estado/detalle");
      var params = {
                      apiario_id: id_apiario, 
                      colmena_id : id_colmena,
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

          console.log("Datos", data);

          this.setState({
              temperatura :  data['temperatura'],
              humedad : data['humedad'],
              senial : data['senial'],
              isOpenModalEstado : true,
          });

          // alert(
          //   "Temperatura: " + data['temperatura'] + 
          //   "Humedad: " + data['humedad'] + 
          //   "Señal" + data['senial']
          // );

            
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Fallo en el Request a Colmenas", error);
      });



      /*var colmena = this.obtenerColmena(colmena_id);
      
      console.log( "Colmena Seleccionada", colmena );

      this.setState(
        {
            colmena_consultar: colmena,
            isOpenInfo: true,//!this.state.isOpenInfo,
            isOpen: false,
            
        },function(){
            
        });  */

      //var graficos = [];

      //ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));
      
      //graficos.push(<ColmenaInfo apiario={this.state.apiario_seleccionado} colmena={colmena} />);
      
      //ReactDOM.render(graficos, document.getElementById('contenedor')); 

    }


    /**
     * 
     * @param {*} id_colmena 
     */
    obtenerColmena(id_colmena) {

        var colmenas = this.state.colmenas;
        for ( var i=0; i<colmenas.length; i++ ) {
            if( colmenas[i]['id'] == id_colmena ) return colmenas[i];
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
        Colmenas 
        <br/>
        <small>Consultar estado de una colmena</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-forumbee" /> Colmenas</a></li>
        <li className="active"><a href="#">Consultar Estado</a></li>
      </ol>

          {/* ComboBox 'Seleccionar Apiario' */}
       <div className="row" >
                    
            {/* left column */}
            <div className="col-md-6 col-xs-12">
                {/* general form elements */}
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Consultar estado de una colmena<i
                          id={"spinner-apiario-sm"}
                          className="fa fa-spinner fa-pulse fa-sm fa-fw"
                        />
                    </h3>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">

                    <div id="div-parametros">    

                          <div className="form-group">
                              <label htmlFor="b-buscar-datos" className="col-md-12"></label>
                              <div className="col-xs-12 col-md-12 col-lg-12">
                                <b id="b-buscar-datos"> Ingrese parámetros:</b>
                                <hr /> 
                              </div>                                    
                          </div>    

                          <div className="form-group">
                                <label htmlFor="selector-ciudad" className="col-md-12">Ciudad <i id={"spinner-ciudad"} className="fa fa-spinner fa-pulse fa-sm fa-fw" /></label>
                                <div className="col-md-12">
                                    <select className="form-control" id="selector-ciudad" name="selector-ciudad" onChange={this.handleChangeCiudad} defaultValue={'Seleccionar'} disabled={this.state.isDisableCiudad}>
                                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                            <option key={1} value={"Rawson"}>Rawson</option>
                                            <option key={2} value={"Trelew"}>Trelew</option>
                                            <option key={3} value={"Gaiman"}>Gaiman</option>
                                            <option key={4} value={"Dolavon"}>Dolavon</option>
                                            <option key={5} value={"28 de Julio"}>28 de Julio</option>
                                    </select>
                                    <br />
                                </div>
                            </div>

                          <div className="form-group">
                                <label htmlFor="selector-apiario" className="col-md-12">Apiario </label>
                                <div className="col-md-12">
                                    <select className="form-control" id="selector-apiario" name="selector-apiario" defaultValue={'Seleccionar'} onChange={this.handleChangeApiario}>
                                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                            {/* {optionItems} */}
                                    </select>
                                    <br />
                                </div>
                            </div>


                            <div className="form-group">
                                <label htmlFor="selector-colmena" className="col-md-12">Colmena </label>
                                <div className="col-md-12">
                                    <select className="form-control" id="selector-colmena" name="selector-colmena" defaultValue={'Seleccionar'} onChange={this.handleChangeColmena}>
                                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                            {/* {optionItems} */}
                                    </select>
                                    <br />
                                </div>
                            </div>


                            <div className="form-group">
                                <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                <div className="col-xs-3 col-md-3 col-lg-3">
                                    <button id="btn-buscar-datos" type="button" onClick={this.handleClickBuscarDatos} className="btn btn-sm btn-flat btn-primary pull-left"><i className="fa fa-search" /> <strong>Buscar datos &nbsp;</strong></button>
                                </div>                                    
                            </div>

                            
                      </div>

                      

                    <div className="form-group">
                        <div className="col-xs-12 col-md-12 col-lg-12">
                          <center>
                          <i id="spinner-btn-buscar" style={{display:"none"}} className="fa fa-spinner fa-pulse fa-lg fa-fw" />
                          </center>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-12">
                            <center>
                            <label id="txt-msg-apiario" className="col-md-12" style={{color:"green", display:"none"}}>(*) Este apiario no tiene colmenas.</label>
                            </center>
                        </div>
                    </div>

                  </div> 
                  {/* ./box-body */}
                </div>  
                {/* ./ box */}
            </div>  
            {/* ./col left   */}
            <div className="col-md-6 col-xs-12">
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
              {/* right column */}
      </div> 
      {/* ./row */}
          

    </section>
    {/* Main content */}
    <section className="content">
      <div className="row">
        <div className="col-xs-12">
          {/* Aca comienza la tabla */}
          <div id="contenedor-colmenas" className="box box-primary" style={{display:"none"}}>
            <div className="box-header with-border">
              <h3 className="box-title">Estado de la colmena</h3>
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
                                                            searching={false}
                                                            paging={false}
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

      <div id="contenedor" className="row"> 
                           
      </div> {/* /.row */}

    </section>{/* /.content */}
  </div>{/* /.content-wrapper */}
  <ModalColmenaEstado 
      apiario={this.state.apiario_seleccionado} 
      colmena= {this.state.identificacion_colmena}//{this.state.colmena_seleccionada} 
      show={this.state.isOpenInfo} 
      temperatura={this.state.temperatura}
      humedad={this.state.humedad}
      senial={this.state.senial}
  />
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
export default connect(null,mapDispatchToProps)(DataTableEstadoColmena)