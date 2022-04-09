import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import axios from "axios";
import ChartColmenas from './charts/ChartColmenas';
import ChartColmenasDia from "./charts/ChartColmenasDia";
import ChartColmenasMes from "./charts/ChartColmenasMes";

var map = [];
var markersApiarios = [];
class ColmenasComparacion extends Component {


    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
        this.colmenas_en_tabla = [];
        this.max_colmenas = 5;
        
        // Defino las variables de la clase.
        this.state = {
          apiarios: [],
          colmenas: [], 

          estados : [],

          apiario_seleccionado: "", // guarda el id del apiario
          colmena_seleccionada: "", // guarda el id de la colmena
          isCheckedHorario: false,
          isCheckedVariablesExternas: false,
          isCheckedTipoGrafico: false,
          ciudad : "",
          isDisableVariable : true,
          isDisableCiudad : true,
          colmenas_agregadas : [],
          mostrarGrafico: false,
        }

        // Asocio el metodo a la clase.
        this.clickOpcionesAvanzadas = this.clickOpcionesAvanzadas.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
        this.handleChangeChkHorario = this.handleChangeChkHorario.bind(this);
        this.onKeyPressHorarioDesdeHandle = this.onKeyPressHorarioDesdeHandle.bind(this);
        this.handleChangeChkTipoGrafico = this.handleChangeChkTipoGrafico.bind(this);
        this.handleOptionChangeTipoGrafico = this.handleOptionChangeTipoGrafico.bind(this);
        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this);
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.handleChangeApiario = this.handleChangeApiario.bind(this);
        this.handleChangeColmena = this.handleChangeColmena.bind(this);
        this.handleClickAgregarColmena = this.handleClickAgregarColmena.bind(this);
        this.buscarApiario = this.buscarApiario.bind(this);
        this.buscarColmena = this.buscarColmena.bind(this);
        this.verificarColmena = this.verificarColmena.bind(this);
        this.handleClickEliminarColmena = this.handleClickEliminarColmena.bind(this);
        this.buscarPorDefecto = this.buscarPorDefecto.bind(this);
        this.aplicarFiltros = this.aplicarFiltros.bind(this);
        this.completarFiltros = this.completarFiltros.bind(this);
        this.validarHorario = this.validarHorario.bind(this);
        this.descargarDatosPorDefecto = this.descargarDatosPorDefecto.bind(this);
        this.descargarConFiltros = this.descargarConFiltros.bind(this);
        this.crearCSV = this.crearCSV.bind(this);
        this.completarFiltrosCSV = this.completarFiltrosCSV.bind(this);
        this.buscarMisApiarios = this.buscarMisApiarios.bind(this);
        this.createMarkersApiarios =this.createMarkersApiarios.bind(this);
        this.getCantidadColmenas = this.getCantidadColmenas.bind(this);
        this.getApiariosCiudad = this.getApiariosCiudad.bind(this);
        this.actualizarMarkers = this.actualizarMarkers.bind(this);
        this.getApiario = this.getApiario.bind(this);

        this.handleOptionChangeComparacion = this.handleOptionChangeComparacion.bind(this);
        this.changeComparacionDias = this.changeComparacionDias.bind(this);
        this.changeComparacionMeses = this.changeComparacionMeses.bind(this);

        this.completarFiltrosParaDescargar = this.completarFiltrosParaDescargar.bind(this);
        this.validarRadioComparacion = this.validarRadioComparacion.bind(this);

        this.buscarEstadoApiario = this.buscarEstadoApiario.bind(this);

        this.getMonthName = this.getMonthName.bind(this);
        this.getMonthNumber = this.getMonthNumber.bind(this);
        this.createSelectorAniosValues = this.createSelectorAniosValues.bind(this);
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
        var url = 'https://backendcolmenainteligente.herokuapp.com/api/apiarios/apiariosycolmenas';     
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

            console.log("Apiarios y Colmenas", data);


            this.setState(
                {
                    apiarios: data['apiarios'],
                    colmenas : data['colmenas'],
                    estados : data['estados'],
                    isDisableVariable : false,
                    isDisableCiudad : false,
                },
                function() { 
                    
                }
            );

            document.getElementById("spinner-selector-colmena").style.display = "none";
            document.getElementById("spinner-selector-variable").style.display = "none";
            
            this.createMarkersApiarios(data['apiarios'], data['colmenas']);
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request apiarios failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
      }


      createMarkersApiarios(apiarios, colmenas) {

        var infowindow = new window.google.maps.InfoWindow();
        for( var i = 0; i < apiarios.length; i++ ) {

          // Busco cantidad de colmenas
          var cantidad_colmenas = this.getCantidadColmenas(apiarios[i]['id'], colmenas);

          // Create An InfoWindow
          var content = '<b>Apiario:</b> ' + apiarios[i]['direccion_chacra'] + " - " + apiarios[i]['nombre_fantasia'] +  ' <br><b>Colmenas:</b> ' + cantidad_colmenas + ' <br><b>Ciudad:</b> ' + apiarios[i]['localidad_chacra']
          
          // Create A Marker
          var marker = new window.google.maps.Marker({
            position: { lat: parseFloat(apiarios[i]['latitud']) , lng: parseFloat(apiarios[i]['longitud']) },
            map: map,
            title: 'Apiario',
            clickable: true
          })
    
          var estado = this.buscarEstadoApiario(apiarios[i]['id']);

          // Seteo ícono del marker
            if( estado == "verde" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            else if( estado == "amarillo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            else if( estado == "rojo" ) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    
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

    getCantidadColmenas(apiarios_id, colmenas) {
        var contador = 0;

        for( var i = 0; i < colmenas.length; i++ ) {
            if( colmenas[i]['apiario_id'] == apiarios_id ) contador++;
        }

        return contador;

    }

       

    /**
     * Busco todos los apiarios y todas las colmenas.
     * Se podría buscar solo los apiarios, sin las colmenas, es otra opción.
     * 
     * 
     */
    componentDidMount() {
        
        this._isMounted = true;
        this.renderMap();
    }


    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
      }


      /**
     * Onclick del botón 'Opciones avanzadas'.
     * 
     * @param {*} event 
     */
    clickOpcionesAvanzadas(event) {
    
        var x = document.getElementById("myDIV");
        if (x.style.display === "none") {
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
            if (x.style.display === "none") {
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
            if (x.style.display === "none") {
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


    onKeyPressHorarioDesdeHandle(event) {
        event.preventDefault();
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

        this.setState({ ciudad: event.target.value, apiario_seleccionado:"", colmena_seleccionada:"" }, () => {
            // Elimino valores del apiario
            this.emptySelector("selector-apiario");
            this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----','Seleccionar');
            // Elimino valores de colmenas
            this.emptySelector("selector-colmena");
            this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');
            // Agrego opciones al selector de apiarios.
            if ( this.state.ciudad != "Seleccionar" ) {

                this.actualizarMarkers(this.state.ciudad);

                var apiarios_existentes = this.state.apiarios;
                for( var i=0; i<apiarios_existentes.length; i++ ) {
                    if( apiarios_existentes[i]['localidad_chacra'] == this.state.ciudad ) {
                      this.createDefaultValueSelector(
                        "selector-apiario" ,
                        apiarios_existentes[i]['id'], 
                        this.createTextSelect(apiarios_existentes[i]['direccion_chacra'], apiarios_existentes[i]['nombre_fantasia']),
                        apiarios_existentes[i]['id']
                      );
                    }
                }
            }
          });
    }


    /**
     * 
     * @param {*} event 
     */
    handleChangeApiario(event) {

        

        this.setState({ apiario_seleccionado: event.target.value, colmena_seleccionada: "" }, () => {
        
            this.emptySelector("selector-colmena");
            this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----','Seleccionar');
            if ( this.state.ciudad != "Seleccionar" ) {
                var colmenas_existentes = this.state.colmenas;
                for( var i=0; i<colmenas_existentes.length; i++ ) {
                    if( colmenas_existentes[i]['apiario_id'] == this.state.apiario_seleccionado ) {
                      this.createDefaultValueSelector(
                        "selector-colmena",
                        colmenas_existentes[i]['id'], 
                        this.createTextSelect(colmenas_existentes[i]['identificacion']),
                        colmenas_existentes[i]['id']
                      );
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

            this.createMarkersApiarios(apiarios,this.state.colmenas);

    }

    getApiario(apiario_id) {
      
        var resultado = [];
    
        var apiarios = this.state.apiarios;
        for( var i = 0; i < apiarios.length; i++ ) {
    
          if( apiarios[i]['id'] == apiario_id) { resultado.push(apiarios[i]); break;}
          
        }
    
        return resultado;  
    }


    /**
     * 
     * @param {*} event 
     */
    handleChangeColmena(event) {
        this.setState({ colmena_seleccionada: event.target.value }, () => {});
    }


    actualizarMarkers(ciudad) {   
        
        var apiarios = this.getApiariosCiudad(ciudad);
    
        // Elimino todos los markers del mapa.
        for (var i = 0; i < markersApiarios.length; i++ ) {
          markersApiarios[i].setMap(null);
        }
        markersApiarios.length = 0;
    
        this.createMarkersApiarios(apiarios, this.state.colmenas);
    
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
     * 
     * @param {*} event 
     */
    handleClickAgregarColmena(event) {

        console.log(this.state.ciudad, this.state.apiario_seleccionado, this.state.colmena_seleccionada);

        // Validaciones
        if( this.state.ciudad == "" || this.state.ciudad == "Seleccionar" ) {alert("Ingrese ciudad.");return;}
        if( this.state.apiario_seleccionado == "" || this.state.apiario_seleccionado == "Seleccionar" ) {alert("Ingrese apiario.");return;}
        if( this.state.colmena_seleccionada == "" || this.state.colmena_seleccionada == "Seleccionar" ) {alert("Ingrese colmena.");return;}


        // Valido cantidad maxima de colmenas
        if( this.colmenas_en_tabla.length >= this.max_colmenas ) {alert("Máximo permitido: 5 colmenas.");return;}

        // Verificar que la colmena no se haya agregado
        var bandera = this.verificarColmena(this.state.colmena_seleccionada);
        if( bandera ) {alert("Ya ha agregado esa colmena.");return;}
        this.colmenas_en_tabla.push(this.state.colmena_seleccionada);


        var apiario = this.buscarApiario(this.state.apiario_seleccionado);
        var colmena = this.buscarColmena(this.state.colmena_seleccionada);

        // document.getElementById("tabla-colmenas").insertRow(-1).innerHTML = '<td>'+ this.state.ciudad + '</td><td>' + this.createTextSelect(apiario['direccion_chacra'], apiario['nombre_fantasia']) + '</td><td>' + colmena['identificacion'] +' </td><td><button id="btn-agregar-colmena-"' + colmena['id'] + ' type="button" className="btn btn-xs btn-flat btn-danger" onClick={this.handleClickEliminarColmena}><i className="fa fa-minus" /></button> </td>';

        var tableRef = document.getElementById('tabla-colmenas').getElementsByTagName('tbody')[0];

        // Insert a row in the table at the last row
        var newRow   = tableRef.insertRow();

        // Insert a cell in the row at index 0
        var newCell_ciudad  = newRow.insertCell(0);
        var newCell_apiario  = newRow.insertCell(1);
        var newCell_colmena  = newRow.insertCell(2);
        var newCell_acciones  = newRow.insertCell(3);

        // Append a text node to the cell
        var newText_ciudad  = document.createTextNode(this.state.ciudad);
        newCell_ciudad.appendChild(newText_ciudad);

        // Append a text node to the cell
        var newText_apiario  = document.createTextNode(this.createTextSelect(apiario['direccion_chacra'], apiario['nombre_fantasia']));
        newCell_apiario.appendChild(newText_apiario);
        
        // Append a text node to the cell
        var newText_colmena  = document.createTextNode(colmena['identificacion']);
        newCell_colmena.appendChild(newText_colmena);

        // Agrego botón eliminar
        var center = document.createElement("center");
        var button = document.createElement("button");
        button.className="btn btn-xs btn-flat btn-danger";
        button.style.fontWeight = "bold";
        button.id = "btn-eliminar-colmena-" + colmena['id'];
        button.onclick = this.handleClickEliminarColmena;
        button.innerText = "Eliminar";
        center.appendChild(button);
        newCell_acciones.appendChild(center);
        

    
        
    }

    

    verificarColmena(colmena_id) {
        for( var i=0; i<this.colmenas_en_tabla.length; i++ ) {
            if( this.colmenas_en_tabla[i] == colmena_id ) return true;
        }
        return false;
    }

    buscarApiario(apiario_id) {
        var apiarios = this.state.apiarios;
        for( var i=0; i<apiarios.length; i++ ) {
            if( apiarios[i]['id'] == apiario_id ) return apiarios[i];
        }
        return "";
    }

    buscarColmena(colmena_id) {
        var colmenas = this.state.colmenas;
        for( var i=0; i<colmenas.length; i++ ) {
            if( colmenas[i]['id'] == colmena_id ) return colmenas[i];
        }
        return "";
    }

    handleClickEliminarColmena(event) {
        // Obtengo el id de la colmena
        var colmena_id = (event.target.id).split('-')[3];
        console.log(event.target,colmena_id);
        
        // Elimino el id de colmenas en tabla
        for( var i=0; i<this.colmenas_en_tabla.length; i++ ) {
            if( this.colmenas_en_tabla[i] == colmena_id ) {
                const index = this.colmenas_en_tabla.indexOf(colmena_id);
                if (index > -1) {
                this.colmenas_en_tabla.splice(index, 1);
                }

                // array = [2, 9]
                console.log(this.colmenas_en_tabla); 

                break;
            }
        }

        // Elimino la fila
        var btn = event.target;
        var row = btn.parentNode.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
    

    descargarDatosPorDefecto(event) {
        
        // Variable
        var variable = document.getElementById("selector-variable").value;
        if(  variable == "Seleccionar"  ) { alert("Seleccione variable"); return; }
       
        // Valido tabla: ¿hay colmenas?
        if( this.colmenas_en_tabla.length == 0 ) { alert("Seleccione colmenas a comparar"); return; }
        if( this.colmenas_en_tabla.length == 1 ) { alert("Debe seleccionar al menos 2 colmenas."); return; }
        
        var tipoAccion = {
            accion: 'Rango',
            tipo: '7', // Significa que quiero los datos desde hace 7 días.
            fecha_actual: '',
            fecha_pasada: '',
            horario_desde: '08:00', // 'Todo el dia'
            horario_hasta: '16:00',
            rango: "120", // Representa el rango de minutos en el día. En este caso sería cada 2 horas : [08:00, 10:00, 12:00, ..., 16:00 ]
        };

        this.crearCSV(tipoAccion);
    }

    /**
     * 
     * @param {*} event 
     */
    buscarPorDefecto(event) {
        
        // Variable
        var variable = document.getElementById("selector-variable").value;
        if(  variable == "Seleccionar"  ) { alert("Seleccione variable"); return; }
       
        
        // Valido tabla: ¿hay colmenas?
        if( this.colmenas_en_tabla.length == 0 ) { alert("Seleccione colmenas a comparar"); return; }
        if( this.colmenas_en_tabla.length == 1 ) { alert("Debe seleccionar al menos 2 colmenas."); return; }
        
        
        // Elimino todos los gráficos del div contenedor de gráficos.
        ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));

        var tipoAccion = {
            accion: 'Rango',
            tipo: '7', // Significa que quiero los datos desde hace 7 días.
            fecha_actual: '',
            fecha_pasada: '',
            horario_desde: '08:00', // 'Todo el dia'
            horario_hasta: '16:00',
            rango: "120", // Representa el rango de minutos en el día. En este caso sería cada 2 horas : [08:00, 10:00, 12:00, ..., 16:00 ]
        };
           
        
        // Creo los gráficos.
        this.crear_graficos(variable, tipoAccion, "Últimos 7 días", "line");
    }



    descargarConFiltros(event) {
        
        // Variable
        var variable = document.getElementById("selector-variable").value;
        if(  variable == "Seleccionar"  ) { alert("Seleccione variable"); return; }
   
    
        // Valido tabla: ¿hay colmenas?
        if( this.colmenas_en_tabla.length == 0 ) { alert("Seleccione colmenas a comparar"); return; }
        if( this.colmenas_en_tabla.length == 1 ) { alert("Debe seleccionar al menos 2 colmenas."); return; }


        // Valido radio buttons
        if ( !document.getElementsByName('opcion-seleccionada')[0].checked && !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
        
        // Eligió Rango de Fechas
        if(document.getElementsByName('opcion-seleccionada')[1].checked) {
            
            // Valido Si el usuario no seleccionó un rango
            var rango_seleccionado = document.getElementById("select-rango-fechas").value;
            if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

            var fecha_desde = '';
            var fecha_hasta = '';
            var tipo_grafico = "Line";
            // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
            if( rango_seleccionado == "personalizado" ) {
                fecha_desde = document.getElementById("fecha-desde-rango").value;
                fecha_hasta = document.getElementById("fecha-hasta-rango").value;

                if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
                if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
                if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
            }

            var tipo_grafico = "Line";
            // Sigo completando los filtros.
            if( rango_seleccionado == 'hoy' ) tipo_grafico = "Bar";
            this.completarFiltrosParaDescargar(variable, "Rango", rango_seleccionado, fecha_desde, fecha_hasta );
        }
        else {
            /* EL USUARIO ELIGIÓ COMPARAR */

            var mensaje = this.validarRadioComparacion();
            if ( mensaje != "" )  { alert(mensaje); return; }
            // Eligió comparar días
            if( document.getElementsByName('label-comparacion')[0].checked  ) {
                var fecha_actual = document.getElementById("input-dia-seleccionado").value;
                if( fecha_actual == '' )  return alert("Ingrese un día para comparar.");  
                var dia_a_procesar = document.getElementById("input-dia-para-setear").value;
                if( dia_a_procesar == "" ) return alert("Dia.");
                var mes_a_procesar = document.getElementById("input-mes-para-setear").value;
                if( mes_a_procesar == "" ) return alert("Mes.");
                var anio_a_procesar = document.getElementById("selectDia-anio-seteado").value;
                if( anio_a_procesar == "" ) return alert("Ingrese un año a comparar.");
                var fecha_pasada = anio_a_procesar + "-" + mes_a_procesar + "-" + dia_a_procesar;

                // Sigo completando los filtros.
                this.completarFiltrosParaDescargar(variable, "Comparacion", "dia", fecha_actual, fecha_pasada);
            
            }
            // Eligió comparar meses
            else {
                var mes_actual = document.getElementById("input-mes-seleccionado").value;
                if( mes_actual == '' )  { alert("Ingrese una fecha."); return; }
                var anio_a_procesar = document.getElementById("select-anio-seteado").value;
                if( anio_a_procesar == "" ) return alert("Ingrese un año a comparar.");
                var mes_a_procesar = this.getMonthNumber(document.getElementById("input-mes-seteado").value);
                if( mes_a_procesar == "" ) return alert("Ingrese un mes a comparar.");
                var mes_pasado = anio_a_procesar + "-" + mes_a_procesar; // aca...

                if( mes_actual == '' )  { alert("Ingrese una fecha."); return; }

                
                // Sigo completando los filtros.
                this.completarFiltrosParaDescargar(variable, "Comparacion", "mes", mes_actual, mes_pasado);
                
            }
        }
    }


    completarFiltrosParaDescargar(variable, accion, tipo, fecha_actual, fecha_pasada) {
        try{
            
            var horario_desde = "Todo el dia";
            var horario_hasta = "Todo el dia";
            var rango = document.getElementById("select-intervalo-tiempo").value;
    
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
    
            this.crearCSV(tipoAccion);
            
    
        } catch(error) {
            console.log("Ocurrió un error: " + error);
        }
    }

    /**
     * 
     * @param {*} event 
     */
    aplicarFiltros(event) {

        // Variable
      var variable = document.getElementById("selector-variable").value;
      if(  variable == "Seleccionar"  ) { alert("Seleccione variable"); return; }
     
      
      // Valido tabla: ¿hay colmenas?
      if( this.colmenas_en_tabla.length == 0 ) { alert("Seleccione colmenas a comparar"); return; }
      if( this.colmenas_en_tabla.length == 1 ) { alert("Debe seleccionar al menos 2 colmenas."); return; }
 

      // Valido radio buttons
      if ( !document.getElementsByName('opcion-seleccionada')[0].checked && !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
      
      // Eligió Rango de Fechas
      if(document.getElementsByName('opcion-seleccionada')[1].checked) {
          
          // Valido Si el usuario no seleccionó un rango
          var rango_seleccionado = document.getElementById("select-rango-fechas").value;
          if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

          var fecha_desde = '';
          var fecha_hasta = '';
          var tipo_grafico = "Line";
          // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
          if( rango_seleccionado == "personalizado" ) {
              fecha_desde = document.getElementById("fecha-desde-rango").value;
              fecha_hasta = document.getElementById("fecha-hasta-rango").value;

              if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
              if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
              if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
          }

          var tipo_grafico = "Line";
          // Sigo completando los filtros.
          if( rango_seleccionado == 'hoy' ) tipo_grafico = "Bar";
          this.completarFiltros(variable, "Rango", rango_seleccionado, fecha_desde, fecha_hasta, tipo_grafico );
      }
      else {
          /* EL USUARIO ELIGIÓ COMPARAR */

          var mensaje = this.validarRadioComparacion();
          if ( mensaje != "" )  { alert(mensaje); return; }
          // Eligió comparar días
          if( document.getElementsByName('label-comparacion')[0].checked  ) {
                var fecha_actual = document.getElementById("input-dia-seleccionado").value;
                if( fecha_actual == '' )  { alert("Ingrese un día para comparar."); return; }
                var dia_a_procesar = document.getElementById("input-dia-para-setear").value;
                if( dia_a_procesar == "" ) return alert("Dia.");
                var mes_a_procesar = document.getElementById("input-mes-para-setear").value;
                if( mes_a_procesar == "" ) return alert("Mes.");
                var anio_a_procesar = document.getElementById("selectDia-anio-seteado").value;
                if( anio_a_procesar == "" ) return alert("Ingrese un año a comparar.");
                var fecha_pasada = anio_a_procesar + "-" + mes_a_procesar + "-" + dia_a_procesar;

                // Sigo completando los filtros.
                this.completarFiltros(variable, "Comparacion", "dia", fecha_actual, fecha_pasada, "Bar" );
            
          }
          // Eligió comparar meses
          else {
                var mes_actual = document.getElementById("input-mes-seleccionado").value;
                if( mes_actual == '' )  { alert("Ingrese una fecha."); return; }
                var anio_a_procesar = document.getElementById("select-anio-seteado").value;
                if( anio_a_procesar == "" ) return alert("Ingrese un año a comparar.");
                var mes_a_procesar = this.getMonthNumber(document.getElementById("input-mes-seteado").value);
                if( mes_a_procesar == "" ) return alert("Ingrese un mes a comparar.");
                var mes_pasado = anio_a_procesar + "-" + mes_a_procesar; // aca...

              
                // Sigo completando los filtros.
                this.completarFiltros(variable, "Comparacion", "mes", mes_actual, mes_pasado, "Bar" );
              
          }
      }

        
    }

    validarRadioComparacion() {
        if( !document.getElementsByName('label-comparacion')[0].checked && !document.getElementsByName('label-comparacion')[1].checked ) return "Debe seleccionar una opción de comparación."
        else return "";
    }


    validarHorario() {
        if(  document.getElementById("selector-horario-desde").value == "" && document.getElementById("selector-horario-hasta").value == ""  ) return "Ingrese Horario Desde y Horario Hasta.";
        if(  document.getElementById("selector-horario-desde").value == ""  ) return "Ingrese Horario Desde.";
        if(  document.getElementById("selector-horario-hasta").value == ""  ) return "Ingrese Horario Hasta.";
        if(  document.getElementById("selector-horario-desde").value >= document.getElementById("selector-horario-hasta").value ) return "Horario Desde debe ser menor a Horario Hasta.";
        return "";
    }

    completarFiltrosCSV(accion, tipo, fecha_actual, fecha_pasada ) {
        try{
            
            var horario_desde = "Todo el dia";
            var horario_hasta = "Todo el dia";            
            var rango = document.getElementById("select-intervalo-tiempo").value;

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
            
            // Creo los gráficos.
            this.crearCSV(tipoAccion);

        } catch(error) {
            console.log("Ocurrió un error: " + error);
        }
    }

    completarFiltros(variable, accion, tipo, fecha_actual, fecha_pasada, tipo_grafico) {
        try{
            
            var horario_desde = "Todo el dia";
            var horario_hasta = "Todo el dia";            
            var rango = document.getElementById("select-intervalo-tiempo").value;
            var grafico = "line";

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
                if ( !document.getElementsByName('label-tipo-grafico')[0].checked && !document.getElementsByName('label-tipo-grafico')[1].checked && !document.getElementsByName('label-tipo-grafico')[2].checked && !document.getElementsByName('label-tipo-grafico')[3].checked ) { alert("Seleccione un tipo de gráfico."); return; }
                if(document.getElementsByName('label-tipo-grafico')[0].checked) grafico = "column";
                else if(document.getElementsByName('label-tipo-grafico')[1].checked) grafico = "line";
                else if(document.getElementsByName('label-tipo-grafico')[2].checked) grafico = "spline";
                else if(document.getElementsByName('label-tipo-grafico')[3].checked) grafico = "area";
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



            // Creo titulo
            var titulo = "*TODO ";
            console.log(variable, this.colmenas_en_tabla, tipoAccion, titulo, grafico);
            
            // Creo los gráficos.
            this.crear_graficos(variable, tipoAccion, titulo, grafico);

        } catch(error) {
            console.log("Ocurrió un error: " + error);
        }
    }


    crear_graficos(variable, tipoAccion, titulo, tipoGrafico) {
        
        var graficos = [];

        if( tipoAccion['accion'] == "Comparacion" && tipoAccion['tipo'] == "dia" ) { 
            graficos.push(<ChartColmenasDia key={1234}  variable={variable} colmenas={ this.colmenas_en_tabla } tipoAccion={tipoAccion} rango={60} titulo={titulo} tipo_grafico={tipoGrafico} />);
        }
        else if( tipoAccion['accion'] == "Comparacion" && tipoAccion['tipo'] == "mes" ) {  
            graficos.push(<ChartColmenasMes key={1234}  variable={variable} colmenas={ this.colmenas_en_tabla } tipoAccion={tipoAccion} rango={60} titulo={titulo} tipo_grafico={tipoGrafico} />);
        }
        else if( tipoAccion['accion'] == "Rango" ) { 
            graficos.push(<ChartColmenas key={1234}  variable={variable} colmenas={ this.colmenas_en_tabla } tipoAccion={tipoAccion} rango={60} titulo={titulo} tipo_grafico={tipoGrafico} />);
        }

        ReactDOM.render(graficos, document.getElementById('contenedor'));
    }

    
    crearCSV(tipoAccion) {
        var variable = document.getElementById("selector-variable").value;
        var colmenas = this.colmenas_en_tabla;

        console.log(variable,colmenas,tipoAccion);

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/revisaciones/colmenas/csv");
        var params = {
            variable: variable,
            colmenas: JSON.stringify(colmenas), 
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
     * Cambio la fecha en el panel de comparación de dias.
     * Seteo la fecha del año anterior.
     * 
     * @param {*} event 
     */
    changeComparacionDias(event) {
        var fecha_ingresada = document.getElementById("input-dia-seleccionado").value;

        var this_year = fecha_ingresada.split("-")[0];
        var this_month = fecha_ingresada.split("-")[1];
        var this_date = fecha_ingresada.split("-")[2];

        if( this_date == undefined || this_date == "" || this_month == "" || this_month == "") {
            document.getElementById("input-dia-para-setear").value = ""; 
            document.getElementById("input-mes-para-setear").value = "";
            this.createSelectorAniosValues(this_year, "selectDia-anio-seteado");
            return;
        }                

        document.getElementById("input-dia-para-setear").value = this_date; 
        document.getElementById("input-mes-para-setear").value = this_month;
        this.createSelectorAniosValues(this_year, "selectDia-anio-seteado");
     }
  
     /**
       * Cambio el mes en el panel de comparación de meses.
       * Seteo mes del año anterior.
       * 
       * @param {*} event 
       */
      changeComparacionMeses(event) {
        var mes_ingresado = document.getElementById("input-mes-seleccionado").value;

        var this_year = mes_ingresado.split("-")[0];
        var this_month = mes_ingresado.split("-")[1];

        if( this_month == "" || this_month == undefined ) {
            document.getElementById("input-mes-seteado").value = ""; 
            this.createSelectorAniosValues(this_year, "select-anio-seteado");
            return;  
        }

        var mes = this.getMonthName(this_month);
        document.getElementById("input-mes-seteado").value = mes;   

        this.createSelectorAniosValues(this_year, "select-anio-seteado");
    }

    getMonthName(month) {
        month = parseInt(month);
        if( month == 1 ) return "Enero";
        if( month == 2 ) return "Febrero";
        if( month == 3 ) return "Marzo";
        if( month == 4 ) return "Abril";
        if( month == 5 ) return "Mayo";
        if( month == 6 ) return "Junio";
        if( month == 7 ) return "Julio";
        if( month == 8 ) return "Agosto";
        if( month == 9 ) return "Septiembre";
        if( month == 10 ) return "Octubre";
        if( month == 11 ) return "Noviembre";
        if( month == 12 ) return "Diciembre";
    }

    getMonthNumber(month) {
        if( month == "Enero" ) return "01";
        if( month == "Febrero" ) return "02";
        if( month == "Marzo" ) return "03";
        if( month == "Abril" ) return "04";
        if( month == "Mayo" ) return "05";
        if( month == "Junio" ) return "06";
        if( month == "Julio" ) return "07";
        if( month == "Agosto" ) return "08";
        if( month == "Septiembre" ) return "09";
        if( month == "Octubre" ) return "10";
        if( month == "Noviembre" ) return "11";
        if( month == "Diciembre" ) return "12";
        return "";
    }


    createSelectorAniosValues(anio, nombre_selector) {
        if( anio == "" || anio == undefined ) {
            this.emptySelector(nombre_selector);
            this.createDefaultValueSelector(nombre_selector,0,'----- Seleccionar -----','');
            return;
        }
        anio = parseInt(anio);
        anio = anio - 1;
        this.emptySelector(nombre_selector);
        this.createDefaultValueSelector(nombre_selector,0,'----- Seleccionar -----','');
        if( anio < 2000 || anio > 2020 ) return;
        for( var i=anio; i>=2000; i--) this.createDefaultValueSelector(nombre_selector, i, i, i);//
    }



    buscarEstadoApiario(apiario_id) {

        var estados = this.state.estados;

        for( var i = 0 ; i < estados.length; i++ ){

            if( estados[i][0] == apiario_id ) return estados[i][1];
        }

        return "verde";
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
                <div className="content-wrapper">

{/* Content Header (Page header) */}
<section className="content-header">
    <h1>
        Revisaciones 
        <br/>
        <small>Comparación de Colmenas</small>
        <hr/>
    </h1>

    <ol className="breadcrumb">
          <li className="active"><i className="fa fa-thermometer-full" /> Revisaciones</li>
          <li>Comparación Colmenas</li>
    </ol>

    <div className="row">

        <div className="col-xs-12 col-md-12 col-lg-6">
            <div id="box-revisaciones" className="box box-primary">
                <div className="box-header with-border">
                    <h3 className="box-title">Parámetros de Búsqueda</h3>
                </div>
                <div className="box-body">

                    {/* Row: Cabecera */}
                    <div className="row" style={{marginTop: 10}}>
            

            <div className="form-group">
                <label htmlFor="b-buscar-datos" className="col-md-12"></label>
                <div className="col-xs-12 col-md-12 col-lg-12">
                <b id="b-buscar-datos"> Seleccione variable: <i id="spinner-selector-variable" className="fa fa-spinner fa-pulse fa-sm fa-fw" /></b>
                <hr /> 
                </div>                                    
            </div>    

            {/* ComboBox Ciudad' */}
            <div className="form-group">
                    <label htmlFor="selector-variable" className="col-md-12">Variable </label>
                    <div className="col-md-12">
                        <select className="form-control" id="selector-variable" name="selector-variable" defaultValue={'Seleccionar'} disabled={this.state.isDisableVariable}>
                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                            <option key={1} value={'temperatura'}>Temperatura</option> 
                            <option key={2} value={'humedad'}>Humedad</option>
                        </select>
                        <br />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="b-buscar-datos" className="col-md-12"></label>
                    <div className="col-xs-12 col-md-12 col-lg-12">
                    <b id="b-buscar-datos"> Seleccione colmena: <i id="spinner-selector-colmena" className="fa fa-spinner fa-pulse fa-sm fa-fw" /></b>
                    <hr /> 
                    </div>                                    
                </div>  
        
                {/* ComboBox Ciudad' */}
                <div className="form-group">
                    <label htmlFor="selector-ciudad" className="col-md-12">Ciudad </label>
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
                        <select className="form-control" id="selector-apiario" name="selector-apiario" defaultValue={'Seleccionar'} onChange={this.handleChangeApiario}>
                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                            {/* {optionItems} */}
                        </select>
                        <br />
                    </div>
                </div>

                {/* ComboBox Colmena' */}
                <div className="form-group">
                    <label htmlFor="selector-colmena" className="col-md-12">Colmena</label>
                    <div className="col-md-12">
                        <select className="form-control" id="selector-colmena" name="selector-colmena" defaultValue={'Seleccionar'} onChange={this.handleChangeColmena}>
                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option>
                        </select>
                        <br />
                    </div>
                </div>
                
                {/* Btn Agregar Colmena */}
                <div className="form-group" style={{textAlign:"center"}}>
                    <label htmlFor="btn-agregar-colmena" className="col-md-12"></label>
                    <div className="col-xs-12 col-md-12 col-lg-12">
                        <button id="btn-agregar-colmena" type="button" className="btn btn-xs btn-flat btn-primary" onClick={this.handleClickAgregarColmena}><i className="fa fa-plus" /> <strong>Agregar Colmena &nbsp;</strong></button>
                    </div>                                    
                    
                </div>
                
                
                
                {/* Acá iría la tabla */}
                <div className="col-xs-12">
                    <br />    
                    <br />    
                    <div className="box">
                        <div className="box-header">
                        <h3 className="box-title">Colmenas seleccionadas</h3>
                        
                        </div>
                        {/* /.box-header */}
                        <div className="box-body table-responsive no-padding">
                        <table id="tabla-colmenas" className="table table-hover table-bordered">
                            <tbody>
                            <tr>
                                <th>Ciudad</th>
                                <th>Apiario</th>
                                <th>Colmena</th>
                                <th>Acciones</th>
                            </tr>
                            </tbody></table>
                        </div>
                        {/* /.box-body */}
                    </div>
                    {/* /.box */}
                </div>



                {/* Btn Buscar / Btn Más Filtros */}
                <div className="form-group">
                    <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                    <div className="col-xs-6 col-md-6 col-lg-6">
                        <button id="btn-buscar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-left" onClick={this.buscarPorDefecto}><i className="fa fa-search" /> <strong>Buscar datos &nbsp;</strong></button>
                        <button id="btn-descargar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-right" onClick={this.descargarDatosPorDefecto}><i className="fa fa-search" /> <strong>Descargar datos &nbsp;</strong></button>
                    </div>                                    
                    <div className="col-xs-6 col-md-6 col-lg-6">
                        <button  className="btn btn-sm btn-flat btn-primary pull-right" onClick={this.clickOpcionesAvanzadas} data-toggle="tooltip" data-placement="top" title="Editar"><i className="fa fa-bars" /> <strong> Más opciones </strong></button>
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
                    {/* ./row */}
        
                    {/* Row Filtros */}
                    <div className="row" style={{marginTop: 10}}>
                
                
                            <div className="form-group">
                            
                                <div className="col-md-12">
                                    
                                    {/* Contenedor */}
                                    <div id="myDIV" style={{display: 'none', borderStyle: 'double'}}>
                                            
                                            {/* SubContenedor */}
                                            <div style={{padding: '20px 20px 20px 20px'}}>
                                                

                                                {/* DIV FILTRO COMPARACION */} 
                                                <div>
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
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="input-dia-para-setear" className="col-md-12">Día</label>
                                                                            <input id="input-dia-para-setear" className="form-control" type="text" name="bday" disabled/>  <br /> 
                                                                        </div>
                                                                        
                                                                        <div className="col-md-2">
                                                                            <label htmlFor="input-mes-para-setear" className="col-md-12">Mes</label>
                                                                            <input id="input-mes-para-setear" className="form-control" type="text" name="bday" disabled/>  <br /> 
                                                                        </div>
                                                                        
                                                                        <div className="col-md-4">
                                                                            <label htmlFor="selectDia-anio-seteado" className="col-md-12">Año</label>
                                                                            <select className="form-control" id="selectDia-anio-seteado" name="select-mes-seteado" defaultValue={'Seleccionar'} >
                                                                                <option key={0} value={''}>Seleccionar</option>
                                                                            </select>
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
                                                                        <div className="col-md-3">
                                                                            <label htmlFor="input-mes-seteado" className="col-md-12">Mes</label>
                                                                            <input id="input-mes-seteado" className="form-control" type="text" name="bday" disabled /> 
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label htmlFor="select-anio-seteado" className="col-md-12">Año</label>
                                                                            <select className="form-control" id="select-anio-seteado" name="select-anio-seteado" defaultValue={'Seleccionar'} >
                                                                                <option key={0} value={''}>Seleccionar</option>
                                                                            </select>
                                                                        </div>
                                                                    </div> {/* /.DIV Comparacion de MESES */} 
                                                            </div>
                                                            {/* <br />   */}
                                                        </div>
                                                    </div>
                                                </div>  {/* ./DIV FILTRO COMPARACION */}


                                                <hr /> 

                                                
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
                                                                <div className="row" style={{display:'none'}}>
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
                    {/* ./row */}
                </div>
                {/* ./box-body */}
            </div>
            {/* /.box */}
        </div>
        {/* ./LEFT col */}
        <div className="col-xs-12 col-md-12 col-lg-6">
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
        {/* ./RIGHT col */}
  
    </div>
    {/* ./row */}

</section>

{/* Main content */}
<section className="content">
  <div id="contenedor" className="row"> 
      
  </div>
  {/* /.row */}
</section>
{/* /.content */}

</div>
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
  export default connect(null,mapDispatchToProps)(ColmenasComparacion)
