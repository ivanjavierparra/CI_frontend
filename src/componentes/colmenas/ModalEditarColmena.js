import React, { Component } from 'react';
import cookie from 'js-cookie';
export default class ModalEditarColmena extends Component {

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
            colmena : this.props.colmena,    
            show : this.props.show,    
            identificacion : this.props.colmena['identificacion'],
            raza_abeja : this.props.colmena['raza_abeja'],
            descripcion :  this.props.colmena['descripcion'],
        };

        

        // Asocio el metodo a la clase.
        this.handleChangeIdentificacion = this.handleChangeIdentificacion.bind(this);
        this.handleChangeDescripcion = this.handleChangeDescripcion.bind(this);
        this.handleChangeRazaAbeja = this.handleChangeRazaAbeja.bind(this);
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
        
    }


    componentDidMount() {

      this._isMounted = true;


      /* Este código no anda.... */
      var index = 0;
      if( this.props.colmena['raza_abeja'] == "Italiana") index = 1;
      else if( this.props.colmena['raza_abeja'] == "Buckfast") index = 2;
      else if( this.props.colmena['raza_abeja'] == "Carniola") index = 3;
      else if( this.props.colmena['raza_abeja'] == "Causacasica") index = 4;
      else if( this.props.colmena['raza_abeja'] == "Otros") index = 5;
      // document.getElementById("raza_abeja").value = this.props.colmena['raza_abeja'];
      var razas = document.getElementById("txt-raza-abeja-" + this.state.colmena['id']);
      razas.options[index].selected = true;      
      console.log("Buenas",index,this.props.colmena['raza_abeja']);

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
            colmena : nextProps.colmena,
            show : nextProps.show,
            identificacion : nextProps.colmena['identificacion'],
            raza_abeja : nextProps.colmena['raza_abeja'],
            descripcion :  nextProps.colmena['descripcion'],
        }); 
    }


    handleChangeIdentificacion(event) {
        this.setState({identificacion: event.target.value});
    }


    handleChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    handleChangeRazaAbeja(event) {
      this.setState({raza_abeja: event.target.value});
    }

    handleClickGuardar(event) {
        // END POINT para crear Apiario.
        var url = 'http://localhost:8000/api/colmena/editar';
        // DATA a enviar.
        var data = {
          'id_colmena' : this.state.colmena['id'],
          'identificacion': document.getElementById("txt-identificacion-" + this.state.colmena['id']).value,
          'raza_abeja': document.getElementById("txt-raza-abeja-" + this.state.colmena['id']).value,
          'descripcion': document.getElementById("txt-descripcion-" + this.state.colmena['id']).value,
        };      
        
        // AJAX POST
        fetch(url, {
            method: 'POST', 
            body: JSON.stringify(data), 
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

            console.log(data);
            if( data['resultado' == 200] ) {
                // Mensaje de EXITO.
                alert(data['mensaje']);
                

            }
            else {
                // Mensaje de ERROR.
                alert(data['mensaje']);
            }

            this.props.actionRefresh();
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
    }

    render() {
        return (
            <div>
                <div className="modal fade" id="modal_cp">
<div className="modal-dialog modal-lg" >
  <div className="modal-content">
    <div className="modal-header">
      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 className="modal-title" id="modal_ped_label">Editar Colmena</h4>
    </div>
    <div className="modal-body">
      <div className="tab-content">
        <div className="tab-pane fade in active" id="info_pedido">
          <form className="form-horizontal form-label-left">
            <div className="col-md-12">
              <h4>Colmena N° {this.state.colmena['identificacion'] || ''} </h4>
            </div>
            <br />
            <hr />
            <div className="form-group">
              <label className="control-label col-md-2">ID </label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-id" type="text" className="form-control" value={this.state.colmena['id'] || '' } disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Identificación</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-identificacion-" + this.state.colmena['id']} type="text" className="form-control" onChange={this.handleChangeIdentificacion} value={this.state.identificacion || '' }  />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Fecha de Creación</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-fecha-creacion" type="text" className="form-control" value={this.state.colmena['fecha_creacion'] || ''} disabled/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Raza de la Abeja</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <select
                  className="form-control"
                  onChange={this.handleChangeRazaAbeja}
                  id={"txt-raza-abeja-" + this.state.colmena['id']}
                  name={"txt-raza-abeja-" + this.state.colmena['id']}
                >
                  <option value={""}>----- Seleccionar -----</option>
                  <option value={"Italiana"}>Italiana</option>
                  <option value={"Buckfast"}>Buckfast</option>
                  <option value={"Carniola"}>Carniola</option>
                  <option value={"Caucasica"}>Caucasica</option>
                  <option value={"Otros"}>Otros</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Descripción</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-descripcion-" + this.state.colmena['id']} type="text" className="form-control" onChange={this.handleChangeDescripcion} value={this.state.descripcion || ''}  />
              </div>
            </div>
            <br />
            <hr />                
          </form>
        </div>
      </div>
    </div>
    <div className="modal-footer">
       <button type="button" className="btn btn-rounded btn-default pull-left" data-dismiss="modal">Cerrar</button>
      <button type="button" className="btn btn-rounded btn-success pull-right boton-guardar" onClick={this.handleClickGuardar} data-dismiss="modal">Guardar</button>  
    </div>
  </div>
</div>
</div>
            </div>
        )
    }
}
