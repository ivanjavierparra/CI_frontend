import React, { Component } from 'react'
import CanvasJSReact from '../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class ChartSignal extends Component {
    

    constructor(props) {
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            estado : this.props.estado['estado'], // Puede ser: "verde", "amarillo" o "rojo".
            datos_ciudades: [],
            data : [], // almacenará todos los datasets
            existenDatos: false,
            options : {
              zoomEnabled: true, 
              animationEnabled: true,
              data: [],
            }
        }

        // Methods
        this.verificar_existencia_colmenas_en_estado = this.verificar_existencia_colmenas_en_estado.bind(this);
        this.tituloBox = this.tituloBox.bind(this);
        this.subtituloBoxBody = this.subtituloBoxBody.bind(this);
  
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            estado : nextProps.estado['estado'],
        }, //() => this.componentDidMount() 
        ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    
    tituloBox() {
        var color = this.state.estado;
        // if ( color == "verde" ) document.getElementById("txt-titulo").innerText = "Colmenas en buen estado por Ciudades";
        // if ( color == "amarillo" ) document.getElementById("txt-titulo").innerText = "Colmenas en alerta por Ciudades";
        // if ( color == "rojo" ) document.getElementById("txt-titulo").innerText = "Colmenas en peligro por Ciudades";

        if ( color == "verde" ) return "Colmenas en buen estado por Ciudades";
        if ( color == "amarillo" ) return "Colmenas en alerta por Ciudades";
        if ( color == "rojo" ) return "Colmenas en peligro por Ciudades";
    }

    subtituloBoxBody() {
      var color = this.state.estado;
      // if ( color == "verde" ) document.getElementById("txt-titulo").innerText = "Colmenas en buen estado por Ciudades";
      // if ( color == "amarillo" ) document.getElementById("txt-titulo").innerText = "Colmenas en alerta por Ciudades";
      // if ( color == "rojo" ) document.getElementById("txt-titulo").innerText = "Colmenas en peligro por Ciudades";

      if ( color == "verde" ) return "No existen colmenas en buen estado en todos tus apiarios.";
      if ( color == "amarillo" ) return "No existen colmenas en alerta en todos tus apiarios.";
      if ( color == "rojo" ) return "No existen colmenas en peligro en todos tus apiarios.";
  }
    


  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }

    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

        this._isMounted = true;

        var url = new URL("http://localhost:8000/api/colmena/ciudad/alertas");
        var params = {
                        estado: this.state.estado, 
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
            console.log(data); 

            // Oculto el Spinner
            document.getElementById("div-spinner-chart-ciudades").style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                  datos_ciudades : data,
                }, () => {
                        // Naranja fanta.                    
                }
            );


            console.log("Color", this.state.estado);
            console.log("Trelew", data['Trelew']);
          
            

            var dataset_cargados = [];
            var dataset = {
              type: "doughnut",
              showInLegend: true,
              toolTipContent: "{y} Colmenas - #percent %",
              //yValueFormatString: "#,##0,,.## Million",
              //visible : this.verificar_existencia_colmenas_en_estado(data),
              legendText: "{indexLabel}",
              dataPoints: [
                {  y: data["Rawson"], indexLabel: "Rawson" },
                {  y: data["Trelew"], indexLabel: "Trelew" },
                {  y: data["Gaiman"], indexLabel: "Gaiman" },
                {  y: data["Dolavon"], indexLabel: "Dolavon" },
                {  y: data["28 de Julio"], indexLabel: "28 de Julio"},
              ]
            };

            dataset_cargados.push(dataset);

            
            
            //console.log("Dataset Cargados", dataset_cargados);

            this.setState({
              existenDatos : this.verificar_existencia_colmenas_en_estado(data),
              options: {
                data: dataset_cargados,
                culture:  "es",
                zoomEnabled: true, 
                animationEnabled: true,
                exportEnabled: true,
                interactivityEnabled: true,
                theme: "light2",
                legend: {
                  //maxWidth: 350,
			            //itemWidth: 120,
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
            }, () =>{
                
              if( !this.state.existenDatos ) document.getElementById("div-txt-mensaje").style.display = "block";
                
            });
            

            // Luego meto todo dentro de data

            
        })
        .catch(function(error) {
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }

    verificar_existencia_colmenas_en_estado(data) { 
        
        var contador =  parseInt(data['Trelew']) + parseInt(data['Gaiman']) + parseInt(data['Dolavon']) + parseInt(data['28 de Julio']);
        if( contador == 0 ) return false;
        return true;
    }


    
   

    render() {
        
        if( !this.state.existenDatos ) {
             return (

              
              <div className="box box-primary">
                <div className="box-header with-border">
                  <h3 id="txt-titulo" className="box-title">{this.tituloBox()}</h3>
                  <div className="box-tools pull-right">
                    <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /> </button>
                  </div>
                </div>
                <div className="box-body">
                  <div className="chart">
                    {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                        {/* SPINNER */}
                        <div id={'div-spinner-chart-ciudades'}>
                        <br />
                        <center> <i className="fa fa-spinner fa-pulse fa-3x fa-fw" /> </center>
                        </div>
                        
    
                        
                        
    
                        <div id={'div-txt-mensaje'} style={{display:"none"}}>
                            <p>{this.subtituloBoxBody()}</p>
                        </div>
    
                  </div> 
                </div>
                {/* /.box-body */}
              </div>
            
             )
        }
       

        return (
            
               
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 id="txt-titulo" className="box-title">{this.tituloBox()}</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /> </button>
              </div>
            </div>
            <div className="box-body">
              <div className="chart">
                {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                    {/* SPINNER */}
                    <div id={'div-spinner-chart-ciudades'}>
                    <br />
                    <center> <i className="fa fa-spinner fa-pulse fa-3x fa-fw" /> </center>
                    </div>
                    
                    
                    <CanvasJSChart options = {this.state.options} 
                        /* onRef={ref => this.chart = ref}  */
                    />
                    
                    <div id={'div-txt-mensaje'} style={{display:"none"}}>
                            <p>{this.subtituloBoxBody()}</p>
                        </div>

                    

              </div> 
            </div>
            {/* /.box-body */}
          </div>
         
       




                
                
           
        );
    }
}
