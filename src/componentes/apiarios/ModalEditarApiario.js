import React, { Component } from 'react'
import cookie from 'js-cookie';
export default class ModalEditarApiario extends Component {

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
            apiario : this.props.apiario,    
            show : this.props.show,  
            nombre_fantasia : this.props.apiario['nombre_fantasia'],
            latitud: this.props.apiario['latitud'],
            longitud: this.props.apiario['longitud'],
            propietario: this.props.apiario['propietario_chacra'],
            descripcion: this.props.apiario['descripcion'],
        };

        

        // Asocio el metodo a la clase.
        this.handleClickGuardar = this.handleClickGuardar.bind(this);
        this.handleChangeLatitud = this.handleChangeLatitud.bind(this);
        this.handleChangeLongitud = this.handleChangeLongitud.bind(this);
        this.handleChangePropietario = this.handleChangePropietario.bind(this);
        this.handleChangeDescripcion = this.handleChangeDescripcion.bind(this);
        this.handleChangeNombreFantasia = this.handleChangeNombreFantasia.bind(this);
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
            apiario : nextProps.apiario,
            show : nextProps.show,
            nombre_fantasia : nextProps.apiario['nombre_fantasia'],
            latitud: nextProps.apiario['latitud'],
            longitud: nextProps.apiario['longitud'],
            propietario: nextProps.apiario['propietario_chacra'],
            descripcion: nextProps.apiario['descripcion'],
        }); 
    }


    handleChangeLatitud(event) {
      this.setState({latitud: event.target.value});
    }


    handleChangeLongitud(event) {
      this.setState({longitud: event.target.value});
    }

    handleChangePropietario(event) {
      this.setState({propietario: event.target.value});
    }

    handleChangeDescripcion(event) {
      this.setState({descripcion: event.target.value});
    }

    handleChangeNombreFantasia(event) {
      this.setState({nombre_fantasia: event.target.value});
    }


    handleClickGuardar(event) {

        // END POINT para crear Apiario.
        var url = 'http://localhost:8000/api/apiario/editar';
        // DATA a enviar.
        var data = {
          'id_apiario' : this.state.apiario['id_apiario'],
          'nombre_fantasia': document.getElementById("txt-nombre-fantasia-" + this.state.apiario['id_apiario']).value,
          'latitud': document.getElementById("txt-latitud-" + this.state.apiario['id_apiario']).value,
          'longitud': document.getElementById("txt-longitud-" + this.state.apiario['id_apiario']).value,
          'descripcion' : document.getElementById("txt-descripcion-" + this.state.apiario['id_apiario']).value,
          'propietario' : document.getElementById("txt-propietario-chacra-" + this.state.apiario['id_apiario']).value,
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
            if( data['resultado' === 200] ) {
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
                <div className="modal fade" id="modal_cp" style={{}}>
<div className="modal-dialog modal-lg" >
  <div className="modal-content">
    <div className="modal-header">
      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 className="modal-title" id="modal_ped_label">Editar Apiario</h4>
    </div>
    <div className="modal-body">
      <div className="tab-content">
        <div className="tab-pane fade in active" id="info_pedido">
          <form className="form-horizontal form-label-left">
            <div className="col-md-12">
              <h4>Apiario {this.state.apiario['direccion_chacra']} - ({this.state.apiario['localidad_chacra']})</h4>
            </div>
            <br />
            <hr />
            <div className="form-group">
              <label className="control-label col-md-2">ID </label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-id-" + this.state.apiario['id_apiario']}  type="text" className="form-control" value={this.state.apiario['id_apiario'] || '' } disabled />
              </div>
            </div>
            <div className="form-group"> 
              <label className="control-label col-md-2">Localidad</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-localidad-chacra-" + this.state.apiario['id_apiario']} type="text" className="form-control" value={this.state.apiario['localidad_chacra'] || '' } disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Dirección</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-direccion-chacra-" + this.state.apiario['id_apiario']} type="text" className="form-control" value={this.state.apiario['direccion_chacra'] || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Nombre Alternativo</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-nombre-fantasia-" + this.state.apiario['id_apiario']} type="text" onChange={this.handleChangeNombreFantasia} className="form-control" value={this.state.nombre_fantasia || ''} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Latitud</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-latitud-" + this.state.apiario['id_apiario']} type="text" onChange={this.handleChangeLatitud} className="form-control" value={this.state.latitud || ''} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Longitud</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-longitud-" + this.state.apiario['id_apiario']} type="text" onChange={this.handleChangeLongitud} className="form-control" value={this.state.longitud || ''} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Fecha de Creación</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-fecha-creacion-" + this.state.apiario['id_apiario']} type="text" className="form-control" value={this.state.apiario['fecha_creacion'] || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Propietario de la Chacra</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-propietario-chacra-" + this.state.apiario['id_apiario']} type="text" onChange={this.handleChangePropietario} className="form-control" value={this.state.propietario || ''} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Descripción</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id={"txt-descripcion-" + this.state.apiario['id_apiario']} type="text" onChange={this.handleChangeDescripcion} className="form-control" value={this.state.descripcion || ''} />
              </div>
            </div>
            <br />
            <hr />                
          </form>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-rounded btn-success pull-left boton-guardar" onClick={this.handleClickGuardar} data-dismiss="modal">Guardar</button>  
      <button type="button" className="btn btn-rounded btn-default pull-right" data-dismiss="modal">Cerrar</button> 
    </div>
  </div>
</div>
</div>
            </div>
        )
    }
}
