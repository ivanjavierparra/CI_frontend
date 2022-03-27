import React, { Component } from 'react'
import {Bar, Line, Pie} from 'react-chartjs-2'
import * as zoom from 'chartjs-plugin-zoom'


export default class ChartBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            variable : this.props.variable,
            horario : this.props.horario,
            tipoAccion : this.props.tipoAccion,
            titulo : this.props.titulo,
            chartData : {},
            labels : [],
            temperatura : [],
            humedad : [],
            backgroundColor: [],
            /*chartData: {
                labels: [],
                datasets: [
                    {
                        label:'',
                        data:[],                      
                        backgroundColor: [],
                        //fill: false,
                    },
                    {
                        label:'',
                        data:[],                      
                        backgroundColor: [],
                        //fill: false,
                    }
                ]
            }*/
        }

        
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
            horario : nextProps.horario,
            tipoAccion : nextProps.tipoAccion,
            titulo : nextProps.titulo,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    
    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {
        var url = new URL("https://backendcolmenainteligente.herokuapp.com/revisacion/colmena");
        var params = {
                        apiario: this.state.apiario['id_apiario'], 
                        colmena: this.state.colmena['id'], 
                        variable: this.state.variable,
                        horario: this.state.horario,
                        tipoAccion: JSON.stringify(this.state.tipoAccion),
                    };
        
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url, {
            method: 'GET', 
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            
            // Oculto el Spinner
            document.getElementById("div-spinner-publicar-"+this.state.colmena['id']).style.display = "none";
            
            // Seteo estados
            this.setState(
                {
                    labels: data.labels,
                    temperatura : data.temperatura,
                    humedad : data.humedad,
                    backgroundColor : data.backgroundColor
                }
            );

            // Defino qué datasets voy a mostrar
            if( this.state.variable == 'temperatura' ) {
                this.setState({
                    chartData : { 
                        labels : data.labels, 
                        datasets: [
                            {
                                label:'Temperatura (C°)',
                                data: data.temperatura,
                                backgroundColor: data.backgroundColor,    
                                fill : false,
                            },
                        ],
                        
                    }
                });
                
            }
            else if( this.state.variable == 'humedad' ) {
                this.setState({
                    chartData : { 
                        labels : data.labels, 
                        datasets: [
                            {
                                label:'Humedad (%)',
                                data: data.humedad,
                                backgroundColor:  data.backgroundColor ,
                                fill: false,
                            }
                        ]
                    }
                });
            }
            else {
                this.setState({
                    chartData : { 
                        labels : data.labels, 
                        datasets: [
                            {
                                label:'Temperatura (C°)',
                                data: data.temperatura,
                                backgroundColor: data.backgroundColor, 
                                fill: false,
                            },
                            {
                                label:'Humedad (%)',
                                data: data.humedad,
                                backgroundColor:  data.backgroundColor,
                                fill: false,
                            }
                        ]
                    }
                });
            }

            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 
        })
        .catch(function(error) {
            console.log("Request failed", error);
            alert("Ha ocurrido un error: " + error);
        });
        
    }

   

    render() {
        
        let nombre_eje_y = '';
        if( this.state.variable == "temperatura" ) nombre_eje_y = 'Temperatura (C°)';
        else if( this.state.variable == "humedad" ) nombre_eje_y = "Humedad (%)";
        else {
            nombre_eje_y = 'Temperatura (C°) - Humedad (%)';
        }

        return (
            
                <div className="col-md-6">
          
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title">Colmena N° {this.state.colmena['identificacion']}</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                </button>
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
                    
                <Line
                    data={this.state.chartData}
                    options={{ 
                        title:{
                            display:true,
                            text: this.state.titulo, // Props!!!
                            legendPosition:'right',
                            fontSize:25
                        },
                        legend:{
                            display:true,
                            position:'top'
                        },
                        maintainAspectRatio	:true, // Maintain the original canvas aspect ratio (width / height) when resizing.
                        responsive: true, // Resizes the chart canvas when its container does.
                        scales: {
                            xAxes: [
                              {
                                //type: 'time',
                                ticks: {
                                  //beginAtZero: true,
                                  //min : 0,
                                  autoSkip: true,
                                  maxTicksLimit: 4, // Este te dice cuantos labels mostrar!!!
                                  //maxRotation: 90,
                                  //minRotation: 90,
                                  //maxRotation: 0 // rota el label!!!!
                                },
                                scaleLabel: {
                                  display: true,
                                  labelString: 'Días',
                                }
                              },
                            ],
                            yAxes: [
                              {
                                ticks: {
                                  beginAtZero: true
                                },
                                scaleLabel: {
                                  display: true,
                                  labelString: nombre_eje_y
                                }
                              }
                            ]
                          },
                          plugins: {
                            zoom: {
                              pan: {
                                enabled: true,
                                mode: 'xy',
                                rangeMin: {
                                  // Format of min pan range depends on scale type
                                  x: this.state.labels[0],
                                  y: 30
                                },
                                rangeMax: {
                                  // Format of max pan range depends on scale type
                                  x: this.state.labels[this.state.labels.length - 1],
                                  y: 40
                                },
                              },
                              zoom: {
                                enabled: true,
                                mode: 'xy',
                                rangeMin: {
                                  // Format of min zoom range depends on scale type
                                  x: this.state.labels[0],
                                  y: 30
                                },
                                rangeMax: {
                                  // Format of max zoom range depends on scale type
                                  x: this.state.labels[this.state.labels.length - 1],
                                  y: 40
                                },
                          
                              }
                            }
                          },
                          onClick: function(e) {
                            // eslint-disable-next-line no-alert
                            //alert(e.type);
                            
                          }
                     }}
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
