import React, { Component } from "react";
import { connect } from 'react-redux';
import cookie from 'js-cookie';

var map = [];
var markersApiarios = [];
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

class FormCrearColmena extends Component {
  
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
      apiario_seleccionado: 0,
      numero_colmena: "",
      fecha_creacion: "",
      raza_abeja : "",
      descripcion: "",
      ciudad: "",
      isDisabledCiudad: true,
    };

    // Asocio el metodo a la clase.
    this.handleChangeApiario = this.handleChangeApiario.bind(this);
    this.handleChangeNumeroColmena = this.handleChangeNumeroColmena.bind(this);
    this.handleChangeFechaCreacion = this.handleChangeFechaCreacion.bind(this);
    this.handleChangeRazaAbeja = this.handleChangeRazaAbeja.bind(this);
    this.handleSubmitColmena = this.handleSubmitColmena.bind(this);
    this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
    this.emptySelector = this.emptySelector.bind(this);
    this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
    this.createTextSelect = this.createTextSelect.bind(this);
    this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
    this.createMarkersApiarios = this.createMarkersApiarios.bind(this);
    this.actualizarMarkers = this.actualizarMarkers.bind(this);
    this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
    this.getApiario = this.getApiario.bind(this);
    this.actualizarMarkersApiario = this.actualizarMarkersApiario.bind(this);
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
            isDisabledCiudad : false,
          },
          function() {
            console.log(
              "Apiarios encontrados: " + JSON.stringify(this.state.apiarios)
            );
          }
        );

        this.createMarkersApiarios(data);

        // Ocultamos el spinner
        document.getElementById("spinner-apiario-sm").style.display = "none";
      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
        //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
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

  /**
   * Método del ciclo de vida de la clase: Busco los apiarios existentes.
   */
  componentDidMount() {
    this._isMounted = true;
    this.renderMap();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }


  emptySelector() {
      var select = document.getElementById("apiario");
      var length = select.options.length;
      for (var i = length-1; i >= 0; i--) {
        select.options[i] = null;
      }
      
  }

createDefaultValueSelector(key, text, value) {
    
    var selector = document.getElementById("apiario");

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
   * 
   * @param {*} event 
   */
  handleChangeCiudad(event) {
      this.setState({ ciudad: event.target.value }, () => {
        this.emptySelector();
        this.createDefaultValueSelector(0,'----- Seleccionar -----','');
        if ( this.state.ciudad != "" ) {

            this.actualizarMarkers(this.state.ciudad);
          
            var apiarios_existentes = this.state.apiarios;
            console.log(apiarios_existentes);
            for( var i=0; i<apiarios_existentes.length; i++ ) {
                
                console.log("Apiarios",apiarios_existentes[i]);
                if( apiarios_existentes[i]['localidad_chacra'] == this.state.ciudad ) {
                  this.createDefaultValueSelector(
                    apiarios_existentes[i]['id_apiario'], 
                    this.createTextSelect(apiarios_existentes[i]['direccion_chacra'], apiarios_existentes[i]['nombre_fantasia']),
                    apiarios_existentes[i]['id_apiario']
                  );
                }
            }
        }
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
  handleChangeApiario(event) {
    console.log("ID de la chacra seleccionada: " + event.target.value);
    this.setState({ apiario_seleccionado: event.target.value });
    document.getElementById("apiario").style.borderColor = "";

    this.actualizarMarkersApiario(event.target.value);
  } 

  actualizarMarkersApiario(apiario_id) {
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




  /**
   *
   * @param {*} event
   */
  handleChangeNumeroColmena(event) {
    console.log("numero de colmena ingresada: " + event.target.value);
    this.setState({ numero_colmena: event.target.value });
    document.getElementById("numero-colmena").style.borderColor = "";
  }


  /**
   * 
   * @param {*} event 
   */
  handleChangeRazaAbeja(event) {
    this.setState({ raza_abeja: event.target.value });
  }

  /**
   *
   * @param {*} event
   */
  handleChangeFechaCreacion(event) {
    console.log("Fecha de Creacion ingresada: " + event.target.value);
    this.setState({ fecha_creacion: event.target.value });
    document.getElementById("fecha-creacion").style.borderColor = "";
  }

  /**
   *
   * @param {*} event
   */
  handleSubmitColmena(event) {
    // Evito que el formulario se recargue cuando apreto en el botón SUBMIT.
    event.preventDefault();

    // Valido chacra.
    if (
      this.state.apiario_seleccionado === 0 ||
      this.state.apiario_seleccionado === ""
    ) {
      document.getElementById("apiario").style.borderColor = "red";
      alert("Seleccione un apiario.");
      return;
    }

    // Valido colmena.
    if (this.state.numero_colmena === "") {
      document.getElementById("numero-colmena").style.borderColor = "red";
      alert("Ingrese identificación de la colmena.");
      return;
    }

    // Valido fecha de creación.
    if (this.state.fecha_creacion === "") {
      document.getElementById("fecha-creacion").style.borderColor = "red";
      alert("Ingrese una fecha válida.");
      return;
    }

    // Valido la raza de la abeja.
    if( this.state.raza_abeja === "" ) {
      document.getElementById("raza_abeja").style.borderColor = "red";
      alert("Ingrese raza abeja.");
      return;
    }

    // Valido descripción.
    if (document.getElementById("descripcion").value === "") {
      document.getElementById("descripcion").style.borderColor = "red";
      alert("Ingrese una descripcion.");
      return;
    }

    // Si está todo OK muestro el spinner
    document.getElementById("spinner-btn-aceptar").style.display = "block";
    // END POINT para crear Apiario.
    var url = "http://localhost:8000/api/colmenas";
    // DATA a enviar.
    var data = {
      apiario_id: this.state.apiario_seleccionado,
      identificacion: this.state.numero_colmena,
      fecha_creacion: this.state.fecha_creacion,
      raza_abeja: this.state.raza_abeja,
      descripcion: document.getElementById("descripcion").value
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
        // Oculto el spinner
        document.getElementById("spinner-btn-aceptar").style.display = "none";

        if (data["resultado" === 200]) {
          // Mensaje de EXITO.
          alert(data["mensaje"]);

          // Cambio estado.
          this.setState({
            apiarios: [],
            apiario_seleccionado: 0,
            numero_colmena: "",
            fecha_creacion: "",
            descripcion: ""
          });

          /* TODO  Reseteo formulario.*/
          document.getElementById("apiario").value = "";
          document.getElementById("numero-colmena").value = "";
          document.getElementById("fecha-creacion").value = "";
          document.getElementById("raza_abeja").value = "";
          document.getElementById("descripcion").value = "";
        } else {
          // Mensaje de ERROR.
          alert(data["mensaje"]);
        }
      })
      .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request failed", error);
        //alert("Ha ocurrido un error: " + error);
      });
  }

  render() {
    // let apiarios_existentes = this.state.apiarios;
    // let optionItems = apiarios_existentes.map(apiario => (
    //   <option key={apiario.id_apiario} value={apiario.id_apiario}>
    //     Apiario - {apiario.direccion_chacra} - ({apiario.localidad_chacra})
    //   </option>
    // ));

    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>
              Colmenas
              <br />
              <small>Nueva Colmena</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-forumbee" /> Colmenas
                </a>
              </li>
              <li className="active">Registrar Colmena</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row" style={{ justifyContent: "center" }}>
              {/* left column */}
              <div className="col-md-6">
                {/* general form elements */}
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Crear nueva Colmena <i
                          id={"spinner-apiario-sm"}
                          className="fa fa-spinner fa-pulse fa-sm fa-fw"
                        />
                    </h3>
                  </div>
                  {/* /.box-header */}
                  {/* form start */}
                  <form role="form" onSubmit={this.handleSubmitColmena}>
                    <div className="box-body">
                      <div className="form-group">
                        <label htmlFor="ciudad">Ciudad</label>{" "}
                        <select
                          className="form-control"
                          style={{ width: "100%" }}
                          onChange={this.handleChangeCiudad}
                          id="ciudad"
                          name="ciudad"
                          disabled={this.state.isDisabledCiudad}
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
                        <label htmlFor="apiario">Apiario</label>{" "}
                        <select
                          className="form-control"
                          style={{ width: "100%" }}
                          onChange={this.handleChangeApiario}
                          id="apiario"
                          name="apiario"
                        >
                          <option value={""}>----- Seleccionar -----</option>
                          {/* {optionItems} */}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="numero-colmena">
                          Identificación de la Colmena
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={this.state.numero_colmena}
                          onChange={this.handleChangeNumeroColmena}
                          id="numero-colmena"
                          name="numero-colmena"
                          placeholder="Ingresar el número de colmena"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="fecha-creacion">
                          Fecha de Creación
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={this.state.fecha_creacion}
                          onChange={this.handleChangeFechaCreacion}
                          id="fecha-creacion"
                          name="fecha-creacion"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="raza_abeja">Raza de la Abeja</label>
                        <select
                          className="form-control"
                          style={{ width: "100%" }}
                          onChange={this.handleChangeRazaAbeja}
                          id="raza_abeja"
                          name="raza_abeja"
                        >
                          <option value={""}>----- Seleccionar -----</option>
                          <option value={"Italiana"}>Italiana</option>
                          <option value={"Buckfast"}>Buckfast</option>
                          <option value={"Carniola"}>Carniola</option>
                          <option value={"Caucasica"}>Caucasica</option>
                          <option value={"Otros"}>Otros</option>
                        </select>
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
                      </button>{" "}
                      <i
                        id={"spinner-btn-aceptar"}
                        className="fa fa-spinner fa-pulse fa-lg fa-fw"
                        style={{ display: "none" }}
                      />
                    </div>
                  </form>
                </div>
                {/* /.box */}
              </div>
              {/*/.col (left) */}
              <div className="col-md-6">
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
export default connect(null,mapDispatchToProps)(FormCrearColmena)
