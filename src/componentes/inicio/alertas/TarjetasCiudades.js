import React, { Component } from 'react'
import CanvasJSReact from '../../../assets/canvasjs.react';
import cookie from 'js-cookie';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default class TarjetasCiudades extends Component {
    
    
    constructor(props) {

        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            estado : this.props.estado['estado'], // Puede ser: "verde", "amarillo" o "rojo".
            totales : this.props.estado['totales'], // Puede ser: "verde", "amarillo" o "rojo".
            datos_ciudades: [],
            colmenas_rawson: 0,
            colmenas_trelew : 0,
            colmenas_gaiman : 0,
            colmenas_dolavon : 0,
            colmenas_28_de_julio : 0,
            titulo_tarjeta : {verde:"Colmenas en buen estado",amarillo:"Colmenas en riesgo",rojo:"Colmenas en peligro"},
            color_tarjeta : {verde:"small-box bg-green",amarillo:"small-box bg-yellow", rojo:"small-box bg-red"},
            icono : {verde:"fa fa-check", amarillo:"fa fa-dot-circle-o", rojo:"fa fa-times"},
        }

        // Methods
        
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            estado : nextProps.estado['estado'],
            totales : nextProps.estado['totales'],
        }, //() => this.componentDidMount() 
        ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
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

        //console.log("TARJETASCIUDA", this.props.totales['totales']);

        if( this.props.totales['totales'] == 0 ) return;

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

            
            // Seteo estados
            this.setState(
                {
                  datos_ciudades : data,
                  colmenas_rawson : data['Rawson'],
                  colmenas_trelew : data['Trelew'],
                  colmenas_gaiman : data['Gaiman'],
                  colmenas_dolavon : data['Dolavon'],
                  colmenas_28_de_julio : data['28 de Julio'],
                }, () => {
                        // Naranja fanta.                    
                }
            );


            console.log("Color", this.state.estado);
            console.log("Trelew", data['Trelew']);
          
            //document.getElementById("color-trelew").className = this.state.titulo_tarjeta[this.state.estado]
            
            //txt-colmenas-trelew
            //txt-titulo-alerta-trelew
            //icon-trelew
            

            
            

            

            
        })
        .catch(function(error) {
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
        
    }

    


    
   

    render() {
      

        return (
            
            <div className="col-md-12">
          
                  <div className="row">
                    <div className="col-lg-4 col-xs-6">
                          {/* small box */}
                          <div id="color-rawson" className={this.state.color_tarjeta[this.state.estado]} >
                              <div className="inner">
                                  <h3 id={"txt-colmenas-rawson"}>{this.state.colmenas_rawson}</h3>
                                  <p id={"txt-titulo-alerta-rawson"}>{this.state.titulo_tarjeta[this.state.estado]}</p>
                              </div>
                              <div className="icon">
                                  <i id={"icon-rawson"} className={this.state.icono[this.state.estado]} />
                              </div>
                              <div className="small-box-footer">
                                  <strong>Rawson</strong>
                              </div>
                          </div>
                      </div> {/* ./col */}
                      <div className="col-lg-4 col-xs-6">
                          {/* small box */}
                          <div id="color-trelew" className={this.state.color_tarjeta[this.state.estado]} >
                              <div className="inner">
                                  <h3 id={"txt-colmenas-trelew"}>{this.state.colmenas_trelew}</h3>
                                  <p id={"txt-titulo-alerta-trelew"}>{this.state.titulo_tarjeta[this.state.estado]}</p>
                              </div>
                              <div className="icon">
                                  <i id={"icon-trelew"} className={this.state.icono[this.state.estado]} />
                              </div>
                              <div className="small-box-footer">
                                  <strong>Trelew</strong>
                              </div>
                          </div>
                      </div> {/* ./col */}
                      <div className="col-lg-4 col-xs-6">
                          {/* small box */}
                          <div id="color-gaiman" className={this.state.color_tarjeta[this.state.estado]}>
                              <div className="inner">
                                  <h3 id={"txt-colmenas-gaiman"}>{this.state.colmenas_gaiman}</h3>
                                  <p id={"txt-titulo-alerta-gaiman"}>{this.state.titulo_tarjeta[this.state.estado]}</p>
                              </div>
                              <div className="icon">
                                  <i id={"icon-gaiman"} className={this.state.icono[this.state.estado]} />
                              </div>
                              <div className="small-box-footer">
                                <strong>Gaiman</strong> 
                              </div>
                          </div>
                      </div> {/* ./col */}
                      <div className="col-lg-4 col-xs-6">
                          {/* small box */}
                          <div id="color-dolavon" className={this.state.color_tarjeta[this.state.estado]}>
                              <div className="inner">
                                  <h3 id={"txt-colmenas-dolavon"}>{this.state.colmenas_dolavon}</h3>
                                  <p id={"txt-titulo-alerta-dolavon"}>{this.state.titulo_tarjeta[this.state.estado]}</p>
                              </div>
                              <div className="icon">
                                  <i id={"icon-dolavon"} className={this.state.icono[this.state.estado]} />
                              </div>
                              <div className="small-box-footer">
                                    <strong>Dolavon</strong> 
                              </div>
                          </div>
                      </div> {/* ./col */}
                      <div className="col-lg-4 col-xs-6">
                          {/* small box */}
                          <div id="color-28-de-julio" className={this.state.color_tarjeta[this.state.estado]}>
                              <div className="inner">
                                  <h3 id={"txt-colmenas-28-de-julio"}>{this.state.colmenas_28_de_julio}</h3>
                                  <p id={"txt-titulo-alerta-28-de-julio"}>{this.state.titulo_tarjeta[this.state.estado]}</p>
                              </div>
                              <div className="icon">
                                  <i id={"icon-28-de-julio"} className={this.state.icono[this.state.estado]} />
                              </div>
                              <div className="small-box-footer">
                                    <strong>28 de Julio</strong>
                              </div>
                            </div>
                        </div> {/* ./col */}
                    </div>

           {/* /.col (LEFT) */}
          </div>       




                
                
           
        );
    }
}
