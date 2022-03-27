import React, { Component } from 'react'
import CanvasJSReact from '../../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class ChartColmenasMes extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();
           
        this.state = {
            variable : this.props.variable,
            colmenas : this.props.colmenas,
            tipoAccion : this.props.tipoAccion,
            titulo : this.props.titulo,
            rango : this.props.rango,
            tipo_grafico : this.props.tipo_grafico,
            data : [], // almacenará todos los datasets
            hayDatos : false,
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
            variable : nextProps.variable,
            colmenas : nextProps.colmenas,
            tipoAccion : nextProps.tipoAccion,
            rango: nextProps.rango,
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
        if( tipoAccion['tipo'] == "ayer" ) return "Ayer";
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

      return " Comparación de Colmenas " + " - " + variable + " - " + fecha_pasada + " / " + fecha_actual;

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
        document.getElementById("div-spinner-publicar").style.display = "block";
        document.getElementById("txt-mensaje").style.display = "none";

        var url = new URL("http://localhost:8000/api/revisacion/tyh/comparacion/colmenas");
        var params = {
                        variable: this.state.variable,
                        colmenas: JSON.stringify(this.state.colmenas), 
                        tipoAccion: JSON.stringify(this.state.tipoAccion),
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
            console.log(JSON.stringify(data)); 

            // Oculto el Spinner
            document.getElementById("div-spinner-publicar").style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                    data : data,
                    
                }, () => {
                        // Naranja fanta.                    
                }
            );

            

            var bandera = this.validarArreglos(data);
            this.setState( { hayDatos: bandera} );
            if ( !bandera ) {document.getElementById("txt-mensaje").style.display = "block"; return; }

            

            var fecha_pasada = this.convertirFecha(this.state.tipoAccion['fecha_pasada']);
            var fecha_actual = this.convertirFecha(this.state.tipoAccion['fecha_actual']);

            var colores_temperatura = ["rgb(255, 0, 0,.5)","rgb(210, 105, 30, .5)","rgb(222, 184, 135, .5)","rgb(255, 127, 80,.5)","rgb(255, 99, 71,.5)"];
            var colores_humedad = ["rgb(0, 0, 255,.5)","rgb(100, 149, 237,.5)","rgb(0, 0, 139,.5)","rgb(0, 206, 209,.5)","rgb(30, 144, 255,.5)"];
            var dataset_cargados = [];
            if( this.state.variable == "temperatura" ) { //temperatura....
             
              // Recorro los datos para obtener las temperaturas
              for( var i=0; i<data['pasado'].length; i++ ) {

                var arreglo = [];
                var temperaturas = data['pasado'][i]['temperatura'];
                for( var j=0; j<temperaturas.length; j++ ) { 
                  if( temperaturas[j][1] == null ) continue; //// arreglo.push(  { label: temperaturas[i][0], y: null }  );
                  else {
                    if( temperaturas[j][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( temperaturas[j][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Correcto" }  );
                    }
                  }
                }

                var dataset = {
                  type: this.state.tipo_grafico,
                  bevelEnabled: true,
                  color: colores_temperatura[i],
                  toolTipContent: "Colmena: {colmena}<br>Apiario: {apiario}<br>{horario}<br>Temperatura: {y}°C<br>Estado: {estado}",
                  legendMarkerType: "circle",
                  showInLegend: true, 
                  name: "series2",
                  legendText: "Colmena N° " + data['pasado'][i]['colmena']['identificacion'] + " - " + data['pasado'][i]['apiario']['direccion_chacra'] + " [" + fecha_pasada + "]",
                  axisXType: "secondary", 
                  dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);

              }


              // Recorro los datos para obtener las temperaturas
              for( var i=0; i<data['actual'].length; i++ ) {

                var arreglo = [];
                var temperaturas = data['actual'][i]['temperatura'];
                for( var j=0; j<temperaturas.length; j++ ) { 
                  if( temperaturas[j][1] == null ) continue; //// arreglo.push(  { label: temperaturas[i][0], y: null }  );
                  else {
                    if( temperaturas[j][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( temperaturas[j][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(temperaturas[j][0]), y: parseFloat(temperaturas[j][1]), horario: this.formatearFechaHora(temperaturas[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Correcto" }  );
                    }
                  }
                }

                var dataset = {
                  type: this.state.tipo_grafico,
                  bevelEnabled: true,
                  color: colores_temperatura[i],
                  toolTipContent: "Colmena: {colmena}<br>Apiario: {apiario}<br>{horario}<br>Temperatura: {y}°C<br>Estado: {estado}",
                  legendMarkerType: "circle",
                  showInLegend: true, 
                  name: "series2",
                  legendText: "Colmena N° " + data['actual'][i]['colmena']['identificacion'] + " - " + data['actual'][i]['apiario']['direccion_chacra'] + " [" + fecha_actual + "]",
                  dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);

              }
                

            }
            else { // humedad....

              // Recorro los datos para obtener las humedades
              for( var i=0; i<data['pasado'].length; i++ ) {

                var arreglo = [];
                var humedades = data['pasado'][i]['humedad'];
                for( var j=0; j<humedades.length; j++ ) { 
                  if( humedades[j][1] == null ) continue; //// arreglo.push(  { label: humedades[i][0], y: null }  );
                  else {
                    if( humedades[j][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( humedades[j][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['pasado'][i]['colmena']['identificacion'], apiario: data['pasado'][i]['apiario']['direccion_chacra'], estado: "Correcto" }  );
                    }
                  }
                }

                var dataset = {
                   type: this.state.tipo_grafico,
                   bevelEnabled: true,
                   axisYType: "secondary",
                   color: colores_humedad[i],
                   legendMarkerType: "circle",
                   toolTipContent: "Colmena: {colmena}<br>Apiario: {apiario}<br>{horario}<br>Humedad: {y}%<br>Estado: {estado}",
                   showInLegend: true, 
                   name: "series4",
                   legendText: "Colmena N° " + data['pasado'][i]['colmena']['identificacion'] + " - " + data['pasado'][i]['apiario']['direccion_chacra'] + " [" + fecha_pasada + "]",
                   axisXType: "secondary", 
                   dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);
              }              

              // Recorro los datos para obtener las humedades
              for( var i=0; i<data['actual'].length; i++ ) {

                var arreglo = [];
                var humedades = data['actual'][i]['humedad'];
                for( var j=0; j<humedades.length; j++ ) { 
                  if( humedades[j][1] == null ) continue; //// arreglo.push(  { label: humedades[i][0], y: null }  );
                  else {
                    if( humedades[j][2] == "amarillo" ) {
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Alerta", markerColor: "orange", markerType: "cross" }   );
                    }
                    else if( humedades[j][2] == "rojo" ) { 
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Peligro", markerColor: "red", markerType: "cross" }   );
                    }
                    else {
                      arreglo.push(  { x: new Date(humedades[j][0]), y: parseFloat(humedades[j][1]), horario: this.formatearFechaHora(humedades[j][0]), colmena: data['actual'][i]['colmena']['identificacion'], apiario: data['actual'][i]['apiario']['direccion_chacra'], estado: "Correcto" }  );
                    }
                  }
                }

                var dataset = {
                   type: this.state.tipo_grafico,
                   bevelEnabled: true,
                   axisYType: "secondary",
                   color: colores_humedad[i],
                   legendMarkerType: "circle",
                   toolTipContent: "Colmena: {colmena}<br>Apiario: {apiario}<br>{horario}<br>Humedad: {y}%<br>Estado: {estado}",
                   showInLegend: true, 
                   name: "series4",
                   legendText: "Colmena N° " + data['actual'][i]['colmena']['identificacion'] + " - " + data['actual'][i]['apiario']['direccion_chacra'] + " [" + fecha_actual + "]",
                   dataPoints: arreglo,
                };

                dataset_cargados.push(dataset);
              }              

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
                //dataPointMaxWidth: 50,
                title:{
                  text: this.armarTitulo(),
                  fontSize: 15,
                },
                axisX: [{
                  title: "Mes " + fecha_actual ,
                  lineColor: "#369EAD",
                  titleFontSize: 16,
                  titleFontWeight : "bold",
                  gridThickness: 3,
                  valueFormatString: "DD-MMM-YY hh:mm tt",
                  crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                  }
                }],
                axisX2: {
                  title: "Mes " + fecha_pasada ,
                  lineColor: "#369EAD",
                  titleFontSize: 16,
                  titleFontWeight : "bold",
                  gridThickness: 3,
                  valueFormatString: "DD-MMM-YY hh:mm tt",
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
                      snapToDataPoint: true
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
                    snapToDataPoint: true
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
            

            

            
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }

    /**
     * Minimiza o Maximiza el div del gráfico.
     * @param {*} event 
     */
    handleClickMinus(event) {
      var display = document.getElementById("box-body-colmena").style.display;
      if( display == "none" ) {
        document.getElementById("box-body-colmena").style.display = "block";
      }
      else {
        document.getElementById("box-body-colmena").style.display = "none";
      }
    }


    /**
     * Retorna true si entre las colmenas hay alguna que tiene datos de temperatura o humedad,
     * false sino.
     * @param {*} datos 
     */
    validarArreglos(datos) {
      var cantidad_de_colmenas = datos.length;
      var contador = 0;
      if ( this.state.variable == "temperatura" ) {
          for( var i=0; i<datos.length; i++ ) {
              if( datos[i]['temperatura'].length == 0 ) contador++;
          }
      }
      else {
        for( var i=0; i<datos.length; i++ ) {
          if( datos[i]['humedad'].length == 0 ) contador++;
        }
      }

      if( contador == cantidad_de_colmenas ) return false;
      return true;

    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }
   

    render() {
        
        

        return (
            
                <div className="col-md-12">
          
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title" style={{fontWeight:"bold"}}><i className="fa fa-forumbee" /> Comparación de Colmenas </h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" onClick={this.handleClickMinus}><i className="fa fa-minus" />
                </button>
                <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button>
              </div>
            </div>
            <div id={"box-body-colmena"} className="box-body">
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
