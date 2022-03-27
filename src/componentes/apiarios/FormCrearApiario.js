import React, { Component } from "react";
import { connect } from 'react-redux';
import cookie from 'js-cookie';
//import Map from '../mapas/Map';
import Credentials from '../mapas/Credentials';
// import {
//   GoogleMap,
//   withScriptjs,
//   withGoogleMap,
//   Marker,
// } from 'react-google-maps';

const mapURL = `https://maps.googleapis.com/maps/api/js?key=${Credentials.mapsKey2}&libraries=${Credentials.libraries}&language=${Credentials.language}&types=${Credentials.types}`;
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

class FormCrearApiario extends Component {
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
      direccion: "",
      localidad: "",
      nombre_fantasia : "",
      propietario: "",
      latitud: 0,
      longitud: 0,
      fecha_creacion: "01-01-1970",
      descripcion: "",
      isDisabledLatitud: true,
      isDisabledLongitud: true,
    };

    // Asocio el metodo a la clase.
    this.handleChangeLocalidad = this.handleChangeLocalidad.bind(this);
    this.handleChangeDireccion = this.handleChangeDireccion.bind(this);
    this.handleChangeNombreFantasia = this.handleChangeNombreFantasia.bind(this);
    this.handleChangeLatitud = this.handleChangeLatitud.bind(this);
    this.handleChangeLongitud = this.handleChangeLongitud.bind(this);
    this.handleChangeFechaCreacion = this.handleChangeFechaCreacion.bind(this);
    this.handleChangePropietario = this.handleChangePropietario.bind(this);
    this.handleChangeDescripcion = this.handleChangeDescripcion.bind(this);
    this.handleSubmitApiario = this.handleSubmitApiario.bind(this);
    this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
    this.createMarkersApiarios = this.createMarkersApiarios.bind(this);
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
   * https://www.youtube.com/watch?v=dAhMIF0fNpo
   * https://github.com/elharony/Udacity-P8-Neighborhood-Map-Project-Explained/blob/master/src/App.js
   * 
   */
  initMap = () => {
      // Create A Map
      map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -43.3, lng: -65.3},
        zoom: 8
      });

      // Busco todos mis apiarios para despues mostrarlos como markers en el mapa.
      this.buscarMisApiarios();

     
      // Si el usuario clickea sobre mapa se crear un marker
      map.addListener('click',function(event) {
        
        // Obtengo Latitud y Longitud.
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log( latitude + ', ' + longitude );

        // Seteo datos
        document.getElementById("latitud").value = latitude;
        document.getElementById("longitud").value = longitude;
        this.setState({
          latitud:latitude,
          longitud: longitude
        });
        
        
        // Elimino todos los markers del mapa.
        for (var i = 0; i < markersArray.length; i++ ) {
          markersArray[i].setMap(null);
        }
        markersArray.length = 0;
        
        // Agrego un marker al mapa, donde el usuario clickeo.
        var marker = new window.google.maps.Marker({
            position: event.latLng, 
            map: map
        });
        
        // Agrego el marker al arreglo global de markers.
        markersArray.push(marker);


        // Centro el mapa donde el usuario hizo click.
        map.panTo(new window.google.maps.LatLng(latitude,longitude));


      }.bind(this));
  }

  /**
   * Busco todos mis apiarios. Los muestro como markers en el mapa.
   * 
   */
  buscarMisApiarios() {
    var url = "http://localhost:8000/api/apiarios";
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

        this.setState(
          {
            apiarios: data,
          },
          function() {
            console.log(data);
          }
        );

        this.createMarkersApiarios(data);

      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
        //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
  }


  /**
   * Por cada uno de los apiarios crea un marker en el mapa. 
   * Cada marker tendra un listener para eventos de click, con el cual 
   * se mostrará un info window con su información.
   * 
   * @param Array apiarios
   */
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

  /**
   * El usuario ingresó una localidad nueva.
   * @param {*} event
   */
  handleChangeLocalidad(event) {
    console.log(event.target.value);
    

    if (event.target.value != "") {
      document.getElementById("localidad").style.borderColor = "";
    }

    this.setState({ localidad: event.target.value },() => {
        if( this.state.localidad == "Rawson" ) {
          // Centro el mapa donde el usuario hizo click.
          map.panTo(new window.google.maps.LatLng(coordenadas["Rawson"]['latitud'],coordenadas["Rawson"]['longitud']));
        }
        else if( this.state.localidad == "Trelew" ) {
          // Centro el mapa donde el usuario hizo click.
          map.panTo(new window.google.maps.LatLng(coordenadas["Trelew"]['latitud'],coordenadas["Trelew"]['longitud']));
        }
        else if( this.state.localidad == "Gaiman" ) {
          // Centro el mapa donde el usuario hizo click.
          map.panTo(new window.google.maps.LatLng(coordenadas["Gaiman"]['latitud'],coordenadas["Gaiman"]['longitud']));
        }
        else if( this.state.localidad == "Dolavon" ) {
          // Centro el mapa donde el usuario hizo click.
          map.panTo(new window.google.maps.LatLng(coordenadas["Dolavon"]['latitud'],coordenadas["Dolavon"]['longitud']));
        }
        else if( this.state.localidad == "28 de Julio" ) {
          // Centro el mapa donde el usuario hizo click.
          map.panTo(new window.google.maps.LatLng(coordenadas["28 de Julio"]['latitud'],coordenadas["28 de Julio"]['longitud']));
        }
        
    });

    
  }

  /**
   * El usuario ingreso una dirección nueva.
   * @param {*} event
   */
  handleChangeDireccion(event) {
    this.setState({ direccion: event.target.value });
    if (event.target.value != "") {
      document.getElementById("direccion").style.borderColor = "";
      return;
    }
  }

  /**
   * El usuario ingresa un nombre de fantasía
   * @param {*} event 
   */
  handleChangeNombreFantasia(event) {
    this.setState({ nombre_fantasia: event.target.value });
  }

  /**
   *
   * @param {*} event
   */
  handleChangeLatitud(event) {
    console.log("Latitud: " + event.target.value);
    this.setState({ latitud: event.target.value });
    document.getElementById("latitud").style.borderColor = "";
  }

  /**
   *
   * @param {*} event
   */
  handleChangeLongitud(event) {
    console.log("Longitud: " + event.target.value);
    this.setState({ longitud: event.target.value });
    document.getElementById("longitud").style.borderColor = "";
  }

  /**
   *
   * @param {*} event
   */
  handleChangeFechaCreacion(event) {
    console.log("Fecha de Creación: " + event.target.value);
    this.setState({ fecha_creacion: event.target.value });
    document.getElementById("fecha_creacion").style.borderColor = "";
  }

  /**
   * El usuario ingreso un propietario nuevo.
   * @param {*} event
   */
  handleChangePropietario(event) {
    this.setState({ propietario: event.target.value });
    if (event.target.value != "") {
      document.getElementById("propietario").style.borderColor = "";
    }
  }

  /**
   * El usuario ingresó una nueva descripción.
   * @param {*} event
   */
  handleChangeDescripcion(event) {
    this.setState({ descripcion: event.target.value });
    if (event.target.value != "") {
      document.getElementById("descripcion").style.borderColor = "";
    }
  }

  /**
   *
   * @param {*} event
   */
  handleSubmitApiario(event) {
    // Evito que el formulario se recargue cuando apreto en el botón SUBMIT.
    event.preventDefault();

    if (this.state.direccion == "") {
      document.getElementById("direccion").style.borderColor = "red";
      alert("Ingrese una dirección válida.");
      return;
    }

    if (this.state.nombre_fantasia == "") {
      document.getElementById("nombre_fantasia").style.borderColor = "red";
      alert("Ingrese una nombre alternativo.");
      return;
    }

    if (this.state.localidad == "") {
      document.getElementById("localidad").style.borderColor = "red";
      alert("Seleccione una localidad.");
      return;
    }

    // Valido latitud.
    if (this.state.latitud == 0) {
      document.getElementById("latitud").style.borderColor = "red";
      alert("Ingrese una latitud válida.");
      return;
    }

    // Valido longitud.
    if (this.state.longitud == 0) {
      document.getElementById("longitud").style.borderColor = "red";
      alert("Ingrese una longitud válida.");
      return;
    }

    // Valido fecha.
    if (this.state.fecha_creacion == "") {
      document.getElementById("fecha_creacion").style.borderColor = "red";
      alert("Ingrese una fecha válida.");
      return;
    }

    // Valido propietario.
    if (this.state.propietario == "") {
      document.getElementById("propietario").style.borderColor = "red";
      alert("Ingrese propietario.");
      return;
    }

    // Valido descripción.
    if (document.getElementById("descripcion").value == "") {
      document.getElementById("descripcion").style.borderColor = "red";
      alert("Ingrese una descripcion.");
      return;
    }

    // END POINT para crear Apiario.
    var url = "http://localhost:8000/api/apiarios";
    // DATA a enviar.
    var data = {
      nombre_fantasia : this.state.nombre_fantasia,
      latitud: this.state.latitud,
      longitud: this.state.longitud,
      fecha_creacion: this.state.fecha_creacion,
      descripcion: document.getElementById("descripcion").value,
      direccion_chacra: "Chacra " + this.state.direccion,
      localidad_chacra: this.state.localidad,
      propietario_chacra: this.state.propietario
    };

    // AJAX POST
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
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

        console.log(data);
        if (data["resultado" != 200]) {alert(data["mensaje"]);return;}
          
          // Mensaje de EXITO.
          alert(data["mensaje"]);

          // Cambio estado.
          this.setState({
            direccion: "",
            nombre_fantasia : "",
            localidad: "",
            propietario: "",
            latitud: 0,
            longitud: 0,
            fecha_creacion: "01-01-1970",
            descripcion: ""
          });

          /* TODO  Reseteo formulario.*/
          document.getElementById("direccion").value = "";
          document.getElementById("nombre_fantasia").value = "";
          document.getElementById("localidad").value = "";
          document.getElementById("latitud").value = "";
          document.getElementById("longitud").value = "";
          document.getElementById("fecha_creacion").value = "";
          document.getElementById("propietario").value = "";
          document.getElementById("descripcion").value = "";

          window.location.reload(true);
      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
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
              Apiarios
              <br />
              <small>Nuevo Apiario</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="fake_url">
                  <i className="fa fa-map-marker" /> Apiarios
                </a>
              </li>
              <li className="active">Registrar Apiario</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              {/* left column */}
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                {/* general form elements */}
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Crear nuevo Apiario</h3>
                  </div>
                  {/* /.box-header */}
                  {/* form start */}
                  <form role="form" onSubmit={this.handleSubmitApiario}>
                    <div className="box-body">
                      <div className="form-group">
                        <label htmlFor="propietario">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre_fantasia"
                          name="nombre_fantasia"
                          value={this.state.nombre_fantasia}
                          onChange={this.handleChangeNombreFantasia}
                          placeholder="Ingresar nombre"
                        />
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-3">
                            <label htmlFor="chacra" name="chacra">
                              Chacra
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={"Chacra"}
                              id="chacra"
                              name="chacra"
                              disabled
                            />
                          </div>
                          <div className="col-md-9">
                            <label htmlFor="direccion" name="direccion">
                              N°
                            </label>
                            <input
                              type="number"
                              min={1}
                              className="form-control"
                              value={this.state.direccion}
                              onChange={this.handleChangeDireccion}
                              id="direccion"
                              name="direccion"
                              placeholder="Ingresar dirección"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="localidad">Localidad</label>
                        <select
                          className="form-control"
                          style={{ width: "100%" }}
                          onChange={this.handleChangeLocalidad}
                          id="localidad"
                          name="localidad"
                        >
                          <option value={""}>----- Seleccionar -----</option>
                          <option value={"Rawson"}>Rawson</option>
                          <option value={"Trelew"}>Trelew</option>
                          <option value={"Gaiman"}>Gaiman</option>
                          <option value={"Dolavon"}>Dolavon</option>
                          <option value={"28 de Julio"}>28 de Julio</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="latitud">Latitud</label>
                        <input
                          type="number"
                          className="form-control"
                          value={this.state.latitud}
                          onChange={this.handleChangeLatitud}
                          id="latitud"
                          name="latitud"
                          placeholder="Ingresar latitud"
                          disabled={this.state.isDisabledLatitud}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="longitud">Longitud</label>
                        <input
                          type="number"
                          className="form-control"
                          value={this.state.longitud}
                          onChange={this.handleChangeLongitud}
                          id="longitud"
                          name="longitud"
                          placeholder="Ingresar longitud"
                          disabled={this.state.isDisabledLongitud}
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
                          value={this.state.fecha_creacion}
                          onChange={this.handleChangeFechaCreacion}
                          placeholder="Ingresar Fecha de Creación"
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
                          value={this.state.propietario}
                          onChange={this.handleChangePropietario}
                          placeholder="Ingresar propietario"
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
                        ></textarea>
                      </div>
                    </div>
                    {/* /.box-body */}
                    <div className="box-footer">
                      <button type="submit" className="btn btn-primary btn-flat"> 
                        <strong>
                          Guardar
                        </strong>
                      </button>
                    </div>
                  </form>
                </div>
                {/* /.box */}
              </div>
              {/*/.col (left) */}
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <div className="box box-primary">
                    <div className="box-header with-border">
                      <h3 className="box-title">Mapa</h3>
                    </div>
                    {/* /.box-header */}
                    <div className="box-body">
                        <div id="map"  style={{height: '600px'}}></div>
                    </div>
                  </div>
              </div>
              {/* right column */}
            </div>{" "}
            {/* /.row */}
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
export default connect(null,mapDispatchToProps)(FormCrearApiario)