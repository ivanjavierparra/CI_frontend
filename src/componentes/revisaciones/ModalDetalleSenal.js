import React, { Component } from 'react'
import cookie from 'js-cookie';
import { MDBDataTable } from 'mdbreact';
export default class ModalDetalleSenal extends Component {

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
          colmena_id : this.props.colmena_id,  
          fecha : this.props.fecha,  
          show : this.props.show,  
          colmena : this.props.colmena,
          apiario : this.props.apiario,
          data : {  
            columns: [
              {
                label: <span>Apiario</span>,
                field: 'apiario', // con este campo identificamos las filas.
                sort: 'asc',
                width: 150
              }, 
              {
                label: <span>Colmena</span>,
                field: 'colmena', // con este campo identificamos las filas.
                sort: 'asc',
                width: 150
              },
              {
                label: <span>Fecha</span>,
                field: 'fecha', // con este campo identificamos las filas.
                sort: 'asc',
                width: 150
              },
              {
                label: <span>Hora</span>,
                field: 'hora', // con este campo identificamos las filas.
                sort: 'asc',
                width: 150
              },
            ],
            rows: [
              {colmena : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
           ]
          },
        };

        this.completarTabla = this.completarTabla.bind(this);

       
    }


    componentDidMount() {

      this._isMounted = true;

      //this.completarTabla();
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
            colmena_id : nextProps.colmena_id,
            fecha : nextProps.fecha,
            show : nextProps.show,
            colmena : nextProps.colmena,
            apiario : nextProps.apiario,
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


        var url = new URL("http://localhost:8000/api/revisacion/senal/detalle");
        var params = {
                        fecha: this.state.fecha, 
                        colmena_id : this.state.colmena_id
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

          console.log("Datos del DataTable",this.state.colmena_id,this.state.show,this.state.fecha,data);
           
          var revisaciones = data;
          var datos = [];
          var columns = this.state.data.columns;
    
          for( var i = 0; i < revisaciones.length; i++ ) {
            var row = "";
            row = 
            { 
                apiario: this.state.apiario,
                colmena: this.state.colmena,
                fecha : revisaciones[i]['fecha_revisacion'].split("-")[2] + "-" + revisaciones[i]['fecha_revisacion'].split("-")[1] + "-" + revisaciones[i]['fecha_revisacion'].split("-")[0],
                hora: (revisaciones[i]['hora_revisacion']).substr(0,5),
            };
    
            datos.push(row);
          }
    
          // Seteo los datos del DataTable.
          this.setState(
          {
              data: {columns: columns, rows: datos},
          },function(){
              
              //
          });
        
            
            
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
      }


      

    

    render() {

        if( !this.state.show ) return "";

        return (
            <div>
                <div className="modal fade" id="modal_cp" style={{}}>
<div className="modal-dialog modal-lg" >
  <div className="modal-content">
    <div className="modal-header">
      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 className="modal-title" id="modal_ped_label">Detalle de Señal de la Colmena {this.state.colmena} para el día {this.state.fecha.split("-")[2] + "/" + this.state.fecha.split("-")[1] + "/" + this.state.fecha.split("-")[0]}</h4>
    </div>
    <div className="modal-body">
      <div className="tab-content">
        <div className="tab-pane fade in active" id="info_pedido">
          
          
          {/* Row: Cabecera */}
          <div className="row" style={{marginTop: 10}}>
                  <div className="col-md-12">

                      <MDBDataTable
                          striped
                          //bordered
                          small
                          hover
                          bordered
                          responsive = { true }
                          //sorting={false}
                          sorting = {"true"}
                          //scrollY
                          //rows = {this.state.rows}
                          //columns={this.state.columns}
                          data={this.state.data}
                      />

                  </div>
                  {/* ./col */}
          </div>
          {/* ./row */}


        </div>
      </div>
    </div>
    {/* <div className="modal-footer">
      <button type="button" className="btn btn-rounded btn-default pull-left" data-dismiss="modal">Cerrar</button> 
      <button type="button" className="btn btn-rounded btn-success pull-right boton-guardar" onClick={this.handleClickGuardar} data-dismiss="modal">Guardar</button>  
    </div> */}
  </div>
</div>
</div>
            </div>
        )
    }
}
