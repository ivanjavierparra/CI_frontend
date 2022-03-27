import React, { Component } from "react";
import cookie from 'js-cookie';
import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class ChartApiariosCiudad extends Component {


    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            rawson : 0,
            trelew : 0,
            gaiman : 0,
            dolavon : 0,
            julio : 0,
            options : {
                zoomEnabled: true, 
                animationEnabled: true,
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
        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "http://localhost:8000/api/admin/apiarios/ciudad";
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

           
            this.setState(
            {
                trelew : data['Trelew'],
                rawson : data['Rawson'],
                gaiman : data['Gaiman'],
                dolavon : data['Dolavon'],
                julio : data['28 de Julio'],

                options: {
                    data: [{
                        dataPoints: [
                            { x: 1, y: data['Rawson'], label: "Rawson"},
                            { x: 2, y: data['Trelew'],  label: "Trelew" },
                            { x: 3, y: data['Gaiman'],  label: "Gaiman"},
                            { x: 4, y: data['Dolavon'],  label: "Dolavon"},
                            { x: 5, y: data['28 de Julio'],  label: "28 de Julio"},
                        ]
                    }],
                    culture:  "es",
                    zoomEnabled: true, 
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light2",
                    axisX: {
                      title: "Horario",
                      titleFontSize: 12,
                      gridThickness: 1,
                      //valueFormatString: "DD-MMM-YY hh:mm",
                    },
                   /* axisY: [
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
                      },
                    ],*/
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

            

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }


    handleClickCollapse(event) {
      var id = "box-body-apiarios-ciudad";
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
      <div className="col-md-6">
        <div className="box box-success">
          <div className="box-header with-border">
            <h3 className="box-title">Apiarios en el VIRCH</h3>
            <div className="box-tools pull-right">
              <button
                type="button"
                className="btn btn-box-tool"
                data-widget="collapse"
                onClick={this.handleClickCollapse}
              >
                <i className="fa fa-minus" />
              </button>
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
          <div id="box-body-apiarios-ciudad" className="box-body">
            <div className="row">
              <div className="col-md-12">
                <div className="chart-responsive">
                    
                    <CanvasJSChart options = {this.state.options} />
                        
                    
                </div>
                {/* ./chart-responsive */}
            </div> {/* /.col */}
                </div>
            {/* /.row */}
          </div>
          {/* /.box-body */}
        </div>
      </div>
    );
  }
}
