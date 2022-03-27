import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
const $ = require('jquery')




export default class ModalColmenaEstado extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;  
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            temperatura : this.props.temperatura,
            humedad : this.props.humedad,
            senial : this.props.senial,
            show: this.props.show,
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
            temperatura : nextProps.temperatura,
            humedad : nextProps.humedad,
            senial : nextProps.senial,
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
        console.log("Estoy en ModalColmenaEstado");
        
        
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
                      <h4 className="modal-title" id="modal_ped_label">Detalle del estado de la colmena {this.state.colmena} </h4>
                  </div>
                  <div className="modal-body">
                    <div className="tab-content">
                      <div className="tab-pane fade in active" id="info_pedido">
         
                            <strong><i className="fa fa-forumbee margin-r-5" /> Estado de la temperatura  </strong>
                            <p className="text-muted">
                                {this.state.temperatura}
                            </p>

                            <strong><i className="fa fa-forumbee margin-r-5" /> Estado de la humedad  </strong>
                            <p className="text-muted">
                                {this.state.humedad}
                            </p>

                            <strong><i className="fa fa-forumbee margin-r-5" /> Estado de la señal  </strong>
                            <p className="text-muted">
                                {this.state.senial}
                            </p>
                                
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
