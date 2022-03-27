import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DataTableAlertaColmenas from './DataTableAlertaColmenas';
import cookie from 'js-cookie';

export default class ContenedorApiarioCiudad extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            ciudad : this.props.ciudad,
            estado : this.props.estado['estado'],
            totales : this.props.totales['totales'],
            box_border : {verde:"box box-success",amarillo:"box box-warning",rojo:"box box-danger"},
            apiarios : [],
            show : false,   
        }

        // Methods
        this.tituloBox = this.tituloBox.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }

    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            ciudad : nextProps.ciudad,
            estado : nextProps.estado['estado'],
            totales : nextProps.totales['totales'],
        }, //() => this.componentDidMount() 
        ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    /**
     * Obtengo todos los apiarios de la ciudad pasada como parámetro {Trelew, Gaiman, Dolavon, 28 de Julio}.
     * Por cada apiario creo un componente "Apiario", al que delego la responsabilidad de completar la tabla.
     */
    componentDidMount () {

        this._isMounted = true;

        console.log("Ciudad",this.state.ciudad);
        console.log("Color",this.state.estado);

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios/ciudad");
        var params = {
                        ciudad: this.state.ciudad, 
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
            console.log(JSON.stringify(data)); 

            // Seteo estados
            this.setState(
                {
                  apiarios : data,
                  show: true,
                }, () => {
                        
                        var apiarios = [];
                        ReactDOM.unmountComponentAtNode(document.getElementById('contenedor-' + this.state.ciudad));
                        apiarios.push(<DataTableAlertaColmenas apiarios={this.state.apiarios} estado={this.state.estado} totales={this.props.totales['totales']} />);        
                        ReactDOM.render(apiarios, document.getElementById('contenedor-' + this.state.ciudad));
                }
            );
                
        })
        .catch(function(error) {
            console.log("Request failed: get apiarios por ciudad", error);
            //alert("Ha ocurrido un error: " + error);
        }); 

    }


    tituloBox() {
        var color = this.state.estado;
        if ( color == "verde" ) return "Colmenas en buen estado en " + this.state.ciudad;
        if ( color == "amarillo" ) return "Colmenas en alerta en " + this.state.ciudad;
        if ( color == "rojo" ) return "Colmenas en peligro en " + this.state.ciudad;
    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }


    handleClickCollapse(event) {
      var div_apiarios = "box-datatables-" + this.state.ciudad;
      var display = document.getElementById(div_apiarios).style.display;
      if( display == "none" ) {
        document.getElementById(div_apiarios).style.display = "block";
      }
      else {
        document.getElementById(div_apiarios).style.display = "none";
      }
    }

    render() {

        

        return (


            <div className="col-md-12">
          
            {/* LINE CHART */}
            <div className={this.state.box_border[this.state.estado]}>
              <div className="box-header with-border">
                <h3 className="box-title">{ this.tituloBox() }</h3>
                <div className="box-tools pull-right">
                  <button type="button" onClick={this.handleClickCollapse} className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /> </button>
                  {/* <div className="btn-group">
                    <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                      <i className="fa fa-wrench"></i></button>
                    <ul className="dropdown-menu" role="menu">
                      <li><a href="#">Action</a></li>
                      <li><a href="#">Another action</a></li>
                      <li><a href="#">Something else here</a></li>
                      <li className="divider"></li>
                      <li><a href="#">Separated link</a></li>
                    </ul>
                  </div>
                  <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button> */}
                </div>
              </div>
              <div id={"box-datatables-" + this.state.ciudad} className="box-body">
                
                  {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                      {/* SPINNER */}
                      {/* <div id={'div-spinner-chart-ciudades'}>
                      <br />
                      <center> <i className="fa fa-spinner fa-pulse fa-3x fa-fw" /> </center>
                      </div> */}
                      
                  
                        <div id={"contenedor-" + this.state.ciudad} className="row">
                        {/*   <Apiario />
                            <Apiario />
                            <Apiario /> */}
                            
                            <center>
                              <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
                            </center>


                            
                        </div> {/* /.contendedor */}
  
  
  
  
                
              </div>
              {/* /.box-body */}
            </div>
            {/* /.box */}
  
             {/* /.col (LEFT) */}
          </div>


            
        )
    }
}
