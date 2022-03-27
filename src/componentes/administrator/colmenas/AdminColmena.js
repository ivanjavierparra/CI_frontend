import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import AdminColmenaInfo from "./AdminColmenaInfo";


var markersArray = [];
var markersApiarios = [];
var map = [];
var apiario_map = [];
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

class AdminColmena extends Component {
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
      apicultores : [],
      apiarios : [],
      colmenas : [],
      ciudad_seleccionada : "",
      apicultor_seleccionado : "",
      apiario_seleccionado : "",
      apiario_id : "",
      apicultor : "",
      nombre_fantasia : "",
      ciudad : "",
      direccion : "",
      localidad: "",
      latitud : "",
      longitud : "",
      fecha_creacion : "",
      propietario : "",
      descripcion : "",
      cantidad_colmenas : "",
    };

    // Asocio el metodo a la clase.
    this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
    this.handleChangeApicultor = this.handleChangeApicultor.bind(this);
    this.getApicultor = this.getApicultor.bind(this);
    this.emptySelector = this.emptySelector.bind(this);
    this.createTextSelect = this.createTextSelect.bind(this);
    this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
    this.crearMarkers = this.crearMarkers.bind(this);
    this.actualizarMarkers = this.actualizarMarkers.bind(this);
    this.getApiario = this.getApiario.bind(this);
    this.getApiariosApicultor = this.getApiariosApicultor.bind(this);
    this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
    this.handleClickBuscar = this.handleClickBuscar.bind(this);
    this.handleClickBuscarColmenas = this.handleClickBuscarColmenas.bind(this);  
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
   * 
   * 
   */
  initMap = () => {
      // Create A Map
      map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -43.3, lng: -65.3},
        zoom: 8
      });

      this.buscarApicultoresyApiarios();
      
  }

  buscarApicultoresyApiarios() {

    var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/apicultores_y_apiarios";
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
                apicultores : data['apicultores'],
                apiarios: data['apiarios'],
            },
            function() {
                
            }
            );
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
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
      this.emptySelector("selector-apicultor");
      this.emptySelector("selector-apiario");
      this.createDefaultValueSelector("selector-apicultor",0,'----- Seleccionar -----',"");
      this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----',"");
      if ( this.state.ciudad_seleccionada != "" ) {

          if( this.state.ciudad_seleccionada == "Todos"  ) {
             this.allBeekeepers();
          }
        
          var apiarios_existentes = this.state.apiarios;
          var apicultores_cargados = [];

          for( var i=0; i<apiarios_existentes.length; i++ ) {
              
              if( apiarios_existentes[i]['apiario']['localidad_chacra'] == this.state.ciudad_seleccionada ) {

                if(  apicultores_cargados.includes(apiarios_existentes[i]['apiario']['apicultor_id']) ) continue;

                apicultores_cargados.push(apiarios_existentes[i]['apiario']['apicultor_id']);

                var apicultor = this.getApicultor(apiarios_existentes[i]['apiario']['apicultor_id']);

                this.createDefaultValueSelector(
                  "selector-apicultor",  
                  apiarios_existentes[i]['apiario']['apicultor_id'], 
                  apicultor['name'] + " " + apicultor['lastname'],
                  apiarios_existentes[i]['apiario']['apicultor_id']
                );
              }
          }
      }
    });

  }

  allBeekeepers() {

    var apicultores = this.state.apicultores;

    for ( var i = 0; i < apicultores.length; i++ ) {

      this.createDefaultValueSelector(
        "selector-apicultor",  
        apicultores[i]['id'], 
        apicultores[i]['name'] + " " + apicultores[i]['lastname'],
        apicultores[i]['id']
      );

    }

    
  }


  getApicultor(apicultor_id) {

    var apicultores = this.state.apicultores;

    for ( var i = 0; i < apicultores.length; i++ ) {

      if( apicultores[i]['id'] == apicultor_id ) return apicultores[i];
    }

    return [];
  }


  handleChangeApicultor(event) {

    this.setState({ apicultor_seleccionado : event.target.value }, () => {
      this.emptySelector("selector-apiario");
      this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----',"");
      if ( this.state.apicultor_seleccionado != "" ) {

          var apiarios_existentes = this.state.apiarios;
          
          for( var i=0; i<apiarios_existentes.length; i++ ) {
              
              if( apiarios_existentes[i]['apiario']['apicultor_id'] == this.state.apicultor_seleccionado ) {

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

    var ciudad = document.getElementById("selector-ciudad").value;
    if( ciudad == "" ) { alert("Ingrese una localidad."); return; }

    var apicultor = document.getElementById("selector-apicultor").value;
    var apiario = document.getElementById("selector-apiario").value;

    var apiarios = [];

    apiarios = this.getApiariosCiudad(ciudad);

    if( apicultor != "" ) apiarios = this.getApiariosApicultor(apiarios, apicultor);

    if( apiario != "" ) apiarios = this.getApiario(apiario);

    this.actualizarMarkers(apiarios);

  }



    
  getApiariosCiudad(ciudad) {  

    var apiarios = this.state.apiarios;

    if( ciudad == "Todos" ) return apiarios;

    var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['localidad_chacra'] == ciudad ) resultado.push(apiarios[i]);

    }

    return resultado;

  }

  getApiariosApicultor(apiarios, apicultor_id) { 

    var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['apicultor_id'] == apicultor_id ) resultado.push(apiarios[i]);

    }

    return resultado;

  }

  getApiario(apiario_id) {  

    var apiarios = this.state.apiarios;

    var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['id'] == apiario_id ) { resultado.push(apiarios[i]); break; }

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

  
  crearMarkers(apiarios) {

    var infowindow = new window.google.maps.InfoWindow();
    

    for( var i=0; i < apiarios.length; i++ ) {

        // Create An InfoWindow
        //var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>En buen estado:</b> ' + apiarios[i]['contador']['verde'] + ' <br><b>En alerta:</b> ' + apiarios[i]['contador']['amarillo'] + ' <br><b>En peligro:</b> ' + apiarios[i]['contador']['rojo']
        var content = '<b>Apiario:</b> ' + apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'] +  ' <br><b>Ciudad:</b> ' + apiarios[i]['apiario']['localidad_chacra'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas']
        
        // Create A Marker
        var marker = new window.google.maps.Marker({
            position: {lat: apiarios[i]['apiario']['latitud'] , lng: apiarios[i]['apiario']['longitud']},
            map: map,
            title: 'Apiario',
            clickable: true
        })

        
        // Seteo ícono del marker
        if( apiarios[i]['estado_apiario'] == "verde" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        else if( apiarios[i]['estado_apiario'] == "amarillo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        else if( apiarios[i]['estado_apiario'] == "rojo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        

        

        // Agrego un listener al marker
        window.google.maps.event.addListener(marker, 'click', (function(marker, content, apiarios, i) {
        return function() {

            var apicultor = this.getApicultor(apiarios[i]['apiario']["apicultor_id"]);

            console.log(apiarios,i);
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
            this.setState({
                apiario_id : apiarios[i]['apiario']['id'],
                apicultor : apicultor['name'] + " " + apicultor['lastname'],
                nombre_fantasia : apiarios[i]['apiario']["nombre_fantasia"],
                direccion : apiarios[i]['apiario']["direccion_chacra"],
                ciudad : apiarios[i]['apiario']["localidad_chacra"],
                latitud : apiarios[i]['apiario']["latitud"],
                longitud : apiarios[i]['apiario']['longitud'],
                fecha_creacion : apiarios[i]['apiario']['created_at'].split(" ")[0],
                propietario : apiarios[i]['apiario']['propietario_chacra'],
                descripcion : apiarios[i]['apiario']['descripcion'],
                cantidad_colmenas : apiarios[i]['colmenas'],
            });

            // Centro el mapa donde el usuario hizo click.
            map.panTo(new window.google.maps.LatLng(apiarios[i]['apiario']["latitud"],apiarios[i]['apiario']["longitud"]));
        }
        })(marker, content, apiarios, i).bind(this));
    
  
        // Agrego el marker al arreglo global de markers.
        markersArray.push(marker);
    }
}


  
  

    
handleClickBuscarColmenas(event) {
        console.log(this.state.apiario_id);
        if( !this.state.apiario_id ) return alert("Seleccione un apiario del mapa.");
        document.getElementById("spinner").style.display = "block";

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiario/colmenas");
        var params = {
                        apiario_id: this.state.apiario_id, 
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
        
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(data); 
            document.getElementById("spinner").style.display = "none";

            var graficos = [];

            for (var i = 0; i < data.length; i++) {
              graficos.push(
                <AdminColmenaInfo
                  apiario={this.state.apiario_id}
                  colmena={data[i]}
                />
              );
            }
        
            ReactDOM.render(graficos, document.getElementById("contenedor"));
            
            
        })
        .catch(function(error) {
            console.log("Ha ocurrido un error", error);
            //alert("Ha ocurrido un error: " + error);
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
              Colmenas
              <br />
              <small>Detalle de las Colmenas</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="fake_url">
                  <i className="fa fa-forumbee" /> Colmenas
                </a>
              </li>
              <li className="active">Colmenas</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              {/* left column */}
              <div className="col-md-6">
                  <div className="box box-primary">
                    <div className="box-header with-border">
                      <h3 className="box-title">Mapa</h3>
                    </div>
                    {/* /.box-header */}
                    <div className="box-body">
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
                        <div className="form-group">
                          <label htmlFor="selector-apicultor">Apicultor</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="selector-apicultor"
                            name="selector-apicultor"
                            onChange={this.handleChangeApicultor}
                          >
                            <option value={""}>----- Seleccionar -----</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="selector-apiario">Apiario</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="selector-apiario"
                            name="selector-apiario"
                          >
                            <option value={""}>----- Seleccionar -----</option>
                          </select>
                        </div>
                        {/* /.box-body */}
                        <div className="form-group">
                          <button type="button" onClick={this.handleClickBuscar} className="btn btn-sm btn-primary btn-flat"> 
                            <strong>
                              Buscar
                            </strong>
                          </button>
                        </div>
                        <div id="map"  style={{height: '300px'}}></div>
                    </div>
                  </div>
              </div>
              {/*/.col (left) */}
              <div className="col-md-6">
                {/* general form elements */}
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Datos del Apiario</h3>
                  </div>
                  {/* /.box-header */}
                  {/* form start */}
                  <form role="form">
                    <div className="box-body">
                      <div className="form-group">
                        <strong><i className="fa fa-forumbee margin-r-5"></i> Apicultor</strong>
                        <p className="text-muted">
                          {this.state.apicultor}
                        </p>
                      </div>
                      <div className="form-group">
                        <strong><i className="fa fa-forumbee margin-r-5"></i> Ciudad</strong>
                        <p className="text-muted">
                          {this.state.ciudad}
                        </p>
                      </div>
                      <div className="form-group">
                        <strong><i className="fa fa-forumbee margin-r-5"></i> Nombre</strong>
                        <p className="text-muted">
                          {this.state.nombre_fantasia}
                        </p>
                      </div>
                      <div className="form-group">
                        <strong><i className="fa fa-forumbee margin-r-5"></i> Dirección</strong>
                        <p className="text-muted">
                          {this.state.direccion}
                        </p>
                      </div>
                      <div className="form-group">
                        <strong><i className="fa fa-forumbee margin-r-5"></i> Cantidad de Colmenas</strong>
                        <p className="text-muted">
                          {this.state.cantidad_colmenas}
                        </p>
                      </div>
                    </div>
                    <div className="box-footer">
                      <button type="button" onClick={this.handleClickBuscarColmenas} className="btn btn-primary btn-sm btn-flat"> 
                        <strong>
                          Ver Colmenas
                        </strong>
                      </button>
                      <div className="form-group">
                          <div className="col-xs-3 col-md-3 col-lg-3">
                            <i id={"spinner"} style={{display:"none"}} className="fa fa-spinner fa-pulse fa-sm fa-fw" />  
                          </div>                                    
                      </div>  
                    </div>
                  </form>
                </div>
                {/* /.box */}
              </div>
              {/* right column */}
            </div>{" "}
            {/* /.row */}
            <div id="contenedor" className="row">  
                  {/* <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo />
                  <AdminColmenaInfo /> */}
            </div> {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}

/**
 * Decidí NO utilizar ninguna librería para el manejo de Google Maps, como react-google-maps o google-maps-react,
 * en vez de ello, directamente uso los tags <script> donde pongo las url de google maps con su key.
 * Este método lo que hace es crear un script a mano, y ejecuta el script con la URL pasada como parámetro.
 * 
 */
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
export default connect(null,mapDispatchToProps)(AdminColmena)