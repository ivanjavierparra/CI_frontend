import React, { Component } from 'react'
import CanvasJSReact from '../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class ChartBarMultiple extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            variable : this.props.variable,
            tipoAccion : this.props.tipoAccion,
            titulo : this.props.titulo,
            variable_ambiental : this.props.variable_ambiental,
            rango : this.props.rango,
            tipo_grafico : this.props.tipo_grafico,
            columns: this.props.columns,
            temperatura_actual : [],
            humedad_actual : [],
            clima_temperatura_actual : [],
            clima_humedad_actual : [],
            hayDatos : false,
            data : [], // almacenará todos los datasets
            options : {
              zoomEnabled: true, 
              animationEnabled: true,
              //title:{
                //  text: "Monthly Sales - 2017"
              //},
              axisX: {
                 // valueFormatString: "DD MMM YYYY"
              },
              axisY: {
                  title: "Temperatura",
                  prefix: "C°",
                  includeZero: true
              },
              data: [],
            }
        }

        // Methods
        this.convertirFecha = this.convertirFecha.bind(this);
        this.crearTitulo = this.crearTitulo.bind(this);
        this.handleClickMinus = this.handleClickMinus.bind(this);
        this.validarArreglos = this.validarArreglos.bind(this);

        this.getNombreVariable = this.getNombreVariable.bind(this);
        this.formatearFechaHora = this.formatearFechaHora.bind(this);

        this.armarTitulo = this.armarTitulo.bind(this);
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            colmena : nextProps.colmena,
            variable : nextProps.variable,
            tipoAccion : nextProps.tipoAccion,
            variable_ambiental : nextProps.variable_ambiental,
            rango: nextProps.rango,
            titulo : nextProps.titulo,
            tipo_grafico : nextProps.tipo_grafico,
            columns: nextProps.columns,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    

    convertirFecha(fecha) {
      var tipoAccion = this.state.tipoAccion;
      if( tipoAccion['tipo'] == "hoy" ) return "Hoy";
      else if( tipoAccion['tipo'] == "7" ) return "7 días";
      else if( tipoAccion['tipo'] == "14" ) return "14 días";
      else if( tipoAccion['tipo'] == "30" ) return "30 días";
      else {
          const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"
          ];  
          var arreglo = fecha.split("-");

          return arreglo[2]+monthNames[ parseInt(arreglo[1]) - 1 ]+arreglo[0];
      }
    }


    crearTitulo(fecha_actual,fecha_pasada) {
        var tipoAccion = this.state.tipoAccion;
        if( tipoAccion['tipo'] == "hoy" ) {
          var date_actual = new Date();
          date_actual = date_actual.toISOString().split('T')[0];
          date_actual = date_actual.split("-")[2] + "-" + date_actual.split("-")[1] + "-" + date_actual.split("-")[0];
          return date_actual;
          //return "Hoy";
        }
        if( tipoAccion['tipo'] == "ayer" ) {
          var date_actual = new Date();
          date_actual = date_actual.toISOString().split('T')[0];
          date_actual = date_actual.split("-")[2] + "-" + date_actual.split("-")[1] + "-" + date_actual.split("-")[0];

          var date_pasado = new Date();
          date_pasado.setDate(date_pasado.getDate() - 1); // Resto
          date_pasado = date_pasado.toISOString().split('T')[0];
          date_pasado = date_pasado.split("-")[2] + "-" + date_pasado.split("-")[1] + "-" + date_pasado.split("-")[0];

          var resultado = date_pasado + " al " + date_actual; 
          return resultado;
          //return "Ayer";
        }
        else if( tipoAccion['tipo'] == "7" ) {
          var date_actual = new Date();
          date_actual = date_actual.toISOString().split('T')[0];
          date_actual = date_actual.split("-")[2] + "-" + date_actual.split("-")[1] + "-" + date_actual.split("-")[0];

          var date_pasado = new Date();
          date_pasado.setDate(date_pasado.getDate() - 6); // Resto
          date_pasado = date_pasado.toISOString().split('T')[0];
          date_pasado = date_pasado.split("-")[2] + "-" + date_pasado.split("-")[1] + "-" + date_pasado.split("-")[0];

          var resultado = date_pasado + " al " + date_actual; 
          return resultado;
          //return "7 días";
        }
        else if( tipoAccion['tipo'] == "14" ) {
          var date_actual = new Date();
          date_actual = date_actual.toISOString().split('T')[0];
          date_actual = date_actual.split("-")[2] + "-" + date_actual.split("-")[1] + "-" + date_actual.split("-")[0];

          var date_pasado = new Date();
          date_pasado.setDate(date_pasado.getDate() - 13); // Resto
          date_pasado = date_pasado.toISOString().split('T')[0];
          date_pasado = date_pasado.split("-")[2] + "-" + date_pasado.split("-")[1] + "-" + date_pasado.split("-")[0];

          var resultado = date_pasado + " al " + date_actual; 
          return resultado;
          //return "14 días";
        }
        else if( tipoAccion['tipo'] == "30" ) {
          var date_actual = new Date();
          date_actual = date_actual.toISOString().split('T')[0];
          date_actual = date_actual.split("-")[2] + "-" + date_actual.split("-")[1] + "-" + date_actual.split("-")[0];

          var date_pasado = new Date();
          date_pasado.setDate(date_pasado.getDate() - 29); // Resto
          date_pasado = date_pasado.toISOString().split('T')[0];
          date_pasado = date_pasado.split("-")[2] + "-" + date_pasado.split("-")[1] + "-" + date_pasado.split("-")[0];

          var resultado = date_pasado + " al " + date_actual; 
          return resultado;
          //return "30 días";
        }
        else {
            const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
              "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"
            ];  
            var arreglo_1 = fecha_actual.split("-");
            var arreglo_2 = fecha_pasada.split("-");

            return arreglo_1[2]+monthNames[ parseInt(arreglo_1[1]) - 1 ]+arreglo_1[0] + " al " + arreglo_2[2]+monthNames[ parseInt(arreglo_2[1]) - 1 ]+arreglo_2[0];
        }
    }

    armarTitulo() {

      var variable = this.getNombreVariable();
      var colmena = this.state.colmena['identificacion'];
      var fechas = this.crearTitulo(this.state.tipoAccion['fecha_actual'],this.state.tipoAccion['fecha_pasada']);

      return variable + " - Colmena " + colmena +  " - " + fechas;

    }

    getNombreVariable() {
      if( this.state.variable == "temperatura" ) return "Temperatura";
      else if( this.state.variable == "humedad") return "Humedad";
      else return "Temperatura y Humedad";
    }
  
  
    formatearFechaHora(fecha_hora) {
      var fecha = fecha_hora.split(" ")[0];
      var hora = fecha_hora.split(" ")[1];
  
      fecha = fecha.split("-")[2] + "-" + fecha.split("-")[1] + "-" + fecha.split("-")[0];
      hora= hora.substr(0,5);
  
      var resultado = fecha + " " + hora;
      return resultado;
    }

    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

        this._isMounted = true;

        // Muestro el spinner y oculto el mensaje
        document.getElementById("div-spinner-publicar-" + this.state.colmena['id']).style.display = "block";
        document.getElementById("txt-mensaje-" + this.state.colmena['id']).style.display = "none";

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/revisacion/tyh/colmena");
        var params = {
                        apiario: this.state.apiario['id_apiario'], 
                        colmena: this.state.colmena['id'], 
                        variable: this.state.variable,
                        tipoAccion: JSON.stringify(this.state.tipoAccion),
                        variable_ambiental: this.state.variable_ambiental,
                        rango: 0,
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
              this.abortController.abort();
              return;
            }
            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(data); 
            // console.log(JSON.stringify(data)); 

            // Oculto el Spinner
            document.getElementById("div-spinner-publicar-"+this.state.colmena['id']).style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                    temperatura_actual : data['temperatura_colmena'],
                    humedad_actual : data['humedad_colmena'],
                    clima_temperatura_actual : data['clima_temperatura'],
                    clima_humedad_actual : data['clima_humedad'],
                    
                }, () => {
                        // Naranja fanta.                    
                }
            );

            var bandera = this.validarArreglos(data['temperatura_colmena'],data['humedad_colmena']);
            this.setState( { hayDatos: bandera} );
            if ( !bandera ) {document.getElementById("txt-mensaje-" + this.state.colmena['id']).style.display = "block"; return; }

            // Fechas
            var subtitulo = this.crearTitulo(this.state.tipoAccion['fecha_actual'],this.state.tipoAccion['fecha_pasada'])
            
            // Defino variables a usar.
            var datos = [];
            var dataset_cargados = [];

             
            /***  TEMPERATURA RANGO FECHAS ***/
            datos = data['temperatura_colmena'];
            // if( datos.length > 0 ) {
            if( this.state.variable == "temperatura" || this.state.variable == "temperatura_y_humedad" ) {
                var arreglo = [];
                // recorro las temperaturas
                for( var i=0; i<datos.length; i++ ) {
                  if( datos[i][1] == null ) {
                    // arreglo.push(  { label: datos[i][0], y: null }  );
                  }
                  else {
                    if( datos[i][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( datos[i][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Correcto"  }  );
                    }
                    // arreglo.push(  { label: datos[i][0], y: parseFloat(datos[i][1]) }  );
                  }
                }

                var dataset = {
                  //type: "line",
                  type: this.state.tipo_grafico,
                  bevelEnabled: true,
                  color: "rgba(255,12,32,.5)",
                  //toolTipContent: "{fecha}<br>{label}hs.<br>Temp: {y}°C",
                  toolTipContent: "Colmena: {colmena}<br>{horario}<br>Temperatura: {y}°C<br>Estado: {estado}",
                  legendMarkerType: "circle",
                  showInLegend: true, 
                  name: "series2",
                  //legendText: "Temperatura Colmena " + this.state.colmena['identificacion'] + " [" + subtitulo + "]",
                  legendText: "Temperatura Colmena " + this.state.colmena['identificacion'],
                  dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);
            }
            


             /***  HUMEDAD RANGO FECHAS  ***/
             datos = data['humedad_colmena'];
             //if( datos.length > 0 ) {
             if( this.state.variable == "humedad" || this.state.variable == "temperatura_y_humedad" ) {
                 var arreglo = [];
                 // recorro las temperaturas
                 for( var i=0; i<datos.length; i++ ) {
                   if( datos[i][1] == null ) {
                     //arreglo.push(  { label: datos[i][0], y: null }  );
                   }
                   else {
                     // arreglo.push(  { label: datos[i][0], y: parseFloat(datos[i][1]) }  );
                     if( datos[i][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( datos[i][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'], estado: "Correcto" }  );
                    }
                   }
                 }
 
                 var dataset = {
                   //type: "line",
                   type: this.state.tipo_grafico,
                   bevelEnabled: true,
                   axisYType: "secondary",
                   color: "rgb(0, 0, 139,.5)",
                   legendMarkerType: "circle",
                   //axisYIndex: 1,
                   //toolTipContent: "{fecha}<br>{label}hs.<br>Hum: {y}%",
                   toolTipContent: "Colmena: {colmena}<br>{horario}<br>Humedad: {y}%<br>Estado: {estado}",
                   //indexLabel: "{y}'%'",
                   //indexLabelPlacement: "outside",  
                   //indexLabelOrientation: "horizontal",

                   showInLegend: true, 
                   name: "series4",
                   //legendText: "Humedad Colmena " + this.state.colmena['identificacion'] + " [" + subtitulo + "]",
                   legendText: "Humedad Colmena " + this.state.colmena['identificacion'],
                   dataPoints: arreglo,
                 };
 
                 dataset_cargados.push(dataset);
             }

             /***  CLIMA TEMPERATURA RANGO FECHAS  ***/
            datos = data['clima_temperatura'];
            //if( datos.length > 0 ) {
            if( this.state.variable_ambiental == "temperatura" || this.state.variable_ambiental == "temperatura_y_humedad") {
                var arreglo = [];
                // recorro las temperaturas
                for( var i=0; i<datos.length; i++ ) {
                  if( datos[i][1] == null ) {
                    //arreglo.push(  { label: datos[i][0], y: null }  );
                  }
                  else {
                    //arreglo.push(  {   label: datos[i][0], y: parseFloat(datos[i][1]), fecha: fecha_actual }  );
                    arreglo.push(  {   x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), Tambiental: "Temperatura Ambiental" } );
                  }
                }

                var dataset = {
                  //type: "column",
                  type: this.state.tipo_grafico,
                  bevelEnabled: true,
                  color: "rgb(233, 150, 122, .5)",
                  //toolTipContent: "{fecha}<br>{label}hs.<br>Temp: {y}°C",
                  toolTipContent: "{Tambiental}<br>{horario}<br>Temperatura: {y}°C",
                  legendMarkerType: "circle",
                  showInLegend: true, 
                  name: "series2",
                  //legendText: "Temperatura Ambiental [" + subtitulo + "]",
                  legendText: "Temperatura Ambiental " + this.state.apiario['localidad_chacra'],
                  dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);
            }
          

            /***  CLIMA HUMEDAD RANGO FECHAS  ***/
            datos = data['clima_humedad'];
            //if( datos.length > 0 ) {
             if( this.state.variable_ambiental == "humedad" || this.state.variable_ambiental == "temperatura_y_humedad") {
                var arreglo = [];
                // recorro las temperaturas
                for( var i=0; i<datos.length; i++ ) {
                  if( datos[i][1] == null ) {
                    //arreglo.push(  { label: datos[i][0], y: null }  );
                  }
                  else {
                    //arreglo.push(  { label: datos[i][0], y: parseFloat(datos[i][1]), fecha: fecha_pasada }  );
                    arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), Hambiental: "Humedad Ambiental" }  );
                  }
                }

                var dataset = {
                  //type: "column",
                  type: this.state.tipo_grafico,
                  bevelEnabled: true, // esto hace que la barra quede con ese estilo particular 
                  axisYType: "secondary", // eje y de humedad
                  color: "rgb(100, 149, 237, .5)",
                  legendMarkerType: "circle",
                  //axisYIndex: 1,
                  //toolTipContent: "{fecha}<br>{label}hs.<br>Hum: {y}%",
                  toolTipContent: "{Hambiental}<br>{horario}<br>Humedad: {y}%",
                  showInLegend: true, 
                  name: "series3",
                  //legendText: "Humedad Ambiental [" + subtitulo + "]",
                  legendText: "Humedad Ambiental " + this.state.apiario['localidad_chacra'],
                  dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);
            }


            

            this.setState({
              options: {
                data: dataset_cargados,
                culture:  "es",
                zoomEnabled: true,
                zoomType: "xy",
                exportEnabled: true, 
                animationEnabled: true,
                theme: "light2",
                title:{
                  text: this.armarTitulo(),
                  fontSize: 15,
                },
                axisX: {
                  title: "Horario",
                  titleFontSize: 16,
                  gridThickness: 1,
                  valueFormatString: "DD-MMM-YY hh:mm tt",
                  titleFontWeight : "bold",
                  crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                  }
                },
                axisY: [
                    {
                    title: "Temperatura(°C)",
                    lineColor: "#C0504E",
                    tickColor: "#C0504E",
                    labelFontColor: "#C0504E",
                    titleFontColor: "#C0504E",
                    lineThickness: 2,
                    valueFormatString: "#C°",
                    includeZero: true,
                    titleFontSize: 12,
                    crosshair: {
                      enabled: true,
                      snapToDataPoint: true,
                    }
                  },
                ],
                axisY2: {
                  title:"Humedad(%)",
                  lineColor: "#4F81BC",
                  tickColor: "#4F81BC",
                  labelFontColor: "#4F81BC",
                  titleFontColor: "#4F81BC",
                  lineThickness: 2,
                  valueFormatString: "#'%'",
                  includeZero: true,
                  titleFontSize: 12,
                  crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                  }
                },
                legend: {
                  horizontalAlign: "center", // left, center ,right 
                  verticalAlign: "bottom",  // top, center, bottom
                  cursor: "pointer",
                  itemclick: function (e) {
                      //console.log("legend click: " + e.dataPointIndex);
                      //console.log(e);
                      if (typeof (e.dataSeries.visible) == "undefined" || e.dataSeries.visible) {
                          e.dataSeries.visible = false;
                      } else {
                          e.dataSeries.visible = true;
                      }

                      e.chart.render();
                  }
                },
              },
            });
            

            // Luego meto todo dentro de data

            
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }


    handleClickMinus(event) {
      var display = document.getElementById("box-body-colmena-" + this.state.colmena['id']).style.display;
      if( display == "none" ) {
        document.getElementById("box-body-colmena-" + this.state.colmena['id']).style.display = "block";
      }
      else {
        document.getElementById("box-body-colmena-" + this.state.colmena['id']).style.display = "none";
      }
    }


    validarArreglos(t, h) {
      if( this.state.variable == "temperatura") { 
        if( t.length == 0 ) return false;
      }
      if( this.state.variable == "humedad") { 
        if( h.length == 0  ) return false;
      }
      if( this.state.variable == "temperatura_y_humedad") {
        if( t.length == 0 && h.length == 0 ) return false;
      }
      return true;
    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }
   

    render() {
        
        

        return (
            
                // <div className={"col-md-" + this.state.columns}>
                <div className={"col-md-12"}>
          
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title" style={{fontWeight:"bold"}}><i className="fa fa-forumbee" /> Colmena N° {this.state.colmena['identificacion']}</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" onClick={this.handleClickMinus}><i className="fa fa-minus" />
                </button>
                <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button>
              </div>
            </div>
            <div id={"box-body-colmena-" + this.state.colmena['id']} className="box-body">
              <div className="chart">
                {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                    {/* SPINNER */}
                    <div id={'div-spinner-publicar-' + this.state.colmena['id']}>
                    <br />
                    <center> <i className="fa fa-spinner fa-pulse fa-2x fa-fw" /> </center>
                    <br />
                    </div>
                    <center><p id={"txt-mensaje-" + this.state.colmena['id']} style={{color:"red", fontWeight:"bold",display:"none"}}>No hay datos en las fechas seleccionadas.</p></center>

                    {  this.state.hayDatos ? 
                    <CanvasJSChart options = {this.state.options} 
                        /* onRef={ref => this.chart = ref} */
                    />
                    :
                    ""
                  }




              </div>
            </div>
            {/* /.box-body */}
          </div>
          {/* /.box */}

           {/* /.col (LEFT) */}
        </div>
       




                
                
           
        );
    }
}
