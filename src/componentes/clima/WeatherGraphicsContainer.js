import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import WeatherGraphicsDia from './charts/WeatherGraphicsDia';
import WeatherGraphicsMes from './charts/WeatherGraphicsMes';
import WeatherGraphicsRango from './charts/WeatherGraphicsRango';

var ciudades = ["Rawson", "Trelew", "Gaiman", "Dolavon", "28 de Julio"];
var ciudades_comparar  = [];
export default class WeatherGraphicsContainer extends Component {

    
   
    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);
        
        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Defino las variables de la clase.
        this.state = {
          ciudad_seleccionada : "",
          variable_seleccionada : "",
          isCheckedTipoGrafico: false,
          isCheckedCiudadComparar : false,
          apiarios: [],
          colmenas: [], //this.state.apiarios[i].colmenas
          apiario_seleccionado: 0,
          
        }

        // Asocio el metodo a la clase.
        this.clickOpcionesAvanzadas = this.clickOpcionesAvanzadas.bind(this);
        this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
        this.getDatosPorDefecto = this.getDatosPorDefecto.bind(this);
        this.validarSelectores = this.validarSelectores.bind(this);
        this.crear_graficos = this.crear_graficos.bind(this);
        this.aplicarFiltros = this.aplicarFiltros.bind(this);
        this.crear_titulo = this.crear_titulo.bind(this);
        this.completarFiltros = this.completarFiltros.bind(this);
        this.handleChangeChkTipoGrafico = this.handleChangeChkTipoGrafico.bind(this);
        this.handleOptionChangeComparacion = this.handleOptionChangeComparacion.bind(this); 
        this.handleOptionChangeTipoGrafico = this.handleOptionChangeTipoGrafico.bind(this);
        this.changeComparacionDias = this.changeComparacionDias.bind(this);
        this.changeComparacionMeses = this.changeComparacionMeses.bind(this);
        this.validarRadioComparacion = this.validarRadioComparacion.bind(this);

        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);

        this.handleChangeChkCiudadComparar = this.handleChangeChkCiudadComparar.bind(this);
        this.handleClickAgregarColmena = this.handleClickAgregarColmena.bind(this);

        this.getMonthName = this.getMonthName.bind(this);
        this.getMonthNumber = this.getMonthNumber.bind(this);
        this.createSelectorAniosValues = this.createSelectorAniosValues.bind(this);
      }

      
      
      
    /**
     * Método del ciclo de vida de la clase: Busco los apiarios existentes.
     * 
     * Explicación de llamadas ajax con fetch: Explicacion del fetch: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/
     */
    componentDidMount() {

        this._isMounted = true;
        

    }
    
    componentWillUnmount() {
        this._isMounted = false;
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
    handleChangeChkCiudadComparar(event) {
        this.setState({
            isCheckedCiudadComparar: !this.state.isCheckedCiudadComparar,
        }, () => {
            if( this.state.isCheckedCiudadComparar ) document.getElementById("div-comparar-ciudades").style.display = "block";
            else document.getElementById("div-comparar-ciudades").style.display = "none";
        });
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
          document.getElementById("mensajes-boton-buscar").style.display = "none";
        } 
        else {
          x.style.display = "none";
          document.getElementById("btn-buscar-datos").style.display = "block";
          document.getElementById("mensajes-boton-buscar").style.display = "block";
        }
      
        //console.log(this.DatePicker.current.state.start._d);
    }

   

    validarSelectores(ciudad, variable) {
        
        // Apiario no seleccionado
        if( ciudad == "Seleccionar" ) return "Debe seleccionar un apiario.";
        // Variable no seleccionada
        if( variable == "Seleccionar" ) return "Debe seleccionar una variable.";
              
        return "";
    }


    

    /**
     * Manejo el evento OnClick cuando el usuario presiona el botón "Buscar Datos".
     * Obtengo los datos de la última semana de las colmenas del apiario seleccionado.
     * 
     * @param {*} event 
     */
    getDatosPorDefecto(event) {

        // Obtengo datos seleccionados por el usuario
        var ciudad = document.getElementById("selector-ciudad").value;
        var variable = document.getElementById("selector-variable-climatica").value;
        
        // Valido selectores
        var mensaje = this.validarSelectores(ciudad, variable);
        if ( mensaje != "" )  { alert(mensaje); return; }
           
        // Elimino todos los gráficos del div contenedor de gráficos.
        // ReactDOM.unmountComponentAtNode <-------------- VER VER VER VER VER EVR EV EVR RV ERV RE
        //ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));

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
        this.crear_graficos(ciudad, variable, tipoAccion, "Últimos 7 días", "line");

    }


    /**
     * Handle Onclick Botón Aplicar Filtros.
     * Valido filtros de comparación y de rangos.
     * Delega a otro método el procesamiento de los demás filtros y la generación de los gráficos.
     * @param {*} event 
     */
    aplicarFiltros(event) {
        
        // Obtengo datos seleccionados por el usuario
        var ciudad = document.getElementById("selector-ciudad").value;
        var variable = document.getElementById("selector-variable-climatica").value;
       

        // Valido selectores
        var mensaje = this.validarSelectores(ciudad, variable);
        if ( mensaje != "" )  { alert(mensaje); return; }


        // Valido radio buttons
        if ( !document.getElementsByName('opcion-seleccionada')[0].checked && !document.getElementsByName('opcion-seleccionada')[1].checked ) { alert("Seleccione un filtro."); return; }
        
        // Eligió comparar
        if(document.getElementsByName('opcion-seleccionada')[0].checked) {
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
                this.completarFiltros(ciudad, variable, "Comparacion", "dia", fecha_actual, fecha_pasada, "Bar" );
              
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
                this.completarFiltros(ciudad, variable, "Comparacion", "mes", mes_actual, mes_pasado, "Bar" );
                
            }
        }
        // Eligio Rango de Fechas
        else {
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
            this.completarFiltros(ciudad, variable, "Rango", rango_seleccionado, fecha_desde, fecha_hasta, tipo_grafico );
        }
        
    }


   
    /**
     * 
     * @param {string} ciudad 
     * @param {string} variable {Temperatura, Humedad, etc..}
     * @param {string} accion {Dia, Mes, Rango}
     * @param {string} tipo {hoy, ayer, ultimos 7 dias, ...}
     * @param {string} fecha_actual 
     * @param {string} fecha_pasada 
     * @param {string} tipo_grafico 
     */
    completarFiltros(ciudad, variable, accion, tipo, fecha_actual, fecha_pasada, tipo_grafico) {
        try{
            
            var grafico = "column";
            
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
                horario_desde: "Todo el dia",
                horario_hasta: "Todo el dia",
                rango: 60,
            };



            // Creo un titulo para el grafico.
            var titulo = this.crear_titulo(accion, tipo, fecha_actual, fecha_pasada);

            // Creo los gráficos.
            this.crear_graficos(ciudad, variable, tipoAccion, titulo, grafico);

        } catch(error) {
            console.log("Ocurrió un error: " + error);
        }
    }


    

    /**
     * Recorre las colmenas del apiario seleccionado, y delega al componente Chart que renderice 
     * el gráfico adecuado en base a los parámetros pasados.
     * 
     * @param {*} ciudad es el id del apiario
     * @param {*} variable {Temperatura, Humedad, Temperatura y Humedad}
     * @param {*} tipoAccion {array(Rango), array(Comparacion)} + horario desde y hasta.
     * @param {*} titulo es un String que será el título del gráfico.
     * @param {*} tipoGrafico {Line, Bar}
     */
    crear_graficos(ciudad, variable, tipoAccion, titulo, tipoGrafico) {
        var graficos = [];

        ReactDOM.unmountComponentAtNode(document.getElementById('contenedor'));
        
        if( tipoAccion['accion'] == "Comparacion" && tipoAccion['tipo'] == "dia" ) {
            if( this.state.isCheckedCiudadComparar ) graficos.push(<WeatherGraphicsDia ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={ciudades_comparar} />);
            else graficos.push(<WeatherGraphicsDia ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={[]} />);
        }
        else if( tipoAccion['accion'] == "Comparacion" && tipoAccion['tipo'] == "mes" ) {
            if( this.state.isCheckedCiudadComparar ) graficos.push(<WeatherGraphicsMes ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={ciudades_comparar} />);
            else graficos.push(<WeatherGraphicsMes ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={[]} />);
        }
        else if( tipoAccion['accion'] == "Rango" ) {
            if( this.state.isCheckedCiudadComparar ) graficos.push(<WeatherGraphicsRango ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={ciudades_comparar} />);
            else graficos.push(<WeatherGraphicsRango ciudad={ciudad} variable={variable} key={variable}  tipoAccion={tipoAccion} titulo={titulo} tipo_grafico={tipoGrafico} ciudades={[]} />);
        }
        
       
        
        

        ReactDOM.render(graficos, document.getElementById('contenedor'));
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


    validarRadioComparacion() {
        if( !document.getElementsByName('label-comparacion')[0].checked && !document.getElementsByName('label-comparacion')[1].checked ) return "Debe seleccionar una opción de comparación."
        else return "";
    }
    

    /**
     * Verifica qué opción avanzada eligió el usuario: Rango de fechas o Comparación, y muestra el DIV correspondiente.
     * Verifica qué radiobutton se eligió.
     * 
     * @param {*} event 
     */
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


    handleChangeCiudad(event) {
        
        this.setState({ ciudad_seleccionada : event.target.value }, () => {

            // Elimino tabla
            var Table = document.getElementById("tbody-ciudades");
            Table.innerHTML = "";            
            ciudades_comparar = [];

            // Reseteo Selector
            this.emptySelector("selector-ciudad-comparar");
            this.createDefaultValueSelector("selector-ciudad-comparar",0,'----- Seleccionar -----',"");
            if ( this.state.ciudad_seleccionada != "" ) {
      
                for( var i=0; i<ciudades.length; i++ ) {
                    
                    if( ciudades[i] == this.state.ciudad_seleccionada )  continue;
            
                    this.createDefaultValueSelector(
                    "selector-ciudad-comparar",  
                    ciudades[i], 
                    ciudades[i],
                    ciudades[i]
                    );
                    
                }
            }
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
       * 
       * @param {*} event 
       */
      handleClickAgregarColmena(event) {

        var ciudad_elegida = document.getElementById("selector-ciudad-comparar").value;

        if( ciudad_elegida == "" ) { alert("Ingrese ciudad."); return; }
        if(  ciudades_comparar.includes(ciudad_elegida)  ) { alert("Ya has ingresado esta ciudad."); return; }
        
        ciudades_comparar.push(ciudad_elegida);

        var tableRef = document.getElementById('tabla-ciudades').getElementsByTagName('tbody')[0];

        // Insert a row in the table at the last row
        var newRow   = tableRef.insertRow();

        // Insert a cell in the row at index 0
        var newCell_ciudad  = newRow.insertCell(0);
        var newCell_acciones  = newRow.insertCell(1);
    
        // Append a text node to the cell
        var newText_ciudad  = document.createTextNode(ciudad_elegida);
        newCell_ciudad.appendChild(newText_ciudad);

        // Agrego botón eliminar
        var center = document.createElement("center");
        var button = document.createElement("button");
        button.className="btn btn-xs btn-flat btn-danger";
        button.style.fontWeight = "bold";
        button.id = "btn-eliminar-ciudad-" + ciudad_elegida;
        button.onclick = this.handleClickEliminarColmena;
        button.innerText = "Eliminar";
        center.appendChild(button);
        newCell_acciones.appendChild(center);
      }

      
      handleClickEliminarColmena(event) {
        // Obtengo el id de la colmena
        var ciudad = (event.target.id).split('-')[3];
        console.log(event.target,ciudad);
        
        // Elimino el id de colmenas en tabla
        for( var i=0; i<ciudades_comparar.length; i++ ) {
            if( ciudades_comparar[i] == ciudad ) {
                const index = ciudades_comparar.indexOf(ciudad);
                if (index > -1) {
                ciudades_comparar.splice(index, 1);
                }
  
                // array = [2, 9]
                console.log(ciudades_comparar); 
  
                break;
            }
        }
  
        // Elimino la fila
        var btn = event.target;
        var row = btn.parentNode.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }


    /**
     * 
     */
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
                              Clima 
                              <br/>
                              <small>Gráficos </small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><a href="fake_url"><i className="fa fa-sun-o" /> Clima</a></li>
                              <li className="active">Clima</li>
                          </ol>

                          <div id="row-contenedor-total" className="row">
                            <div className="col-md-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Seleccione Datos</h3>
                                    </div>
                                    <div className="box-body">
                        
                                        {/* Row: Cabecera */}
                                        <div className="row" style={{marginTop: 10}}>
                                        
                                    
                                                {/* ComboBox Ciudad */}
                                                <div className="form-group">
                                                    <label htmlFor="selector-ciudad" className="col-md-12">Ciudad</label>
                                                    <div className="col-md-3">
                                                        <select className="form-control" id="selector-ciudad" name="selector-ciudad" defaultValue={'Seleccionar'} onChange={this.handleChangeCiudad}>
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

                                                
                                                {/* ComboBox Variable Climática */}
                                                <div className="form-group">
                                                    <label htmlFor="selector-variable-climatica" className="col-md-12">Variable Climática</label>
                                                    <div className="col-md-3">
                                                        <select className="form-control" id="selector-variable-climatica" name="selector-variable-climatica" defaultValue={'Seleccionar'} >
                                                            <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                                            <option key={1} value={'temperatura'}>Temperatura</option> 
                                                            <option key={2} value={'humedad'}>Humedad</option>
                                                            <option key={3} value={'velocidad_viento'}>Velocidad del Viento</option>
                                                            <option key={4} value={'presion'}>Presion Atmosférica</option>
                                                            <option key={5} value={'horas_sol'}>Horas de Sol</option>
                                                        </select>
                                                        <br />
                                                    </div>
                                                </div>


                                                {/* Btn Buscar / Btn Más Filtros */}
                                                <div className="form-group">
                                                    <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                                    <div className="col-xs-3 col-md-3 col-lg-3">
                                                        <button id="btn-buscar-datos" type="button" className="btn btn-sm btn-flat btn-success pull-left" onClick={this.getDatosPorDefecto}><i className="fa fa-search" /> <strong>Buscar datos &nbsp;</strong></button>
                                                    </div>                                    
                                                    <div className="col-xs-8 col-md-8 col-lg-9">
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
                                                                        <input type="radio" name="opcion-seleccionada" value="comparacion" onChange={this.handleOptionChange}  /> <label> Comparación interanual. </label> <br />
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
                                                                                        <div className="col-md-3">
                                                                                            <input id="input-dia-seleccionado" className="form-control" type="date" name="bday" min={min_date_this_year} max={max_date_this_year}  onChange={this.changeComparacionDias}/> 
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
                                                                                        <div className="col-md-3">
                                                                                            <input id="input-mes-seleccionado" className="form-control" type="month" name="bday" min={"2010-01"} max={"2020-12"} onChange={this.changeComparacionMeses}/> <br />
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
                                                                                    </div>
                                                                                </div> {/* /.DIV Comparacion de MESES */} 
                                                                                <br />  
                                                                        </div>
                                                                    </div>
                                                                </div>  {/* ./DIV FILTRO COMPARACION */}


                                                                <hr /> 


                                                                {/* DIV FILTRO RANGO FECHAS */}
                                                                <div>
                                                                    <div className="form-group">
                                                                        <input type="radio" name="opcion-seleccionada" value="rango" onChange={this.handleOptionChange} /> <label> Seleccionar rango de fechas. </label> <br />
                                                                        {/* DIV Rango de Fechas */}
                                                                        <div id="div-rangos" style={{display : 'none', marginTop : 10}}>
                                                                                <div className="row">
                                                                                    <label htmlFor="select-rango-fechas" className="col-md-12">Rango de fechas</label>
                                                                                    <div className="col-md-3">
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

                                                                                {/* DIV Rango de fechas personalizado */}
                                                                                <div id="div-rangos-personalizados" style={{display : 'none'}}>
                                                                                    <div className="row">
                                                                                        <label htmlFor="rango-fechas-personalizado" className="col-md-12">Rango de fechas personalizado</label>
                                                                                    </div>

                                                                                    <div className="row">
                                                                                        <label htmlFor="rango-fechas" className="col-md-12">Desde</label>
                                                                                        <div className="col-md-3">
                                                                                            <input id="fecha-desde-rango" className="form-control" type="date" name="bday" />  
                                                                                            <br />
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="row">
                                                                                        <label htmlFor="rango-fechas" className="col-md-12">Hasta</label>
                                                                                        <div className="col-md-3">
                                                                                            <input id="fecha-hasta-rango" className="form-control" type="date" name="bday" />  
                                                                                            <br />
                                                                                        </div>
                                                                                    </div>

                                                                                </div> {/* /.DIV Rango de fechas personalizado */} 
                                                                        </div> {/* /.div-rangos */} 
                                                                    </div>
                                                                </div> {/* ./DIV FILTRO RANGO FECHAS */}
                                                                
                                                                
                                                                <hr /> 
                                                                   

                                                                {/* DIV Comparar Ciudades */}
                                                                <div className="row">
                                                                    <div className="col-xs-12 col-md-12 col-lg-12">
                                                                        <div className="form-group">
                                                                            <input type="checkbox" id="chk-comparar-ciudades" name="chk-comparar-ciudades" defaultChecked={this.state.isCheckedCiudadComparar} onChange={this.handleChangeChkCiudadComparar} /> <label> Comparar con otras ciudades. </label> <br />          
                                                                            
                                                                            <div id="div-comparar-ciudades" style={{ display:'none', marginTop : 10}}>
                                                                                
                                                                                    {/* ComboBox Comparar Ciudad */}
                                                                                    <div className="form-group">
                                                                                        <label htmlFor="selector-ciudad-comparar" className="col-md-12">Ciudad</label>
                                                                                        <div className="col-md-3">
                                                                                            <select className="form-control" id="selector-ciudad-comparar" name="selector-ciudad-comparar" defaultValue={''} >
                                                                                                <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                                            </select>
                                                                                            <br />
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Btn Agregar Colmena */}
                                                                                    <div className="form-group">
                                                                                        <label htmlFor="btn-agregar-ciudad" className="col-md-12"></label>
                                                                                        <div className="col-xs-12 col-md-12 col-lg-12">
                                                                                            <button id="btn-agregar-ciudad" type="button" className="btn btn-xs btn-flat btn-primary push-left" onClick={this.handleClickAgregarColmena}><i className="fa fa-plus" /> <strong>Agregar Ciudad &nbsp;</strong></button>
                                                                                        </div>       
                                                                                    </div>
                                                                                    {/* ./btn */}

                                                                                    {/* Tabla Colmenas Seleccionadas */}
                                                                                    <div className="form-group">
                                                                                        <div className="col-xs-6 col-md-6 col-lg-6" style={{marginTop:20}}>
                                                                                        <table id="tabla-ciudades" className="table table-bordered table-hover">
                                                                                            <thead>
                                                                                            <tr>
                                                                                                <th>Ciudad</th>
                                                                                            </tr>
                                                                                            </thead>
                                                                                            <tbody id="tbody-ciudades">
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    {/* ./table */}
                                                                                    
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <hr />
                                                                
                                                                

                                                                {/* DIV Tipo de Gráfico */}
                                                                <div className="row">
                                                                    <div className="col-xs-12 col-md-12 col-lg-12">
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
                                                                    </div>
                                                                </div>

                                                                <hr />

                                                                {/* BUTTON Aplicar los filtros  :)) */}
                                                                <div className="form-group">
                                                                    <center>
                                                                        <button type="button" className="btn btn-sm btn-flat btn-success" onClick={this.aplicarFiltros}><strong> <i className="fa fa-check" /> Aplicar </strong></button>
                                                                    </center>
                                                                </div>  
                                                            </div>

                                                    </div> 
                                                    {/* myDIV */}
                                                </div>
                                            </div>
                                        </div>
                                        

                                    </div>
                                    {/* ./box-body */}
                                </div>
                                {/* ./box */}
                            </div>
                            {/* ./col */}
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

