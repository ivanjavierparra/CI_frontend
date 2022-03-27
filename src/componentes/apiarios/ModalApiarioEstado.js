import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
const $ = require('jquery')




export default class ModalApiarioEstado extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;  
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            show: this.props.show,
            datos_colmenas : this.props.datos,
            data : {  
              columns: [
                {
                  label: <span>Colmena</span>,
                  field: 'colmena', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Temperatura</span>,
                  field: 'temperatura', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Humedad</span>,
                  field: 'humedad', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Fecha y Hora</span>,
                  field: 'fecha_hora', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Estado</span>,
                  field: 'estado', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
              ],
              rows: [
                {humedad : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
        }

        this.completarTabla = this.completarTabla.bind(this);

        
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            datos : nextProps.datos,
            show : nextProps.show,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    





    

    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

      this._isMounted = true;
      if( !this.state.show ) return;
      this.completarTabla();
      
        
    }


    completarTabla() {

      console.log("Estoy en ModalApiarioEstado");
      var datos = this.state.datos;
      if( !datos ) return;
      var columns = this.state.data.columns;
      var filas = [];

      for( var i = 0; i < datos.length; i++ ) {
        
        var row = {
          colmena : datos[i]['identificacion'],
          temperatura : datos[i]['temperatura'],
          humedad : datos[i]['humedad'],
          fecha_hora : datos[i]['fecha_hora'],
          estado : datos[i]['estado'],
        };

        filas.push(row);
      }

      this.setState({
        data: { columns: columns, rows: filas },
      });

    }
    


    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }


   



    

   

    
   

    render() {
        
        

        return (
            
          <div>
            <div className="modal fade" id="modal_colmena_estado">
              <div className="modal-dialog modal-lg" >
                <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                      <h4 className="modal-title" id="modal_ped_label">Detalle del estado de las colmenas  </h4>
                  </div>
                  <div className="modal-body">
                    <div className="tab-content">
                      <div className="tab-pane fade in active" id="info_pedido">
         


                          <MDBDataTable
                              striped
                              //bordered
                              small
                              hover
                              bordered
                              responsive={true}
                              searching={false}
                              sorting={"true"}
                              //scrollY
                              //rows = {this.state.rows}
                              //columns={this.state.columns}
                              data={this.state.data}
                            />

                           
                                
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-rounded btn-success pull-right boton-guardar" data-dismiss="modal">Cerrar</button>  
                  </div>
                </div>
              </div>
            </div>
          </div>    
           
        );
    }
}
