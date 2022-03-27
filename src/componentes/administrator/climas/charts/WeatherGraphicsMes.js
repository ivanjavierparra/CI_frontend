import React, { Component } from 'react'
import CanvasJSReact from '../../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var titulo_fecha_actual = "";
var titulo_fecha_pasada = "";

export default class WeatherGraphicsMes extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            ciudad : this.props.ciudad,
            variable : this.props.variable,
            tipoAccion : this.props.tipoAccion,
            ciudades : this.props.ciudades,
            titulo : this.props.titulo,
            tipo_grafico : this.props.tipo_grafico,
            datos : [], // almacenará los datos que vengan del servidor
            data : [], // almacenará todos los datasets
            variable_pasada : [],
            variable_actual : [],
            hayDatos : false,
            options : {
              zoomEnabled: true, 
              animationEnabled: true,
              axisX: {
                 // 
              },
              axisY : [
                {},
              ],
              data: [],
            },
        }

        // Methods
        this.convertirFecha = this.convertirFecha.bind(this);
        this.crearTitulo = this.crearTitulo.bind(this);
        
        this.setAxisY = this.setAxisY.bind(this);
        this.setAxisYTemperatura = this.setAxisYTemperatura.bind(this);
        
        this.setAxisYHumedad = this.setAxisYHumedad.bind(this);
        
        this.setAxisYVelocidadViento = this.setAxisYVelocidadViento.bind(this);
        
        this.setAxisYPresion = this.setAxisYPresion.bind(this);
        
        this.setAxisYHorasSol = this.setAxisYHorasSol.bind(this);
        this.handleClickOcultar = this.handleClickOcultar.bind(this);
        this.getTitulo = this.getTitulo.bind(this);
        this.setTooltip = this.setTooltip.bind(this);
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
            ciudad : nextProps.ciudad,
            variable : nextProps.variable,
            tipoAccion : nextProps.tipoAccion,
            ciudades : nextProps.ciudades,
            titulo : nextProps.titulo,
            tipo_grafico : nextProps.tipo_grafico,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    

    convertirFecha(fecha) {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ];  
      var arreglo = fecha.split("-");

      return monthNames[ parseInt(arreglo[1]) - 1 ]+"-"+arreglo[0];
    }


    crearTitulo(fecha_actual,fecha_pasada) {
        var tipoAccion = this.state.tipoAccion;
        if( tipoAccion['tipo'] == "hoy" ) return "Hoy";
        else if( tipoAccion['tipo'] == "7" ) return "7 días";
        else if( tipoAccion['tipo'] == "14" ) return "14 días";
        else if( tipoAccion['tipo'] == "30" ) return "30 días";
        else {
            const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
              "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"
            ];  
            var arreglo_1 = fecha_actual.split("-");
            var arreglo_2 = fecha_pasada.split("-");

            return arreglo_1[2]+monthNames[ parseInt(arreglo_1[1]) - 1 ]+arreglo_1[0] + "-" + arreglo_2[2]+monthNames[ parseInt(arreglo_2[1]) - 1 ]+arreglo_2[0];
        }
    }

    
    armarTitulo() {

      var variable = this.getNombreVariable();
      
      var fecha_pasada = this.convertirFecha(this.state.tipoAccion['fecha_pasada']);
      var fecha_actual = this.convertirFecha(this.state.tipoAccion['fecha_actual']);

      return "Comparación " + variable + " - " + this.state.ciudad + " - " + fecha_pasada + " / " + fecha_actual;

    }
  
    setAxisYTemperatura() {
        var axis_y = {
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
            snapToDataPoint: true
          },
        };

        return axis_y;
    }
    

    setAxisYHumedad() {
       var axis_y = {
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
              snapToDataPoint: true
            },
       };

       return axis_y;
    }

    
    setAxisYVelocidadViento() {
        var axis_y = {
          title:"Velocidad del Viento (km/hs)",
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          titleFontColor: "#4F81BC",
          lineThickness: 2,
          valueFormatString: "#'km/hs'",
          includeZero: true,
          titleFontSize: 12,
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          },
        };

        return axis_y;
    }
    
     


    setAxisYPresion() {
        var axis_y = {
          title:"Presión Atmosférica (hpa)",
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          titleFontColor: "#4F81BC",
          lineThickness: 2,
          valueFormatString: "#'hpa'",
          includeZero: true,
          titleFontSize: 12,
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          },
        };

        return axis_y;
    }



    setAxisYHorasSol() {
      var axis_y = {
        title:"Horas de Sol (hs)",
        lineColor: "#4F81BC",
        tickColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        titleFontColor: "#4F81BC",
        lineThickness: 2,
        valueFormatString: "#'hs'",
        includeZero: true,
        titleFontSize: 12,
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        },
      };

      return axis_y;
  }

  setAxisY() {
    if( this.state.variable == "temperatura" ) {
      return this.setAxisYTemperatura();
    }
    else if( this.state.variable == "humedad") {
        return this.setAxisYHumedad();
        
    }
    else if( this.state.variable == "velocidad_viento") {
        return this.setAxisYVelocidadViento();
    } 
    else if( this.state.variable == "presion") {
        return this.setAxisYPresion();
    }
    else if( this.state.variable == "horas_sol") {
        return this.setAxisYHorasSol();
    }
  }


  setTooltip() {
    
    if( this.state.variable == "temperatura" ) {
      return "{ciudad}<br>{horario}<br>Temp: {y}°C";
    }
    else if( this.state.variable == "humedad") {
        return "{ciudad}<br>{horario}<br>Hum: {y}%";
        
    }
    else if( this.state.variable == "velocidad_viento") {
      return "{ciudad}<br>{horario}<br>Vel.: {y} km/hs";
    } 
    else if( this.state.variable == "presion") {
        return "{ciudad}<br>{horario}<br>Presión.: {y} hpa";
    }
    else if( this.state.variable == "horas_sol") {
        return "{ciudad}<br>{horario}<br>Cant Hs.: {y}";
    }
  }

  getNombreVariable() {
    if( this.state.variable == "temperatura" ) {
      return "Temperatura";
    }
    else if( this.state.variable == "humedad") {
        return "Humedad";
        
    }
    else if( this.state.variable == "velocidad_viento") {
      return "Velocidad del viento";
    } 
    else if( this.state.variable == "presion") {
        return "Presión atmosférica";
    }
    else if( this.state.variable == "horas_sol") {
        return "Horas de sol";
    }
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

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/clima/ciudad/charts");
        var params = {
                        ciudad: this.state.ciudad, 
                        variable: this.state.variable,
                        tipoAccion: JSON.stringify(this.state.tipoAccion),
                        ciudades: JSON.stringify(this.state.ciudades),
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
              //var token = cookie.get("token");
              //if(token) cookie.remove("token");
              return;
            }
            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 

            // Oculto el Spinner
            document.getElementById("div-spinner-publicar").style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                    variable_pasada : data['variable_pasada'],
                    variable_actual : data['variable_actual'],
                    
                }, () => {
                        // Naranja fanta.                    
                }
            );

            // Fechas
            var fecha_pasada = this.convertirFecha(this.state.tipoAccion['fecha_pasada']);
            var fecha_actual = this.convertirFecha(this.state.tipoAccion['fecha_actual']);

            titulo_fecha_pasada = fecha_pasada;
            titulo_fecha_actual = fecha_actual;

            var banderaHayDatos = this.validarArreglos(data['variable_pasada'],data['variable_actual']);
            this.setState( { hayDatos: banderaHayDatos} );
            if( !banderaHayDatos ) {document.getElementById("txt-mensaje").style.display = "block"; return; }
            
            // Defino variables a usar.
            var datos = [];
            var dataset_cargados_actual = [];
            var dataset = [];
            
            /***  VARIABLE AÑO PASADO  ***/
            var arreglo = [];
            datos = data['variable_pasada'];
            // Recorro los datos.
            for( var i=0; i<datos.length; i++ ) { 
                if( datos[i][1] == null ) {
                    arreglo.push(  { x: new Date(datos[i][0]), y: null, horario: this.formatearFechaHora(datos[i][0]), ciudad: this.state.ciudad }  );
                } else {
                    arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), ciudad: this.state.ciudad }  );
                }
            }
            dataset = {
              type: this.state.tipo_grafico,
              bevelEnabled: true,
              color: "rgba(255,12,32,.5)",
              toolTipContent: this.setTooltip(),
              legendMarkerType: "circle",
              showInLegend: true, 
              name: "series1",
              legendText: this.getNombreVariable() + " " + this.state.ciudad + " " + fecha_pasada,
              axisXType: "secondary", 
              dataPoints: arreglo,
            };
            dataset_cargados_actual.push(dataset);



            /***  VARIABLE AÑO ACTUAL  ***/
            arreglo = [];
            datos = data['variable_actual'];
            // Recorro los datos.
            for( var i=0; i<datos.length; i++ ) { 
                if( datos[i][1] == null ) {
                    arreglo.push(  { x: new Date(datos[i][0]), y: null, horario: this.formatearFechaHora(datos[i][0]), ciudad: this.state.ciudad }  );
                } else {
                    arreglo.push(  { x: new Date(datos[i][0]), y: parseFloat(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), ciudad: this.state.ciudad }  );
                }
            }
            dataset = {
              type: this.state.tipo_grafico,
              bevelEnabled: true,
              color: "rgba(12,143,221,.2)",
              toolTipContent: this.setTooltip(),
              legendMarkerType: "circle",
              showInLegend: true, 
              name: "series1",
              legendText: this.getNombreVariable() + " " + this.state.ciudad + " " + fecha_actual,
              dataPoints: arreglo,
            };
            dataset_cargados_actual.push(dataset);
            



            /***  CIUDADES EXTRAS PASADO  ***/
            var extras = data['extras'];
            var colores_ciudades_extras_pasado = ["RGB(0, 0, 0,.5)","RGB(128, 128, 128,.5)","RGB(128, 0, 0,.5)","RGB(0, 255, 0,.5)","RGB(0, 128, 0,.5)"];
            for( var i = 0; i < extras.length; i++ ) { 
              var arreglo = [];
              datos = extras[i]['variable_pasada'];
              // Recorro los datos.
              for( var j=0; j<datos.length; j++ ) { 
                  if( datos[j][1] == null ) {
                      arreglo.push(  { x: new Date(datos[j][0]), y: null, horario: this.formatearFechaHora(datos[j][0]), ciudad: extras[i]['ciudad'] }  );
                  } else {
                      arreglo.push(  { x: new Date(datos[j][0]), y: parseFloat(datos[j][1]), horario: this.formatearFechaHora(datos[j][0]), ciudad: extras[i]['ciudad'] }  );
                  }
              }
              dataset = {
                type: this.state.tipo_grafico,
                bevelEnabled: true,
                color: colores_ciudades_extras_pasado[i],
                toolTipContent: this.setTooltip(),
                legendMarkerType: "circle",
                showInLegend: true, 
                name: "series1",
                legendText: this.getNombreVariable() + " " + extras[i]['ciudad'] + " " + fecha_pasada,
                axisXType: "secondary", 
                dataPoints: arreglo,
              };
              dataset_cargados_actual.push(dataset);
            }

            /* CIUDADES EXTRAS ACTUAL */
            var extras = data['extras'];
            var colores_ciudades_extras_actual = ["RGB(0, 255, 255,.9)", "RGB(128, 0, 128,.5)", "RGB(255, 0, 255,0.5)", "RGB(0, 0, 255,.5)", "rgb(255, 140, 0,.5)"];
            for( var i = 0; i < extras.length; i++ ) {

              arreglo = [];
              datos = extras[i]['variable_actual'];
              // Recorro los datos.
              for( var j=0; j<datos.length; j++ ) { 
                  if( datos[j][1] == null ) {
                      arreglo.push(  { x: new Date(datos[j][0]), y: null, horario: this.formatearFechaHora(datos[j][0]), ciudad: extras[i]['ciudad'] }  );
                  } else {
                      arreglo.push(  { x: new Date(datos[j][0]), y: parseFloat(datos[j][1]), horario: this.formatearFechaHora(datos[j][0]), ciudad: extras[i]['ciudad'] }  );
                  }
              }
              dataset = {
                type: this.state.tipo_grafico,
                bevelEnabled: true,
                color: colores_ciudades_extras_actual[i],
                toolTipContent: this.setTooltip(),
                legendMarkerType: "circle",
                showInLegend: true, 
                name: "series1",
                legendText: this.getNombreVariable() + " " + extras[i]['ciudad'] + " " + fecha_actual,
                dataPoints: arreglo,
              };
              dataset_cargados_actual.push(dataset);

            }



            this.setState({
              options: {
                data: dataset_cargados_actual,
                culture:  "es",
                zoomEnabled: true, 
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2",
                title:{
                  text: this.armarTitulo(),
                  fontSize: 15,
                },
                axisX: {
                  title: "Mes " + titulo_fecha_actual,
                  titleFontSize: 16,
                  gridThickness: 1,
                  valueFormatString: "DD-MMM-YY hh:mm tt",
                  titleFontWeight : "bold",
                  crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                  },
                },
                axisX2: {
                  title: "Mes " + titulo_fecha_pasada,
                  lineColor: "#369EAD",
                  titleFontSize: 16,
                  gridThickness: 1,
                  valueFormatString: "DD-MMM-YY hh:mm tt",
                  titleFontWeight : "bold",
                  crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                  },
                },
                axisY: [
                    this.setAxisY()
                ],
                legend: {
                  horizontalAlign: "center", // left, center ,right 
                  verticalAlign: "bottom",  // top, center, bottom
                  cursor: "pointer",
                  itemclick: function (e) {
                      //console.log("legend click: " + e.dataPointIndex);
                      //console.log(e);
                      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
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
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    validarArreglos(arreglo1, arreglo2) {
        if( arreglo1.length == 0 && arreglo2.length == 0 ) return false;
        return true;
    }
   
    handleClickOcultar(event) {
        var display = document.getElementById("box-body-weather").style.display;
        if( display == "none" ) {
          document.getElementById("box-body-weather").style.display = "block";
        }
        else {
          document.getElementById("box-body-weather").style.display = "none";
        }
    }

    getTitulo() {
      if( this.state.variable == "temperatura" ) return "Temperatura";
      if( this.state.variable == "humedad" ) return "Humedad";
      if( this.state.variable == "velocidad_viento" ) return "Velocidad del Viento";
      if( this.state.variable == "presion" ) return "Presión Atmosférica";
      if( this.state.variable == "horas_sol" ) return "Cantidad de Horas de Sol";
      
    }

    render() {
        
        

        return (
            
                <div className="col-md-12">
          
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title"> {this.getNombreVariable() + " en " + this.state.ciudad} </h3>
              <div className="box-tools pull-right">
                <button type="button" onClick={this.handleClickOcultar} className="btn btn-box-tool"><i className="fa fa-minus" /> </button>
                {/* <div className="btn-group">
                  <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-wrench"></i></button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                  </ul>
                </div> */}
                <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button>
              </div>
            </div>
            <div id="box-body-weather" className="box-body">
              <div className="chart">
                {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                    {/* SPINNER */}
                    <div id={'div-spinner-publicar'}>
                    <br />
                    <center> <i className="fa fa-spinner fa-pulse fa-2x fa-fw" /> </center>
                    <br />
                    </div>
                    <center><p id={"txt-mensaje"} style={{color:"red", fontWeight:"bold",display:"none"}}>No hay datos en las fechas seleccionadas.</p></center>
                    
                    {  this.state.hayDatos ? 
                    <CanvasJSChart options = {this.state.options} 
                        /* onRef={ref => this.chart = ref} */
                    /> : "" }

                    
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
