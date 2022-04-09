import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import ChartSignal from './charts/ChartSignal';
import axios from "axios";

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

class AdminSenal extends Component {
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
      colmena_seleccionada : "",
      apiario_id : "",
      apiario_seleccionado : "",
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
      isDisabledApiario : true,
      isCheckedColmena : false,
      isDisabledColmena : true,
      isCheckedHorario : false,
      isCheckedVariablesExternas : false,
      isCheckedTipoGrafico : false,
      isLoadLocalidad : true,
      isLoadApicultor : true,
      isLoadApiario : true,
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
    this.agregarOpcionesSelectorColmena = this.agregarOpcionesSelectorColmena.bind(this);
    this.handleChangeChkColmena = this.handleChangeChkColmena.bind(this);

    this.clickOpcionesAvanzadas = this.clickOpcionesAvanzadas.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleOptionChangeComparacion = this.handleOptionChangeComparacion.bind(this);
    this.changeComparacionDias = this.changeComparacionDias.bind(this);
    this.changeComparacionMeses = this.changeComparacionMeses.bind(this);
    this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
    this.handleChangeChkHorario = this.handleChangeChkHorario.bind(this);
    this.onKeyPressHorarioDesdeHandle = this.onKeyPressHorarioDesdeHandle.bind(this);
    this.handleChangeChkVariablesExternas = this.handleChangeChkVariablesExternas.bind(this);
    this.handleChangeChkTipoGrafico = this.handleChangeChkTipoGrafico.bind(this);
    this.handleOptionChangeTipoGrafico = this.handleOptionChangeTipoGrafico.bind(this);

    this.getDatosPorDefecto = this.getDatosPorDefecto.bind(this);
    this.validarSelectores = this.validarSelectores.bind(this);
    this.getCantidadColmenas = this.getCantidadColmenas.bind(this);
    this.crear_graficos = this.crear_graficos.bind(this);
    this.get_apiario_seleccionado = this.get_apiario_seleccionado.bind(this);
    this.get_colmenas_del_apiario = this.get_colmenas_del_apiario.bind(this);

    this.descargarDatosPorDefecto = this.descargarDatosPorDefecto.bind(this);
    this.crearCSV = this.crearCSV.bind(this);

    this.aplicarFiltros = this.aplicarFiltros.bind(this);
    this.completarFiltros = this.completarFiltros.bind(this);
    this.crear_titulo = this.crear_titulo.bind(this);
    
    this.descargarConFiltros = this.descargarConFiltros.bind(this);
    this.completarFiltrosCSV = this.completarFiltrosCSV.bind(this);

    this.validarHorario = this.validarHorario.bind(this);
  }


  onKeyPressHorarioDesdeHandle(event) {
    event.preventDefault();
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

    var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/apicultores_apiarios_colmenas";
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
                isLoadLocalidad : false,
                isLoadApicultor : false,
                isLoadApiario : false,
            },
            function() {
                
            }
            );
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
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
        var content = '<b>Apiario:</b> ' + apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'] +  ' <br><b>Ciudad:</b> ' + apiarios[i]['apiario']['localidad_chacra'] +  ' <br><b>Colmenas:</b> ' + apiarios[i]['colmenas'].length
        
        // Create A Marker
        var marker = new window.google.maps.Marker({
            position: { lat: parseFloat(apiarios[i]['apiario']['latitud']) , lng: parseFloat(apiarios[i]['apiario']['longitud']) },
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

            // Creo el selector colmena
            this.agregarOpcionesSelectorColmena(apiarios[i]['colmenas']);

            var apicultor = this.getApicultor(apiarios[i]['apiario']["apicultor_id"]);

            console.log(apiarios,i);
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
            this.setState({
                apiario_id : apiarios[i]['apiario']['id'],
                apiario_seleccionado : apiarios[i]['apiario']['id'],
                apicultor : apicultor['name'] + " " + apicultor['lastname'],
                nombre_fantasia : apiarios[i]['apiario']["nombre_fantasia"],
                direccion : apiarios[i]['apiario']["direccion_chacra"],
                ciudad : apiarios[i]['apiario']["localidad_chacra"],
                latitud : apiarios[i]['apiario']["latitud"],
                longitud : apiarios[i]['apiario']['longitud'],
                fecha_creacion : apiarios[i]['apiario']['created_at'].split(" ")[0],
                propietario : apiarios[i]['apiario']['propietario_chacra'],
                descripcion : apiarios[i]['apiario']['descripcion'],
                cantidad_colmenas : apiarios[i]['colmenas'].length,
            });

            // Centro el mapa donde el usuario hizo click.
            map.panTo(new window.google.maps.LatLng(apiarios[i]['apiario']["latitud"],apiarios[i]['apiario']["longitud"]));
        }
        })(marker, content, apiarios, i).bind(this));
    
  
        // Agrego el marker al arreglo global de markers.
        markersArray.push(marker);
    }
}
  
  

agregarOpcionesSelectorColmena(colmenas) {


  this.emptySelector("selector-colmena");
  this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----',"");
  
  for( var i=0; i<colmenas.length; i++ ) {
    
      this.createDefaultValueSelector(
        "selector-colmena",  
        colmenas[i]['id'], 
        colmenas[i]['identificacion'],
        colmenas[i]['id']
      );
    
  }


}   


/**
     * 
     * @param {*} event 
     */
    handleChangeChkColmena(event) {
      this.setState({
          isCheckedColmena: !this.state.isCheckedColmena,
          isDisabledColmena : !this.state.isDisabledColmena,
      }, () => {
          
      });
  }
  

  /**
     * Onclick del botón 'Opciones avanzadas'.
     * 
     * @param {*} event 
     */
    clickOpcionesAvanzadas(event) {
    
      var x = document.getElementById("myDIV");
      if (x.style.display == "none") {
        x.style.display = "block";
        document.getElementById("btn-buscar-datos").style.display = "none";
        document.getElementById("btn-descargar-datos").style.display = "none";
        document.getElementById("mensajes-boton-buscar").style.display = "none";
      } 
      else {
        x.style.display = "none";
        document.getElementById("btn-buscar-datos").style.display = "block";
        document.getElementById("btn-descargar-datos").style.display = "block";
        document.getElementById("mensajes-boton-buscar").style.display = "block";
      }
    
      //console.log(this.DatePicker.current.state.start._d);
  }



  /**
     * Verifica qué opción avanzada eligió el usuario: Rango de fechas o Comparación, y muestra el DIV correspondiente.
     * 
     * @param {*} event 
     */
    handleOptionChange(event) {
      // Obtengo la opción elegida por el usuario.
      var opcion_seleccionada = event.target.value;

      // Si eligió rango de fechas
      if ( opcion_seleccionada == "rango" ) {
          
          // Muestro div rangos
          var x = document.getElementById("div-rangos");            
          if (x.style.display == "none") {
            x.style.display = "block";
          } else {
            x.style.display = "none";
          }

          // Oculto div de comparacion
          var y = document.getElementById("div-comparacion");
          y.style.display = "none";
      }
      else {

          // Muestro div de comparación
          var x = document.getElementById("div-comparacion");
          if (x.style.display == "none") {
            x.style.display = "block";
          } else {
            x.style.display = "none";
          }

          // Oculto div rangos
          var y = document.getElementById("div-rangos");
          y.style.display = "none";
      }
  }


  
/**
     * Muestra el panel de comparación en base a la opción elegida por el usuario.
     * 
     * @param {*} event 
     */
    handleOptionChangeComparacion(event) {
      // Obtengo la opción elegida por el usuario.
      var opcion_seleccionada = event.target.value;
      
      //
      var x = document.getElementById("comparacion-dias");
      var y = document.getElementById("comparacion-meses");
      

      // Según la opción elegida por el usuario muestro el div correspondiente
      switch( opcion_seleccionada ) {
         case 'dias': 
             x.style.display = "block";
             y.style.display = "none";
             break;
         case 'meses':
             x.style.display = "none";
             y.style.display = "block";
             break;
         default:
             alert("No se encontró opción");
             console.log("No se encontró opción");
             break;
      }
      
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
    handleChangeChkHorario(event) {
      this.setState({
          isCheckedHorario: !this.state.isCheckedHorario,
      }, () => {
          if( this.state.isCheckedHorario ) document.getElementById("filtro-horario").style.display = "block";
          else document.getElementById("filtro-horario").style.display = "none";
      });
  }

  /**
     * 
     * @param {*} event 
     */
    handleChangeChkVariablesExternas(event) {
      this.setState({
          isCheckedVariablesExternas: !this.state.isCheckedVariablesExternas,
      }, () => {
          if( this.state.isCheckedVariablesExternas ) document.getElementById("div-variables-externas").style.display = "block";
          else document.getElementById("div-variables-externas").style.display = "none";
      });
  }

  /**
     * 
     * @param {*} event 
     */
    handleChangeChkTipoGrafico(event) {
      this.setState({
          isCheckedTipoGrafico: !this.state.isCheckedTipoGrafico,
      }, () => {
          if( this.state.isCheckedTipoGrafico ) document.getElementById("div-tipo-grafico").style.display = "block";
          else document.getElementById("div-tipo-grafico").style.display = "none";
      });
  }

  /**
     * 
     * @param {*} event 
     */
    handleOptionChangeTipoGrafico(event) {

    }

    /**
     * Cambio la fecha en el panel de comparación de dias.
     * Seteo la fecha del año anterior.
     * 
     * @param {*} event 
     */
    changeComparacionDias(event) {
      var fecha_ingresada = document.getElementById("input-dia-seleccionado").value;

      var this_year = fecha_ingresada.split("-")[0] - 1;
      var this_month = fecha_ingresada.split("-")[1];
      var this_date = fecha_ingresada.split("-")[2];
      

      document.getElementById("input-dia-para-setear").value = this_year + "-" + this_month + "-" + this_date;   
   }

   /**
     * Cambio el mes en el panel de comparación de meses.
     * Seteo mes del año anterior.
     * 
     * @param {*} event 
     */
    changeComparacionMeses(event) {
      var mes_ingresado = document.getElementById("input-mes-seleccionado").value;

      var this_year = mes_ingresado.split("-")[0] - 1;
      var this_month = mes_ingresado.split("-")[1];

      document.getElementById("input-mes-seteado").value = this_year + "-" + this_month;   
      
  }

  validarSelectores(apiario, variable) {
        
    // Apiario no seleccionado
    if( apiario == "Seleccionar" ) return "Debe seleccionar un apiario.";
    // Apiario no tiene colmenas
    if( this.getCantidadColmenas(apiario) <= 0 ) return "El apiario seleccionado no tiene colmenas.";
    // Variable no seleccionada
    if( variable == "Seleccionar" ) return "Debe seleccionar una variable.";
    // Colmena habilitada y no selccionada
    if ( this.state.isCheckedColmena && document.getElementById("selector-colmena").value == "" ) return "Debe seleccionar una colmena.";
          
    return "";
  }


  getCantidadColmenas(apiario_id) { 

    var apiarios = this.state.apiarios;

    for( var i = 0 ; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['id'] == apiario_id ) return apiarios[i]['colmenas'].length;

    }

    return 0;
  }



  /**
     * Manejo el evento OnClick cuando el usuario presiona el botón "Buscar Datos".
     * Obtengo los datos de la última semana de las colmenas del apiario seleccionado.
     * 
     * @param {*} event 
     */
    getDatosPorDefecto(event) {

      // Obtengo datos seleccionados por el usuario
      var apiario = this.state.apiario_seleccionado;
      var variable = "senial";
      

      // Valido selectores
      var mensaje = this.validarSelectores(apiario, variable);
      if ( mensaje != "" )  { alert(mensaje); return; }
         
      // Elimino todos los gráficos del div contenedor de gráficos.
      // ReactDOM.unmountComponentAtNode <-------------- VER VER VER VER VER EVR EV EVR RV ERV RE
      ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));

      var tipoAccion = {
          accion: 'Rango',
          tipo: '7',
          fecha_actual: '',
          fecha_pasada: '',
          horario_desde: 'Todo el dia', // 'Todo el dia'
          horario_hasta: 'Todo el dia',
          //horario_desde: '08:00', // 'Todo el dia'
          //horario_hasta: '16:00',
          rango: "120", // Representa el rango de minutos en el día. En este caso sería cada 2 horas : [08:00, 10:00, 12:00, ..., 16:00 ]
      };
         
      
      // Creo los gráficos.
      this.crear_graficos(apiario, variable, tipoAccion, "", "Últimos 7 días", "stepLine");

  }

  validarHorario() {
    if(  document.getElementById("selector-horario-desde").value == "" && document.getElementById("selector-horario-hasta").value == ""  ) return "Ingrese Horario Desde y Horario Hasta.";
    if(  document.getElementById("selector-horario-desde").value == ""  ) return "Ingrese Horario Desde.";
    if(  document.getElementById("selector-horario-hasta").value == ""  ) return "Ingrese Horario Hasta.";
    if(  document.getElementById("selector-horario-desde").value >= document.getElementById("selector-horario-hasta").value ) return "Horario Desde debe ser menor a Horario Hasta.";
    return "";
  }

  /**
     * Recorre las colmenas del apiario seleccionado, y delega al componente Chart que renderice 
     * el gráfico adecuado en base a los parámetros pasados.
     * 
     * @param {*} apiario es el id del apiario
     * @param {*} variable {Temperatura, Humedad, Temperatura y Humedad}
     * @param {*} tipoAccion {array(Rango), array(Comparacion)} + horario desde y hasta.
     * @param {*} variable_ambiental {Temperatura Ambiental, Humedad Ambiental, Temperatura y Humedad Ambiental}
     * @param {*} titulo es un String que será el título del gráfico.
     * @param {*} tipoGrafico {Line, Bar}
     */
    crear_graficos(apiario, variable, tipoAccion, variable_ambiental, titulo, tipoGrafico) {
      var apiario_seleccionado = this.get_apiario_seleccionado(apiario);
      var colmenas = this.get_colmenas_del_apiario(apiario);
      var graficos = [];

      console.log("que pasa?",colmenas); 

      //ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));
      
      if( this.state.isCheckedColmena ) { 
          var colmena_id = document.getElementById("selector-colmena").value;
          var colmena = [];
          for (var i = 0; i < colmenas.length; i++) { 
              if( colmenas[i]['id'] == colmena_id ) {
                  colmena = colmenas[i];
                  break;
              }
          }
          graficos.push(<ChartSignal apiario={apiario_seleccionado} colmena={colmena} key={colmena['id']} variable={variable} tipoAccion={tipoAccion} variable_ambiental={variable_ambiental} rango={60} titulo={titulo} tipo_grafico={tipoGrafico} columns="12" />);
      }
      else {
          for (var i = 0; i < colmenas.length; i++) { 
              console.log("contador");
              graficos.push(<ChartSignal apiario={apiario_seleccionado} colmena={colmenas[i]} key={colmenas[i]['id']} variable={variable} tipoAccion={tipoAccion} variable_ambiental={variable_ambiental} rango={60} titulo={titulo} tipo_grafico={tipoGrafico} columns="6" />);
          }
      }
      

      ReactDOM.render(graficos, document.getElementById('contenedor'));
  }
  


  get_apiario_seleccionado(apiario_id) {  

    var apiarios = this.state.apiarios;
    //var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['id'] == apiario_id ) { return apiarios[i]['apiario'] }//{resultado.push(apiarios[i]['apiario']); break;}

    }

    return [];

  }

  get_colmenas_del_apiario(apiario_id) {

    var apiarios = this.state.apiarios;
    //var resultado = [];

    for( var i = 0; i < apiarios.length; i++ ) {

      if( apiarios[i]['apiario']['id'] == apiario_id ) return apiarios[i]['colmenas'];

    }

    return [];
  }



  /**
     * 
     * @param {*} event 
     */
    descargarDatosPorDefecto(event) {

      // Obtengo datos seleccionados por el usuario
      var apiario = this.state.apiario_seleccionado;
      var variable = "senial";
      
      // Valido selectores
      var mensaje = this.validarSelectores(apiario, variable);
      if ( mensaje != "" )  { alert(mensaje); return; }

      var tipoAccion = {
          accion: 'Rango',
          tipo: '7',
          fecha_actual: '',
          fecha_pasada: '',
          horario_desde: 'Todo el dia', // 'Todo el dia'
          horario_hasta: 'Todo el dia',
          rango: "120", // Representa el rango de minutos en el día. En este caso sería cada 2 horas : [08:00, 10:00, 12:00, ..., 16:00 ]
      };
         
      
      // Creo los gráficos.
      this.crearCSV(tipoAccion);

  }



  crearCSV(tipoAccion) {
    var variable = "senial";
    var apiario = this.state.apiario_seleccionado;
    var colmena  = "";
    if( this.state.isCheckedColmena ) colmena = document.getElementById("selector-colmena").value;
        
    console.log(variable,apiario,colmena,tipoAccion);   
    
    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/revisaciones/senial/csv");
    var params = {
        apiario: apiario, 
        colmena: colmena, 
        variable: variable,
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


/**
     * Handle Onclick Botón Aplicar Filtros.
     * Valido filtros de comparación y de rangos.
     * Delega a otro método el procesamiento de los demás filtros y la generación de los gráficos.
     * @param {*} event 
     */
    aplicarFiltros(event) {
        
      // Obtengo datos seleccionados por el usuario
      var apiario = this.state.apiario_seleccionado;
      var variable = "senial";
     

      // Valido selectores
      var mensaje = this.validarSelectores(apiario, variable);
      if ( mensaje != "" )  { alert(mensaje); return; }


      // Valido radio buttons
      //if ( !document.getElementsByName('opcion-seleccionada')[0].checked && !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
      if ( !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }

      // Eligió Rango de Fechas
      if(document.getElementsByName('opcion-seleccionada')[1].checked) {
          // Valido Si el usuario no seleccionó un rango
          var rango_seleccionado = document.getElementById("select-rango-fechas").value;
          if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

          var fecha_desde = '';
          var fecha_hasta = '';
          var tipo_grafico = "stepLine";
          
          // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
          if( rango_seleccionado == "personalizado" ) {
              fecha_desde = document.getElementById("fecha-desde-rango").value;
              fecha_hasta = document.getElementById("fecha-hasta-rango").value;

              if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
              if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
              if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
          }

          var tipo_grafico = "stepLine";
          // Sigo completando los filtros.
          if( rango_seleccionado == 'hoy' ) tipo_grafico = "stepLine";
          this.completarFiltros(apiario, variable, "Rango", rango_seleccionado, fecha_desde, fecha_hasta, tipo_grafico );
      }
      else {
         //alert("Falta implementar esta funcionalidad de comparar!!! jajaja :)");
         return;
      }
      
  }


  completarFiltros(apiario, variable, accion, tipo, fecha_actual, fecha_pasada, tipo_grafico) {
      try{
          
          var horario_desde = "Todo el dia";
          var horario_hasta = "Todo el dia";
          var variable_ambiental = "";
          var rango = 60;
          var grafico = "stepLine";     
          
          // Validar Horario
          if(  document.getElementById("chk-horario").checked  ) {
            var mensaje = this.validarHorario();
            if ( mensaje != "" )  { alert(mensaje); return; }
            horario_desde = document.getElementById("selector-horario-desde").value;
            horario_hasta = document.getElementById("selector-horario-hasta").value;
          }

          // Valido Tipo de Gráfico
          if( document.getElementById("chk-tipo-grafico").checked  ) {
              // Valido radio buttons
              if ( !document.getElementsByName('label-tipo-grafico')[0].checked && !document.getElementsByName('label-tipo-grafico')[1].checked && !document.getElementsByName('label-tipo-grafico')[2].checked && !document.getElementsByName('label-tipo-grafico')[3].checked && !document.getElementsByName('label-tipo-grafico')[4].checked ) { alert("Seleccione un tipo de gráfico."); return; }
              if(document.getElementsByName('label-tipo-grafico')[0].checked) grafico = "stepLine";
              if(document.getElementsByName('label-tipo-grafico')[1].checked) grafico = "column";
              else if(document.getElementsByName('label-tipo-grafico')[2].checked) grafico = "line";
              else if(document.getElementsByName('label-tipo-grafico')[3].checked) grafico = "spline";
              else if(document.getElementsByName('label-tipo-grafico')[4].checked) grafico = "area";
          }

          // Datos
          var tipoAccion = {
            accion: accion,
            tipo: tipo,
            fecha_actual: fecha_actual,
            fecha_pasada: fecha_pasada,
            horario_desde: horario_desde,
            horario_hasta: horario_hasta,
            rango: rango,
          };

          // Creo un titulo para el grafico.
          var titulo = this.crear_titulo(accion, tipo, fecha_actual, fecha_pasada);

          // Creo los gráficos.
          this.crear_graficos(apiario, variable, tipoAccion, variable_ambiental, titulo, grafico);

      } catch(error) {
          console.log("Ocurrió un error: " + error);
      }
  }

  crear_titulo(accion, tipo, fecha_desde, fecha_hasta) {
    // Paso Y-m-d al formato d-m-Y
    fecha_desde = fecha_desde.split("-").reverse().join("-");
    fecha_hasta = fecha_hasta.split("-").reverse().join("-");

    if( accion == "Rango" ) {
        if( tipo == "hoy" ) return "Hoy";
        if( tipo == "7" ) return "Últimos 7 días";
        if( tipo == "14" ) return "Últimos 14 días";
        if( tipo == "30" ) return "Últimos 30 días";
        if( tipo == "personalizado" ) return "" + fecha_desde + " - " + fecha_hasta;
    }
    else { return "Comparación " + fecha_desde + " - " + fecha_hasta};
  }


  /**
     * 
     * @param {*} event 
     */
    descargarConFiltros(event) {
        
      // Obtengo datos seleccionados por el usuario
      var apiario = this.state.apiario_seleccionado;
      var variable = "senial";
     
      // Valido selectores
      var mensaje = this.validarSelectores(apiario, variable);
      if ( mensaje != "" )  { alert(mensaje); return; }

      // Valido radio buttons
      //if ( !document.getElementsByName('opcion-seleccionada')[0].checked && !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
      if ( !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
      
      // Eligió Rango de Fechas
      if(document.getElementsByName('opcion-seleccionada')[1].checked) {
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

         
          this.completarFiltrosCSV("Rango", rango_seleccionado, fecha_desde, fecha_hasta );
      }
      else {
        //alert("Falta implementar la comparación!!! jajajaja");
        return;
      }
  }
  
  
  completarFiltrosCSV(accion, tipo, fecha_actual, fecha_pasada) {
    try{
        
        var horario_desde = "Todo el dia";
        var horario_hasta = "Todo el dia";
        var variable_ambiental = "";
        var rango = 60;
        

        // Validar Horario
        if(  document.getElementById("chk-horario").checked  ) {
          var mensaje = this.validarHorario();
          if ( mensaje != "" )  { alert(mensaje); return; }
          horario_desde = document.getElementById("selector-horario-desde").value;
          horario_hasta = document.getElementById("selector-horario-hasta").value;
        }

        // Datos
        var tipoAccion = {
            accion: accion,
            tipo: tipo,
            fecha_actual: fecha_actual,
            fecha_pasada: fecha_pasada,
            horario_desde: horario_desde,
            horario_hasta: horario_hasta,
            rango: rango,
        };


        // Creo el CSV
        this.crearCSV(tipoAccion);

    } catch(error) {
        console.log("Ocurrió un error: " + error);
    }
}



   /**
     * 
     * @param {*} event 
     */
    handleChangeChkHorario(event) {
      this.setState({
          isCheckedHorario: !this.state.isCheckedHorario,
      }, () => {
          if( this.state.isCheckedHorario ) document.getElementById("filtro-horario").style.display = "block";
          else document.getElementById("filtro-horario").style.display = "none";
      });
    }



  render() {


    /* ---------- Inicialización de datepickers ---------- */
    let previous_year = (new Date()).getFullYear() - 1;
    let min_date_previos_year = previous_year + "-01-01";
    let max_date_previos_year = previous_year + "-12-31";

    let fecha = new Date();
    let this_year = fecha.getFullYear();
    let this_month = fecha.getMonth() + 1;
    let this_date = fecha.getDate();
    let min_date_this_year = this_year + "-01-01";
    let max_date_this_year = this_year + "-" + this_month + "-" + this_date;
    
    let min_month_this_year = this_year + "-01";
    let max_month_this_year = this_year + "-" + this_month;
    /* ----------------------------------------------------- */

    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>
              Señal
              <br />
              <small>Gráficos de señal de las colmenas</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="fake_url">
                  <i className="fa fa-wifi" /> Señal
                </a>
              </li>
              <li className="active">Gráficos</li>
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
                          <label htmlFor="selector-apicultor">Apicultor</label>
                          <select
                            className="form-control"
                            style={{ width: "100%" }}
                            id="selector-apicultor"
                            name="selector-apicultor"
                            onChange={this.handleChangeApicultor}
                            disabled = {this.state.isLoadApicultor}
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
                            disabled = {this.state.isLoadApiario}
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
                        <div id="map"  style={{height: '400px'}}></div>
                    </div>
                  </div>
              </div>
              {/*/.col (left) */}
              <div className="col-md-6">
                <div id="box-revisaciones" className="box box-primary">
                      <div className="box-header with-border">
                        <h3 className="box-title">Seleccionar Datos</h3>
                      </div>
                      <form role="form">
                          <div className="box-body">
                            <div id="parametros-revisacion" className="row">

                                  {/* Apiario Seleccionado */}
                                  <div className="form-group">
                                    <label htmlFor="selector-colmena" className="col-md-12"> Apiario Seleccionado </label>
                                      <div className="col-md-12">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="apicultor"
                                            name="apicultor"
                                            placeholder=""
                                            disabled={this.state.isDisabledApiario}
                                            value={this.state.direccion != "" ? this.state.ciudad + " - " + this.state.direccion + " - " + this.state.nombre_fantasia : ""}
                                          />
                                          <br />
                                      </div>
                                  </div>

                                  {/* ComboBox Colmena' */}
                                  <div className="form-group">
                                      <label htmlFor="selector-colmena" className="col-md-12"><input type="checkbox" id="chk-colmena" name="chk-colmena" defaultChecked={this.state.isCheckedColmena} onChange={this.handleChangeChkColmena} /> Colmena </label>
                                      <div className="col-md-12">
                                          <select className="form-control" id="selector-colmena" name="selector-colmena" defaultValue={'Seleccionar'} disabled={this.state.isDisabledColmena} > 
                                              <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                              {/* {optionItems} */}
                                          </select>
                                          <br />
                                      </div>
                                  </div>

                                  

                                  {/* Btn Buscar / Btn Más Filtros */}
                                  <div className="form-group">
                                      <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                      <div className="col-xs-6 col-md-6 col-lg-6">
                                          <button id="btn-buscar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-left" onClick={this.getDatosPorDefecto} ><i className="fa fa-search" /> <strong>Buscar datos &nbsp;</strong></button>
                                          <button id="btn-descargar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-right" onClick={this.descargarDatosPorDefecto} ><i className="fa fa-search" /> <strong>Descargar datos &nbsp;</strong></button>
                                      </div>                                    
                                      <div className="col-xs-6 col-md-6 col-lg-6">
                                          <button type="button" className="btn btn-sm btn-flat btn-primary pull-right" onClick={this.clickOpcionesAvanzadas} data-toggle="tooltip" data-placement="top" title="Editar"><i className="fa fa-bars" /> <strong> Más opciones </strong></button>
                                      </div>
                                  </div>


                        
                                  <div id="mensajes-boton-buscar" className="form-group">
                                      <div className="col-xs-12 col-md-12 col-lg-12">
                                      <br />
                                      <label> <small> * Por defecto se buscarán datos desde hace 7 días. </small></label> <br></br>
                                      <label> <small> ** Utilice "Más opciones" para modificar esto. </small></label>
                                      </div>
                                  </div>


                        </div>


                        {/* Row Filtros */}
                        <div className="row" style={{marginTop: 10}}>


                                <div className="form-group">
                                
                                  <div className="col-md-12">
                                      
                                      {/* Contenedor */}
                                      <div id="myDIV" style={{display: 'none', borderStyle: 'double'}}>
                                            
                                            {/* SubContenedor */}
                                            <div style={{padding: '20px 20px 20px 20px'}}>
                                                

                                                {/* DIV FILTRO COMPARACION */} 
                                                <div style={{display:'none'}}>
                                                    <div className="form-group">
                                                        <input type="radio" name="opcion-seleccionada" value="comparacion" onChange={this.handleOptionChange} /> <label> Comparación interanual. </label> <br />
                                                        {/* DIV Comparacion */}
                                                        <div id="div-comparacion" style={{display : 'none', marginTop : 10}}>
                                                                <label htmlFor="label-comparacion">¿Qué desea comparar? </label> <br />
                                                                <input type="radio" name="label-comparacion" value="dias" onChange={this.handleOptionChangeComparacion} /> Días <br />
                                                                <input type="radio" name="label-comparacion" value="meses" onChange={this.handleOptionChangeComparacion} /> Meses <br />

                                                                {/* DIV Comparacion de DÍAS */}
                                                                <div id="comparacion-dias" style={{display : 'none'}}>
                                                                    <br />
                                                                    <div className="row">
                                                                        <label htmlFor="input-dia-seleccionado" className="col-md-12">Seleccione día:</label>
                                                                        <div className="col-md-12">
                                                                            <input id="input-dia-seleccionado" className="form-control" type="date" name="bday" min={min_date_this_year} max={max_date_this_year}  onChange={this.changeComparacionDias} /> 
                                                                            <br />
                                                                        </div>
                                                                    </div> 

                                                                    <div className="row">
                                                                        <label htmlFor="input-dia-para-setear" className="col-md-12">Se comparará con:</label>
                                                                        <div className="col-md-12">
                                                                            <input id="input-dia-para-setear" className="form-control" type="date" name="bday" disabled/>  <br /> 
                                                                            <br />
                                                                        </div>
                                                                    </div>
                                                                </div> {/* /.DIV Comparacion de DÍAS */} 

                                                                {/* DIV Comparacion de MESES */}
                                                                <div id="comparacion-meses" style={{display : 'none'}}>
                                                                    <br /> 
                                                                    
                                                                    <div className="row">
                                                                        <label htmlFor="input-mes-seleccionado" className="col-md-12">Seleccione mes:</label>
                                                                        <div className="col-md-12">
                                                                        <input id="input-mes-seleccionado" className="form-control" type="month" name="bday" min={min_month_this_year} max={max_month_this_year} onChange={this.changeComparacionMeses} /> <br />
                                                                            
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <label htmlFor="input-mes-seteado" className="col-md-12">Se comparará con:</label>
                                                                        <div className="col-md-12">
                                                                        <input id="input-mes-seteado" className="form-control" type="month" name="bday" disabled /> <br />
                                                                            <br />
                                                                    </div>
                                                                </div> {/* /.DIV Comparacion de MESES */} 
                                                            </div>
                                                            <br />  
                                                        </div>
                                                    </div>
                                                </div>  {/* ./DIV FILTRO COMPARACION */}


                                                

                                                
                                                {/* DIV FILTRO RANGO FECHAS */} 
                                                <div>
                                                    <div className="form-group">
                                                        <input type="radio" name="opcion-seleccionada" value="rango" onChange={this.handleOptionChange}  /> <label> Seleccionar rango de fechas. </label> <br />
                                                        {/* DIV Rango de Fechas */}
                                                        <div id="div-rangos" style={{display : 'none', marginTop : 10}}>
                                                                <div className="row">
                                                                    <label htmlFor="select-rango-fechas" className="col-md-12">Rango de fechas</label>
                                                                    <div className="col-md-12">
                                                                        <select className="form-control" id="select-rango-fechas" name="select-rango-fechas" defaultValue={'Seleccionar'} onChange={this.handleChangeRangoFechas}>
                                                                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option>
                                                                            <option key={1} value={'hoy'}>Hoy</option>
                                                                            <option key={2} value={'ayer'}>Ayer</option>
                                                                            <option key={3} value={'7'}>Últimos 7 días</option>
                                                                            <option key={4} value={'14'}>Últimos 14 días</option>
                                                                            <option key={5} value={'30'}>Últimos 30 días</option>
                                                                            <option key={6} value={'personalizado'}>Rango personalizado</option>
                                                                        </select>
                                                                        <br />
                                                                    </div>
                                                                </div>

                                                                {/* DIV Rango de fechas personalizado */}
                                                                <div id="div-rangos-personalizados" style={{display : 'none'}}>
                                                                    <div className="row">
                                                                        <label htmlFor="rango-fechas-personalizado" className="col-md-12">Rango de fechas personalizado</label>
                                                                    </div>

                                                                    <div className="row">
                                                                        <label htmlFor="rango-fechas" className="col-md-12">Desde</label>
                                                                        <div className="col-md-12">
                                                                            <input id="fecha-desde-rango" className="form-control" type="date" name="bday" />  
                                                                            <br />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <label htmlFor="rango-fechas" className="col-md-12">Hasta</label>
                                                                        <div className="col-md-12">
                                                                            <input id="fecha-hasta-rango" className="form-control" type="date" name="bday" />  
                                                                            <br />
                                                                        </div>
                                                                    </div>

                                                                </div> {/* /.DIV Rango de fechas personalizado */} 
                                                        </div> {/* /.div-rangos */} 
                                                    </div>
                                                </div> {/* ./DIV FILTRO RANGO FECHAS */}
                                                
                                                

                                                <hr />     

                                                {/* DIV FILTRO RANGO HORARIO */} 
                                                <div>
                                                    <div className="form-group">
                                                        <input type="checkbox" id="chk-horario" name="chk-horario" defaultChecked={this.state.isCheckedHorario} onChange={this.handleChangeChkHorario} /> <label> Seleccionar rango horario. </label> <br />  
                                                        <div id="filtro-horario" style={{display : "none", marginTop : 10}}>
                                                            <div id="div-rango-horas">
                                                                <div className="row">
                                                                    <label htmlFor="selector-horario-desde" className="col-md-12">Horario Desde</label>
                                                                    <div className="col-md-12">
                                                                        <input id="selector-horario-desde" type="time" className="form-control" step="1800" onKeyPress={this.onKeyPressHorarioDesdeHandle} />  
                                                                        <br /> {/* step = 60 segundos * 30 minutos = 1800 */}
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <label htmlFor="selector-horario-hasta" className="col-md-12">Horario Hasta</label>
                                                                    <div className="col-md-12">
                                                                        <input id="selector-horario-hasta" type="time" className="form-control" step="1800" onKeyPress={this.onKeyPressHorarioDesdeHandle} />
                                                                        <br />
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <label htmlFor="select-intervalo-tiempo" className="col-md-12">Intervalo de Tiempo</label>
                                                                    <div className="col-md-12">
                                                                        <select className="form-control" id="select-intervalo-tiempo" name="select-intervalo-tiempo" defaultValue={'60'} onChange={this.handleChangeRangoFechas} >
                                                                            <option key={1} value={'30'}>30 minutos</option>
                                                                            <option key={2} value={'60'}>1 hora</option>
                                                                            <option key={3} value={'90'}>1 hora - 30 minutos</option>
                                                                            <option key={4} value={'120'}>2 horas</option>  
                                                                        </select>
                                                                        <br />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>    

                                                    

                                                </div> {/* ./DIV FILTRO RANGO HORARIO */}


                                                <hr />   


                                        
                                                



                                                {/* DIV Tipo de Gráfico */}
                                                <div className="form-group">
                                                    <input type="checkbox" id="chk-tipo-grafico" name="chk-tipo-grafico" defaultChecked={this.state.isCheckedTipoGrafico} onChange={this.handleChangeChkTipoGrafico} /> <label> Seleccionar tipo de gráfico. </label> <br />          
                                                    
                                                    <div id="div-tipo-grafico" style={{display : "none", marginTop : 10}}> 
                                                        
                                                            <label htmlFor="label-tipo-grafico">Seleccionar tipo de gráfico: </label> <br />
                                                            <input type="radio" name="label-tipo-grafico" value="stepLine" onChange={this.handleOptionChangeTipoGrafico} /> stepLine <br />
                                                            <input type="radio" name="label-tipo-grafico" value="column" onChange={this.handleOptionChangeTipoGrafico} /> Columnas <br />
                                                            <input type="radio" name="label-tipo-grafico" value="line" onChange={this.handleOptionChangeTipoGrafico} /> Líneas <br />
                                                            <input type="radio" name="label-tipo-grafico" value="spline" onChange={this.handleOptionChangeTipoGrafico} /> Spline <br />
                                                            <input type="radio" name="label-tipo-grafico" value="area" onChange={this.handleOptionChangeTipoGrafico} /> Area <br />
                                                        
                                                    </div> 
                                                </div>

                                                <hr />

                                                {/* BUTTON Aplicar los filtros  :)) */}
                                                <div className="form-group">
                                                    <center>
                                                        <button type="button" className="btn btn-sm btn-flat btn-success" onClick={this.aplicarFiltros}><strong> <i className="fa fa-check" /> Aplicar </strong></button>
                                                        <button type="button" className="btn btn-sm btn-flat btn-success" onClick={this.descargarConFiltros} style={{marginLeft:10}}><strong> <i className="fa fa-check" /> Descargar datos </strong></button>
                                                    </center>
                                                </div>  
                                            </div>

                                      </div> 
                                     {/* myDIV */}
                                  </div>
                              </div>
                          </div>
                          </div> 
                          {/* /.box-body */}
                      </form>
                </div>
                {/* /.box */}
              </div>
              {/* right column */}
            </div>{" "}
            {/* /.row */}
            <div id="contenedor" className="row">  
                 
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
export default connect(null,mapDispatchToProps)(AdminSenal)