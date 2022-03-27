import React, { Component } from 'react'
import cookie from 'js-cookie';
import { MDBDataTable } from 'mdbreact';
export default class AdminModalColmenas extends Component {

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
          estado: this.props.estado,          
          show: this.props.show,
          datos_colmenas: [],
          data: {
            columns: [
              {
                label: <span>Apiario</span>,
                field: "apiario", // con este campo identificamos las filas.
                sort: "asc"
                //width: 150
              },
              {
                label: <span>Colmena</span>,
                field: "colmena", // con este campo identificamos las filas.
                sort: "asc"
                //width: 150
              },
              {
                label: <span>Temperatura</span>,
                field: "temperatura", // con este campo identificamos las filas.
                sort: "asc"
                //width: 150
              },
              {
                label: <span>Humedad</span>,
                field: "humedad", // con este campo identificamos las filas.
                sort: "asc"
                //width: 150
              },
              {
                label: <span>Última Actualización</span>,
                field: "fecha", // con este campo identificamos las filas.
                sort: "asc"
                //width: 150
              }
            ],
            rows: [
              {
                temperatura: (
                  <div>
                    {" "}
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                  </div>
                )
              }
            ]
          }
        };

        // Methods
        this.completarTabla = this.completarTabla.bind(this);
        this.completarDatatable = this.completarDatatable.bind(this);
       
    }


    componentDidMount() {

      this._isMounted = true;

    }
  
  
    componentWillUnmount() {
      
      this._isMounted = false;
      this.abortController.abort();

    }

    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            show : nextProps.show,
            estado: nextProps.estado,
        }, () => {
          if( !this.state.show ) return;
          this.completarTabla();
        }); 

        
    }



    
    completarTabla() {

        this.setState(
        {
              data: {columns: this.state.data.columns, rows: [{colmena : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>}]},
        });


        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/admin/colmenas/todos");
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

          console.log("Datos del DataTable", this.state.estado, data); 
    
          // Seteo los datos del DataTable.
          this.setState(
          {
              datos_colmenas : data["datos"],

          },function(){
              //
              this.completarDatatable(data["datos"]);
              
          });
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
        });
      }


  /**
   * Datos tiene el siguiente formato: ([apiario,[(colmena,revisacion)]])
   */
  completarDatatable(datos) {
    var data = [];
    var columns = this.state.data.columns;

    for (var i = 0; i < datos.length; i++) {
      var apiario = datos[i][0];
      var colmenas_revisaciones = datos[i][1];

      for (var j = 0; j < colmenas_revisaciones.length; j++) {
        var colmena = colmenas_revisaciones[j][0];
        var revisacion = colmenas_revisaciones[j][1];
        var row = "";

        if (revisacion) {
          row = {
            apiario: "Apiario " + apiario["direccion_chacra"],
            colmena: "Colmena N° " + colmena["identificacion"],
            temperatura: revisacion["temperatura"] + "°C",
            humedad: revisacion["humedad"] + "%",
            fecha:
              revisacion["fecha_revisacion"].split("-")[2] +
              "-" +
              revisacion["fecha_revisacion"].split("-")[1] +
              "-" +
              revisacion["fecha_revisacion"].split("-")[0] +
              " " +
              revisacion["hora_revisacion"].substr(0,5)
          };
        } else {
          row = {
            apiario: "Apiario " + apiario["direccion_chacra"],
            colmena: "Colmena N° " + colmena["identificacion"],
            temperatura: "--- °C",
            humedad: "--- %",
            fecha: "---"
          };
        }

        data.push(row);
      }
    }

    // Seteo los datos del DataTable.
    this.setState(
      {
        data: { columns: columns, rows: data },
        show: true
      },
      function() {
        console.log(
          "Datos del DataTable",
          JSON.stringify(this.state.data.rows)
        );
      }
    );
  }  

    

    render() {

        // if( !this.state.show ) return "";

        return (
            <div>
                <div className="modal fade" id="modal_modal_modal">
                    <div className="modal-dialog modal-lg" >
                        <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                          <h4 className="modal-title" id="modal_ped_label">Colmenas en {this.state.estado == "verde" ? "Buen Estado" : this.state.estado == "amarillo" ? "Alerta" : "Peligro"}</h4>
                        </div>
                        <div className="modal-body">
                          <div className="tab-content">
                            <div className="tab-pane fade in active" id="info_pedido">
                              
                              
                                {/* Row: Cabecera */}
                                <div className="row" style={{marginTop: 10}}>
                                        <div className="col-md-12">

                                            <MDBDataTable
                                                striped
                                                small
                                                hover
                                                bordered
                                                responsive = { true }
                                                sorting = {"true"}
                                                data={this.state.data}
                                            />

                                        </div>
                                        {/* ./col */}
                                </div>
                                {/* ./row */}


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        )
    }
}
