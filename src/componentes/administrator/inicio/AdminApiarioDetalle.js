import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import AdminColmenaInfo from '../colmenas/AdminColmenaInfo';

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

class AdminApiarioDetalle extends Component {
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
      apiario_id : !this.props.location.state ? "" : this.props.location.state.apiario_id,
      apicultor : "",
      apicultor_data : "",
      apicultores : [],
      apiario : [],
      ciudad_seleccionada : "",
      apicultor_seleccionado : "",
      apicultor : "",
      nombre_fantasia : "",
      direccion : "",
      localidad: "",
      latitud : "",
      longitud : "",
      fecha_creacion : "",
      propietario : "",
      descripcion : "",
      isDisabledCiudadBuscar: true,
      isDisabledApicultorBuscar: true, 
      isDisabledApicultor: true,
      isDisabledNombreFantasia : true,
      isDisabledCiudad: true,
      isDisabledDireccion: true,
      isDisabledLocalidad: true,
      isDisabledLatitud: true,
      isDisabledLongitud: true,
      isDisabledFechaCreacion: true,
      isDisabledPropietario: true,
      isDisabledDescripcion: true,
    };

    // Asocio el metodo a la clase.
    this.buscarApicultoresyApiarios = this.buscarApicultoresyApiarios.bind(this);
    this.crearMarkers = this.crearMarkers.bind(this);
    this.handleClickBuscarColmenas = this.handleClickBuscarColmenas.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.renderMap();
    console.log("apiario_id",this.state.apiario_id);
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

        if( !this.state.apiario_id ) return;

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/admin/apiarios/detalle");
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

            console.log(data);

            this.setState(
            {
                apicultor : data['apicultor'],
                apiario: data['apiarios'],
                colmenas : data['colmenas'],
            },
            function() {
                this.crearMarkers(this.state.apiario);
            }
            );

            
            

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
  }


  
  crearMarkers(apiario) {

    var infowindow = new window.google.maps.InfoWindow();
    
    // Create An InfoWindow
    //var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'] + ' <br><b>En buen estado:</b> ' + apiarios[i]['contador']['verde'] + ' <br><b>En alerta:</b> ' + apiarios[i]['contador']['amarillo'] + ' <br><b>En peligro:</b> ' + apiarios[i]['contador']['rojo']
    var content = '<b>Apiario:</b> ' + apiario.direccion_chacra + " - " + apiario.nombre_fantasia +  ' <br><b>Ciudad:</b> ' + apiario.localidad_chacra +  ' <br><b>Colmenas:</b> ' + this.state.colmenas
    
    // Create A Marker
    var marker = new window.google.maps.Marker({
        position: { lat: parseFloat(apiario.latitud) , lng: parseFloat(apiario.longitud) },
        map: map,
        title: 'Apiario',
        clickable: true
    })

    
    // Seteo ícono del marker
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');


    // Agrego un listener al marker
    window.google.maps.event.addListener(marker, 'click', (function(marker, content, apiario) {
    return function() {

        var apicultor = this.state.apicultor;

        console.log(apiario);
        
        infowindow.setContent(content);
        infowindow.open(map, marker);
        this.setState({
            /* apicultor_data : apicultor['name'] + " " + apicultor['lastname'],
            nombre_fantasia : apiarios[i]["nombre_fantasia"],
            direccion : apiarios[i]["direccion_chacra"],
            localidad : apiarios[i]["localidad_chacra"],
            latitud : apiarios[i]["latitud"],
            longitud : apiarios[i]['longitud'],
            fecha_creacion : apiarios[i]['created_at'].split(" ")[0],
            propietario : apiarios[i]['propietario_chacra'],
            descripcion : apiarios[i]['descripcion'], */
        });

        // Centro el mapa donde el usuario hizo click.
        map.panTo(new window.google.maps.LatLng(apiario.latitud,apiario.longitud));
    }
    })(marker, content, apiario).bind(this));


    // Agrego el marker al arreglo global de markers.
    markersArray.push(marker);
    
}


handleClickBuscarColmenas(event) {

  if( !this.state.apiario_id ) return;
  console.log(this.state.apiario_id);

  var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiario/colmenas");
  var params = {
                  apiario_id: this.state.apiario.id, 
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
              Apiario
              <br />
              <small>Detalle del Apiario</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="fake_url">
                  <i className="fa fa-map-marker" /> Apiarios
                </a>
              </li>
              <li className="active">Apiarios</li>
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
                        {/* /.box-body */}
                        <div id="map"  style={{height: '600px'}}></div>
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
                        <label htmlFor="apicultor">Apicultor</label>
                        <input
                          type="text"
                          className="form-control"
                          id="apicultor"
                          name="apicultor"
                          placeholder=""
                          disabled={this.state.isDisabledApicultor}
                          value = {!this.state.apicultor.name ? " " : this.state.apicultor.name + " " + this.state.apicultor.lastname}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="nombre_fantasia">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre_fantasia"
                          name="nombre_fantasia"
                          placeholder=""
                          disabled={this.state.isDisabledNombreFantasia}
                          value = {!this.state.apiario.nombre_fantasia ? "" : this.state.apiario.nombre_fantasia}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="direccion">Direccion</label>
                        <input
                          type="text"
                          className="form-control"
                          id="direccion"
                          name="direccion"
                          placeholder=""
                          disabled={this.state.isDisabledDireccion}
                          value = {!this.state.apiario.direccion_chacra ? " " : this.state.apiario.direccion_chacra}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="localidad">Localidad</label>
                        <input
                          type="text"
                          className="form-control"
                          id="localidad"
                          name="localidad"
                          placeholder=""
                          disabled={this.state.isDisabledLocalidad}
                          value = {!this.state.apiario.localidad_chacra ? " "  : this.state.apiario.localidad_chacra}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="latitud">Latitud</label>
                        <input
                          type="number"
                          className="form-control"
                          id="latitud"
                          name="latitud"
                          placeholder=""
                          disabled={this.state.isDisabledLatitud}
                          value = {!this.state.apiario.latitud ? " " : this.state.apiario.latitud}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="longitud">Longitud</label>
                        <input
                          type="number"
                          className="form-control"
                          id="longitud"
                          name="longitud"
                          placeholder=""
                          disabled={this.state.isDisabledLongitud}
                          value = {!this.state.apiario.longitud ? "" : this.state.apiario.longitud}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="fecha_creacion">
                          Fecha de Creación
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="fecha_creacion"
                          name="fecha_creacion"
                          placeholder=""
                          disabled={this.state.isDisabledFechaCreacion}
                          value = {!this.state.apiario.fecha_creacion ? "" : this.state.apiario.fecha_creacion}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="propietario">
                          Propietario de la Chacra
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="propietario"
                          name="propietario"
                          placeholder=""
                          disabled={this.state.isDisabledPropietario}
                          value = {!this.state.apiario.propietario_chacra ? "" : this.state.apiario.propietario_chacra}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <br />
                        <textarea
                          id="descripcion"
                          className="form-control"
                          name="descripcion"
                          placeholder="Ingresar una descripción"
                          rows="10"
                          cols="50"
                          disabled={this.state.isDisabledDescripcion}
                          value = {!this.state.apiario.descripcion ? "" : this.state.apiario.descripcion}
                        ></textarea>
                      </div>
                    </div>
                    <div className="box-footer">
                      <button type="button" onClick={this.handleClickBuscarColmenas} className="btn btn-primary btn-sm btn-flat"> 
                        <strong>
                          Ver Colmenas
                        </strong>
                      </button>
                    </div>
                  </form>
                </div>
                {/* /.box */}
              </div>
              {/* right column */}
            </div>{" "}
            {/* /.row */}
          </section>
          {/* /.content */}
          <section className="content">
            <div id="contenedor" className="row"> </div>
          </section>
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
export default connect(null,mapDispatchToProps)(AdminApiarioDetalle)