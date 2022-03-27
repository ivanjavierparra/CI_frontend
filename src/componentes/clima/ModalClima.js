import React, { Component } from 'react'

export default class ModalClima extends Component {

    

    /**
   * Constructor: defino propiedades, estados y métodos.
   * @props propiedades que me pasa el padre como parámetros.
   */ 
    constructor(props) {

        super(props);

        this._isMounted = false;

        // Creo mis estados.
        this.state = { 
            datos : this.props.datos,    
            show : this.props.show,    
            
        };

        

        // Asocio el metodo a la clase.
        this.getFecha = this.getFecha.bind(this);
        this.getHora = this.getHora.bind(this);
        this.getTemperatura = this.getTemperatura.bind(this);
        this.getTemperaturaMinima = this.getTemperaturaMinima.bind(this);
        this.getTemperaturaMaxima = this.getTemperaturaMaxima.bind(this);
        this.getSensacionTermica =  this.getSensacionTermica.bind(this);
        this.getSensacionTermicaMinima =  this.getSensacionTermicaMinima.bind(this);
        this.getSensacionTermicaMaxima =  this.getSensacionTermicaMaxima.bind(this);
        this.getHumedad = this.getHumedad.bind(this);
        this.getVelocidadViento = this.getVelocidadViento.bind(this);
        this.getPresion = this.getPresion.bind(this);
        this.getHorasSol = this.getHorasSol.bind(this);
      
        
    }

    componentDidMount () {

      this._isMounted = true; 

      console.log("Ciudad",this.state.datos);

    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            datos : nextProps.datos,
            show : nextProps.show,
            
        },() => this.componentDidMount()); 
    }


    getFecha() {
      if( !this.props.datos['fecha'] ) return "";
      return this.props.datos['fecha'].split("-")[2]+"-"+this.props.datos['fecha'].split("-")[1]+"-"+this.props.datos['fecha'].split("-")[0];
    }
    
    getHora() {
        if( !this.props.datos['hora'] ) return "";
        return this.props.datos['hora'].substr(0,5);
    }

    getTemperatura() {
        if( !this.props.datos['temperatura'] ) return "";
        return parseFloat(this.props.datos['temperatura']).toFixed(0) + " °C";
    }

    getTemperaturaMinima() {
      if( !this.props.datos['temperatura_minima'] ) return "";
      return parseFloat(this.props.datos['temperatura_minima']).toFixed(0) + " °C";
    }

    getTemperaturaMaxima() {
      if( !this.props.datos['temperatura_maxima'] ) return "";
      return parseFloat(this.props.datos['temperatura_maxima']).toFixed(0) + " °C";
    }


    getSensacionTermica() {
        if( !this.props.datos['sensacion_termica'] ) return "";
        return parseFloat(this.props.datos['sensacion_termica']).toFixed(0) + " °C";
    }

    getSensacionTermicaMinima() {
      if( !this.props.datos['sensacion_termica_minima'] ) return "";
      return parseFloat(this.props.datos['sensacion_termica_minima']).toFixed(0) + " °C";
    }

    getSensacionTermicaMaxima() {
      if( !this.props.datos['sensacion_termica_maxima'] ) return "";
      return parseFloat(this.props.datos['sensacion_termica_maxima']).toFixed(0) + " °C";
    }

    getHumedad() {
        if( !this.props.datos['humedad'] ) return "";
        return parseFloat(this.props.datos['humedad']).toFixed(0) + " %";
    }

    getVelocidadViento() {
        if( !this.props.datos['velocidad_del_viento_km_hs'] ) return "";
        return parseFloat(this.props.datos['velocidad_del_viento_km_hs']).toFixed(0) + " km/hs";
    }

    getPresion() {
      if( !this.props.datos['presion_hpa'] ) return "";
      return parseFloat(this.props.datos['presion_hpa']).toFixed(0) + " hpa";
    }

    getHorasSol() {
      if( !this.props.datos['horas_de_sol'] ) return "";
      return parseFloat(this.props.datos['horas_de_sol']).toFixed(1) + " hs";
    }


    render() {

        // var humedad = this.props.datos["humedad"];
        // var velocidad_viento = this.props.datos["velocidad_del_viento_km_hs"];
        // var direccion_viento = this.props.datos["direccion_del_viento"];
        // var presion = this.props.datos["presion_hpa"];
        // var horas_de_sol = this.props.datos["horas_de_sol"];

        return (
            <div>
                <div className="modal fade" id="modal_cp" style={{}}>
<div className="modal-dialog modal-lg" >
  <div className="modal-content">
    <div className="modal-header">
      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 className="modal-title" id="modal_ped_label">Detalle del Clima</h4>
    </div>
    <div className="modal-body">
      <div className="tab-content">
        <div className="tab-pane fade in active" id="info_pedido">
          <form className="form-horizontal form-label-left">
            <div className="col-md-12">
              <h4>Ciudad {"de " + this.state.datos['ciudad'] + " [" +  this.getFecha() +"  -  " + this.getHora() + "]" || ''}</h4>
            </div>
            <br />
            <hr />
            <div className="form-group">
              <label className="control-label col-md-2">Ciudad </label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-ciudad" type="text" className="form-control" value={this.state.datos['ciudad'] || '' } disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Temperatura</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-temperatura" type="text" className="form-control" value={this.getTemperatura() || '' } disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Temperatura Mínima</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-temperatura-minima" type="text" className="form-control" value={this.getTemperaturaMinima()  || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Temperatura Máxima</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-temperatura-maxima" type="text" className="form-control" value={this.getTemperaturaMaxima()  || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Sensación Térmica</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-sensacion-termica" type="text" className="form-control" value={this.getSensacionTermica() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Sensación Térmica Mínima</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-sensacion-termica-minima" type="text" className="form-control" value={this.getSensacionTermicaMinima() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Sensación Térmica Máxima</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-sensacion-termica-maxima" type="text" className="form-control" value={this.getSensacionTermicaMaxima() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Humedad</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-humedad" type="text" className="form-control" value={this.getHumedad() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Dirección del Viento</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-direccion-viento" type="text" className="form-control" value={this.state.datos['direccion_del_viento'] || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Velocidad del Viento</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-velocidad-viento" type="text" className="form-control" value={this.getVelocidadViento() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Presión Atmosférica</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-presion-atmosferica" type="text" className="form-control" value={this.getPresion() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Horas de Sol</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-horas-sol" type="text" className="form-control" value={this.getHorasSol() || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Descripción General</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-descripcion" type="text" className="form-control" value={this.state.datos['descripcion'] || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Descripcion del Día</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-descripcion-dia" type="text" className="form-control" value={this.state.datos['descripcion_dia'] || ''} disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">Descripción de la Noche</label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <input id="txt-descripcion-noche" type="text" className="form-control" value={this.state.datos['descripcion_noche'] || ''} disabled />
              </div>
            </div>
            <br />
            <hr />                
          </form>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      {/* <button type="button" className="btn btn-rounded btn-default pull-left" data-dismiss="modal">Cerrar</button> */}
      <button type="button" className="btn btn-rounded btn-success pull-right boton-guardar" data-dismiss="modal">Cerrar</button>  
    </div>
  </div>
</div>
</div>
            </div>
        )
    }
}
