import React, { Component } from 'react'
import CanvasJSReact from './../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class GraficoSenial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            variable : this.props.variable,
            tipoAccion : this.props.tipoAccion,
            titulo : this.props.titulo,
            variable_ambiental : this.props.variable_ambiental,
            rango : this.props.rango,
            tipo_grafico : this.props.tipo_grafico,
            dataset_senial : [],
            data : [], // almacenará todos los datasets
            options : {
              zoomEnabled: true, 
              animationEnabled: true,
              axisX: {
                 // 
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
        this.convertirSenial = this.convertirSenial.bind(this);

        this.getNombreVariable = this.getNombreVariable.bind(this);
        this.formatearFechaHora = this.formatearFechaHora.bind(this);
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
      if( tipoAccion['tipo'] == "hoy" ) return "Hoy";
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
      else if( tipoAccion['tipo'] == "14" ){
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

          return arreglo_1[2]+monthNames[ parseInt(arreglo_1[1]) - 1 ]+arreglo_1[0] + "-" + arreglo_2[2]+monthNames[ parseInt(arreglo_2[1]) - 1 ]+arreglo_2[0];
      }
    }


    convertirSenial(numero) {
        console.log("convertir señal", numero);
        if( numero == 1 ) return "Activo";
        return "Inactivo";
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
        var url = new URL("http://localhost:8000/api/revisacion/senal/fechas");
        var params = {
                        apiario: this.state.apiario, 
                        colmena: this.state.colmena['id'], 
                        tipoAccion: JSON.stringify(this.state.tipoAccion),
                    };
        
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url, {
            method: 'GET', 
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + cookie.get("token"),
            }
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
            console.log(JSON.stringify(data)); 

            // Oculto el Spinner
            document.getElementById("div-spinner-publicar-"+this.state.colmena['id']).style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                    dataset_senial : data['senial'],
                }, () => {
                        // Naranja fanta.                    
                }
            );

            // Fechas
            //var fecha_pasada = this.convertirFecha(this.state.tipoAccion['fecha_pasada']);
            //var fecha_actual = this.convertirFecha(this.state.tipoAccion['fecha_actual']);
            var subtitulo = this.crearTitulo(this.state.tipoAccion['fecha_actual'], this.state.tipoAccion['fecha_pasada']);
            
            // Defino variables a usar.
            var datos = data['senial'];
            var dataset_cargados = [];

             
            
            var arreglo = [];
            // recorro las temperaturas
            for( var i=0; i<datos.length; i++ ) {
              
              arreglo.push(  { x: new Date(datos[i][0]), y: parseInt(datos[i][1]), horario: this.formatearFechaHora(datos[i][0]), colmena: this.state.colmena['identificacion'] } );
              
            }



            var dataset = {
              //type: "line",
              type: this.state.tipo_grafico,
              bevelEnabled: true,
              color: "orange",
              //toolTipContent: "{fecha}<br>{label}hs.<br>Temp: {y}°C",
              toolTipContent: "Colmena: {colmena}<br>{horario}<br>Señal: {y} mensajes",
              legendMarkerType: "circle",
              showInLegend: true, 
              name: "Señal",
              legendText: "Estado de Señal en Colmena " + this.state.colmena['identificacion'] +  " [" + subtitulo + "]",
              dataPoints: arreglo,
            };

            dataset_cargados.push(dataset);
        

            

            this.setState({
              options: {
                data: dataset_cargados,
                culture:  "es",
                zoomEnabled: true, 
                animationEnabled: true,
                exportEnabled: true,
                interactivityEnabled: true,
                theme: "light2",
                //dataPointMaxWidth: 50,
                axisX: {
                  // valueFormatString: "DD MMM YYYY"
                  title: "Rango de Fechas [" + subtitulo + "]",
                  //titleFontFamily: "comic sans ms",
                  titleFontSize: 16,
                  titleFontWeight : "bold",
                  gridThickness: 1,
                  valueFormatString: "DD-MMM-YY hh:mm",
                },
                axisY: [
                    {
                    title: "Señal (cant. mjes. recibidos)",
                    //lineColor: "#C0504E",
                    //tickColor: "#C0504E",
                    //labelFontColor: "#C0504E",
                    //titleFontColor: "#C0504E",
                    lineThickness: 2,
                    //valueFormatString: "#C°",
                    includeZero: true,
                    titleFontSize: 12,
                    //minimum: 0,
                    //maximum: 1,
                    //viewportMinimum: 0,
                    //viewportMaximum: 50,
                    // interval: 1,
                  },
                ],
                
                legend: {
                  horizontalAlign: "right", // left, center ,right 
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
            console.log("Ha ocurrido un error", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }

   

    render() {
        
        

        return (
            
                <div className="col-md-6">
          
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title"><i className="fa fa-forumbee" /> Colmena N° {this.state.colmena['identificacion']}</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /> </button>
                <div className="btn-group">
                  <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-wrench"></i></button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                  </ul>
                </div>
                <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button>
              </div>
            </div>
            <div className="box-body">
              <div className="chart">
                {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                    {/* SPINNER */}
                    <div id={'div-spinner-publicar-' + this.state.colmena['id']}>
                    <br />
                    <center> <i className="fa fa-spinner fa-pulse fa-3x fa-fw" /> </center>
                    </div>
                    
                
                    <CanvasJSChart options = {this.state.options} 
                        /* onRef={ref => this.chart = ref} */
                    />




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
