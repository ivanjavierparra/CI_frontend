import React, { Component } from "react";
import cookie from 'js-cookie';

var map = [];
var markersArray = [];
var apiario_marker = [];

export default class MapaApiarios extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        //init controller
        this.abortController = new window.AbortController();

        this.state = {
            apiarios : [],
            ciudad : "",
            apicultor : "",
            direccion_apiario : "",
            nombre_apiario : "",
            cantidad_colmenas : "",
            trelew : {
                verde : 0,
                amarillo : 0,
                rojo : 0,
            },
            rawson : {
                verde : 0,
                amarillo : 0,
                rojo : 0,
            },
            gaiman : {
                verde : 0,
                amarillo : 0,
                rojo : 0,
            },
            dolavon : {
                verde : 0,
                amarillo : 0,
                rojo : 0,
            },
            julio : {
                verde : 0,
                amarillo : 0,
                rojo : 0,
            }
        }

        // Methods
        this.buscarApiarios = this.buscarApiarios.bind(this);
        this.crearMarkers = this.crearMarkers.bind(this);
        this.crearFooter = this.crearFooter.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
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

        var url = "http://localhost:8000/api/admin/apiarios";
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

            /* Si alguien modificó el token que está en las cookies entonces Laravel me responderá que el token es inválido, por lo que cerraré automáticamente la sesión */
            if ( typeof data.status !== 'undefined' ) {
                console.log("Modificaste el token....", data.status);
                cookie.remove("token");
                this.abortController.abort();
                return;
            }

            console.log(data);

            this.crearMarkers(data);
            this.crearFooter(data);

            this.setState(
            {
                apiarios: data,
            },
            function() {
                
            }
            );

            //this.createMarkersApiarios(data);

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
            markersArray.push(marker);
        }
    }


    crearFooter(apiarios) {

        var contador = {
            "Trelew" : {
                "verde" : 0,
                "amarillo" : 0,
                "rojo" : 0,
            },
            "Rawson" : {
                "verde" : 0,
                "amarillo" : 0,
                "rojo" : 0,
            },
            "Gaiman" : {
                "verde" : 0,
                "amarillo" : 0,
                "rojo" : 0,
            },
            "Dolavon" : {
                "verde" : 0,
                "amarillo" : 0,
                "rojo" : 0,
            },
            "28 de Julio" : {
                "verde" : 0,
                "amarillo" : 0,
                "rojo" : 0,
            }
        };

        for( var i=0; i < apiarios.length; i++ ) {
          
            contador[apiarios[i]["apiario"]["localidad_chacra"]]['verde']  = contador[apiarios[i]["apiario"]["localidad_chacra"]]['verde'] + parseInt(apiarios[i]["contador"]["verde"]);
            contador[apiarios[i]["apiario"]["localidad_chacra"]]['amarillo']  = contador[apiarios[i]["apiario"]["localidad_chacra"]]['amarillo'] + parseInt(apiarios[i]["contador"]["amarillo"]);
            contador[apiarios[i]["apiario"]["localidad_chacra"]]['rojo']  = contador[apiarios[i]["apiario"]["localidad_chacra"]]['rojo'] + parseInt(apiarios[i]["contador"]["rojo"]);

        }

        this.setState({
            trelew : {
                verde : contador['Trelew']['verde'],
                amarillo : contador['Trelew']['amarillo'],
                rojo : contador['Trelew']['rojo'],
            },
            rawson : {
                verde : contador['Rawson']['verde'],
                amarillo : contador['Rawson']['amarillo'],
                rojo : contador['Rawson']['rojo'],
            },
            gaiman : {
                verde : contador['Gaiman']['verde'],
                amarillo : contador['Gaiman']['amarillo'],
                rojo : contador['Gaiman']['rojo'],
            },
            dolavon : {
                verde : contador['Dolavon']['verde'],
                amarillo : contador['Dolavon']['amarillo'],
                rojo : contador['Dolavon']['rojo'],
            },
            julio : {
                verde : contador['28 de Julio']['verde'],
                amarillo : contador['28 de Julio']['amarillo'],
                rojo : contador['28 de Julio']['rojo'],
            },
        });
        console.log("Contadores",contador);
    }


    handleClickCollapse(event) {
      var id = "box-body-mapa-apiarios";
      var display = document.getElementById(id).style.display;
      if( display == "none" ) {
        document.getElementById(id).style.display = "block";
      }
      else {
        document.getElementById(id).style.display = "none";
      }
    }
    
    render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box box-success">
            <div className="box-header with-border">
              <h3 className="box-title">Estado Actual de los Apiarios en el VIRCH</h3>
              <div className="box-tools pull-right">
                <button
                  type="button"
                  className="btn btn-box-tool"
                  data-widget="collapse"
                  onClick={this.handleClickCollapse}
                >
                  <i className="fa fa-minus" />
                </button>
                {/* <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-box-tool dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <i className="fa fa-wrench" />
                  </button>
                  <ul className="dropdown-menu" role="menu">
                    <li>
                      <a href="#">Action</a>
                    </li>
                    <li>
                      <a href="#">Another action</a>
                    </li>
                    <li>
                      <a href="#">Something else here</a>
                    </li>
                    <li className="divider" />
                    <li>
                      <a href="#">Separated link</a>
                    </li>
                  </ul>
                </div> */}
                <button
                  type="button"
                  className="btn btn-box-tool"
                  data-widget="remove"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
            </div>
            {/* /.box-header */}
            <div id="box-body-mapa-apiarios" className="box-body">
              <div className="row">
                <div className="col-md-8">
                  <div id="map" style={{height: '400px'}}>
                  </div>
                  {/* /.chart-responsive */}
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
                    <strong><i className="fa fa-forumbee margin-r-5"></i> Apicultor</strong>
                    <p className="text-muted">
                        {this.state.apicultor}
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
                      <i className="fa fa-caret-up" /> {this.state.rawson['verde']}
                    </span>
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.rawson['amarillo']}
                    </span>
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.rawson['rojo']}
                    </span>
                    <h5 className="description-header">Colmenas Rawson</h5>
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-4 col-xs-6">
                  <div className="description-block border-right">
                  <span className="description-percentage text-green">
                      <i className="fa fa-caret-up" /> {this.state.trelew['verde']}
                    </span>
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.trelew['amarillo']}
                    </span>
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.trelew['rojo']}
                    </span>
                    <h5 className="description-header">Colmenas Trelew</h5>
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-4 col-xs-6">
                  <div className="description-block border-right">
                    <span className="description-percentage text-green">
                      <i className="fa fa-caret-up" /> {this.state.gaiman['verde']}
                    </span>
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.gaiman['amarillo']}
                    </span>
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.gaiman['rojo']}
                    </span>
                    <h5 className="description-header">Colmenas Gaiman</h5>
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-6 col-xs-6">
                  <div className="description-block border-right">
                    <span className="description-percentage text-green">
                      <i className="fa fa-caret-up" /> {this.state.dolavon['verde']}
                    </span>
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.dolavon['amarillo']}
                    </span>
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.dolavon['rojo']}
                    </span>
                    <h5 className="description-header">Colmenas Dolavon</h5>
                  </div>
                  {/* /.description-block */}
                </div>
                {/* /.col */}
                <div className="col-sm-6 col-xs-6">
                  <div className="description-block">
                    <span className="description-percentage text-green">
                      <i className="fa fa-caret-up" /> {this.state.julio['verde']}
                    </span>
                    <span className="description-percentage text-orange" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.julio['amarillo']}
                    </span>
                    <span className="description-percentage text-red" style={{marginLeft:10}}>
                      <i className="fa fa-caret-up" /> {this.state.julio['rojo']}
                    </span>
                    <h5 className="description-header">Colmenas 28 de Julio</h5>
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
