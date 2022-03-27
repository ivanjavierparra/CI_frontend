import React, { Component } from 'react';
import cookie from 'js-cookie';
export default class Apiario extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apiario: this.props.apiario,
            apiario_id : this.props.apiario_id,
            direccion_chacra : this.props.direccion_chacra,
            datos : [], // son los datos de la columna de la tabla: temperatura, humedad y señal.
            variable_seleccionada: "",
            isDesHabilitadoBtnTemperatura: false,
            isDesHabilitadoBtnHumedad: false,
            isDesHabilitadoBtnSenial: false,
        }

        // Methods
        this.handleClickTemperatura = this.handleClickTemperatura.bind(this);
        this.handleClickHumedad = this.handleClickHumedad.bind(this);
        this.handleClickSenial = this.handleClickSenial.bind(this);
        this.handleClickCollapse = this.handleClickCollapse.bind(this);
        this.completarTabla = this.completarTabla.bind(this);
        this.deshabilitarTodo = this.deshabilitarTodo.bind(this);
        this.setBoxTitle = this.setBoxTitle.bind(this);
    }

    componentDidMount () {

        this._isMounted = true;

        // Hago un get de los datos necesarios para completar la tabla: temperatura, humedad y señal de 
        // c/u de las colmenas del apiario.
        // me vendra un array en JSON con los colores.

        // seteo los parámetros

        var url = new URL("http://localhost:8000/api/admin/estados/colmenas");
        var params = {
                        apiario_id: this.state.apiario_id, 
                    };
        console.log("Parametros",params);
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
            // if ( typeof data.status !== 'undefined' ) {
            //   console.log("Modificaste el token....", data.status);
            //   this.abortController.abort();
            //   return;
            // }

            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 

            this.setState({ 
                datos : data,
            });


            if( data['cantidad_colmenas'] == 0 ) this.deshabilitarTodo();
            else this.completarTabla(data);            

            // Habilito screen.
            document.getElementById("spinner-apiario-" + this.state.apiario_id).style.display = "none";
            document.getElementById("box-apiarios-" + this.state.apiario_id).style.pointerEvents = "all";
            document.getElementById("box-apiarios-" + this.state.apiario_id).style.opacity = 1;

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error", error);
            //alert("Ha ocurrido un error: " + error);
        });

    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    completarTabla(datos) {
            
      // Rojo
      document.getElementById("txt-temperatura-rojo-apiario-" + this.state.apiario_id).innerText = datos['temperatura']['rojo'];
      document.getElementById("txt-humedad-rojo-apiario-" + this.state.apiario_id).innerText = datos['humedad']['rojo'];
      document.getElementById("txt-senial-rojo-apiario-" + this.state.apiario_id).innerText = datos['senial']['rojo'];

      // Amarillo
      document.getElementById("txt-temperatura-amarillo-apiario-" + this.state.apiario_id).innerText = datos['temperatura']['amarillo'];
      document.getElementById("txt-humedad-amarillo-apiario-" + this.state.apiario_id).innerText = datos['humedad']['amarillo'];
      document.getElementById("txt-senial-amarillo-apiario-" + this.state.apiario_id).innerText = datos['senial']['amarillo'];

      // Verde
      document.getElementById("txt-temperatura-verde-apiario-" + this.state.apiario_id).innerText = datos['temperatura']['verde'];
      document.getElementById("txt-humedad-verde-apiario-" + this.state.apiario_id).innerText = datos['humedad']['verde'];
      document.getElementById("txt-senial-verde-apiario-" + this.state.apiario_id).innerText = datos['senial']['verde'];

    }


    deshabilitarTodo() {

        
      this.setState({ 
        isDesHabilitadoBtnTemperatura : true,
        isDesHabilitadoBtnHumedad: true,
        isDesHabilitadoBtnSenial: true,
      });

    }

    /**
     * Método de ejemplo: onClick pasando parámetros.
     * @param {*} compName 
     * @param {*} e 
     */
    handleClickVariable(compName, e){
      console.log(compName);
      this.setState({variable_seleccionada:compName});       
    }


    

    /**
     * Esto funciona asi: en componente Home hay un metodo que es "showContenedorGraficos" el cual recibe dos parametros: apiario y variable.
     * Este es metodo es pasado por parametros al componente "ContenedorApiario" con el nombre action. A su vez, es pasado por parametro desde 
     * ContenedorApiario a Apiario, o sea, este componente. Cuando el usuario hace click en alguno de los 3 botones: temperatrau, humedad o senial,
     * entonces se le pasa al metodo del padre (action) los dos parametros. Entonces el padre  (Home) ejecuta el metodo y cambia el estado de la variable
     * "showContenedorGrafico", esto hace que se vuelva a renderizar el componente, mostrando ahora el componente "ContenedorGrafico" 
     * con los estados apropiados (apiario_id, variable).
     */

    handleClickTemperatura = () => {
      
      this.props.action(this.state.apiario_id, this.state.direccion_chacra, "temperatura");            
    }


    handleClickHumedad = () => {
      
      this.props.action(this.state.apiario_id, this.state.direccion_chacra,"humedad");            
    }

    handleClickSenial = () => {
      
      this.props.action(this.state.apiario_id, this.state.direccion_chacra, "senial");            
    }

    handleClickCollapse(event) {
        var display = document.getElementById("box-body-apiario-" + this.state.apiario_id).style.display;
        if( display == "none" ) {
          document.getElementById("box-body-apiario-" + this.state.apiario_id).style.display = "block";
        }
        else {
          document.getElementById("box-body-apiario-" + this.state.apiario_id).style.display = "none";
        }
    }

    setBoxTitle() {
        var text = this.state.apiario['direccion_chacra'];
        if( !this.state.apiario['nombre_fantasia'] ) return text;
        text = this.state.apiario['nombre_fantasia'] + " (" + text + ")";
        return text;
    }

    render() {
        
        
        return (

            
            
                  
            
            <div className="col-md-3"> 
                                          {/* LINE CHART */}
                                          <div id={"box-apiarios-" + this.state.apiario_id} className="box box-primary" style={{pointerEvents: 'none', opacity: 0.8}}>
                                              <div className="box-header with-border">
                                                  <h3 className="box-title"> { this.setBoxTitle() } </h3>
                                                  <div className="box-tools pull-right">
                                                    <button type="button" className="btn btn-box-tool" onClick={this.handleClickCollapse} data-widget="collapse"><i className="fa fa-minus" /> </button>
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
                                                    </div> */}
                                                    {/* <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button> */}
                                                  </div>
                                              </div>
                                              <div id={"box-body-apiario-" + this.state.apiario_id} className="box-body" style={{  
                                                  backgroundImage: "url(" + process.env.PUBLIC_URL + '/images/panal2.jpg' + ")",
                                                  backgroundPosition: 'center',
                                                  backgroundSize: 'cover',
                                                  backgroundRepeat: 'no-repeat'
                                              }}>

                                                      <center>
                                                      <i id={"spinner-apiario-" + this.state.apiario_id} className="fa fa-spinner fa-pulse fa-3x fa-fw" />
                                                      </center>
                                                      <center>
                                                          <img src={process.env.PUBLIC_URL + '/images/colmena.png'} width={100} height={100} /> 
                                                      </center>
                                                <div className="table-responsive">
                                                      
                                                      
                                                      <table className="table table-bordered table-sm" style={{textAlign: 'center'}}>
                                                          <thead>
                                                            <tr>
                                                              {/* /.botones 
                                                              <th scope="col" style={{textAlign: 'center'}}> <button onClick={this.handleClickVariable.bind(this,'temperatura')} className="btn btn-xs btn-warning" data-toggle="tooltip" data-placement="top" title="Temperatura"> <img src={process.env.PUBLIC_URL + '/images/temperatura6.png'} width={20} height={20} /> </button>  </th>
                                                              <th scope="col" style={{textAlign: 'center'}}> <button onClick={this.handleClickVariable.bind(this,'humedad')} className="btn btn-xs btn-primary" data-toggle="tooltip" data-placement="top" title="Humedad"> <img src={process.env.PUBLIC_URL + '/images/humedad4.png'} width={20} height={20} /> </button> </th>
                                                              <th scope="col" style={{textAlign: 'center'}}> <button onClick={this.handleClickVariable.bind(this,'senial')} className="btn btn-xs btn-info" data-toggle="tooltip" data-placement="top" title="Señal"> <img src={process.env.PUBLIC_URL + '/images/wifi6.png'} width={20} height={20} /> </button> </th>
                                                              */}

                                                              {/* /.botones */}
                                                              <th scope="col" style={{textAlign: 'center'}}> <button id={"btn-temperatura-apiario-" + this.state.apiario_id} onClick={this.handleClickTemperatura} disabled={this.state.isDesHabilitadoBtnTemperatura} className="btn btn-xs btn-warning" data-toggle="tooltip" data-placement="top" title="Temperatura"> <img src={process.env.PUBLIC_URL + '/images/temperatura6.png'} width={20} height={20} /> </button>  </th>
                                                              <th scope="col" style={{textAlign: 'center'}}> <button id={"btn-humedad-apiario-" + this.state.apiario_id} onClick={this.handleClickHumedad} disabled={this.state.isDesHabilitadoBtnHumedad} className="btn btn-xs btn-primary" data-toggle="tooltip" data-placement="top" title="Humedad"> <img src={process.env.PUBLIC_URL + '/images/humedad4.png'} width={20} height={20} /> </button> </th>
                                                              <th scope="col" style={{textAlign: 'center'}}> <button id={"btn-senial-apiario-" + this.state.apiario_id} onClick={this.handleClickSenial} disabled={this.state.isDesHabilitadoBtnSenial} className="btn btn-xs btn-info" data-toggle="tooltip" data-placement="top" title="Señal"> <img src={process.env.PUBLIC_URL + '/images/wifi6.png'} width={20} height={20} /> </button> </th>

                                                              
                                                              
                                                              

                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            <tr className="bg-danger">
                                                              
                                                              
                                                              <td>   <span className="label label-danger"><span id={"txt-temperatura-rojo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-times"></i></span> </td> 
                                                              <td>   <span className="label label-danger"><span id={"txt-humedad-rojo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-times"></i></span> </td> 
                                                              <td>   <span className="label label-danger"><span id={"txt-senial-rojo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-times"></i></span> </td> 
                                                            </tr>
                                                            <tr className="bg-warning">
                                                              
                                                              <td>  <span className="label label-warning"><span id={"txt-temperatura-amarillo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-dot-circle-o"></i></span> </td> 
                                                              <td>  <span className="label label-warning"><span id={"txt-humedad-amarillo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-dot-circle-o"></i></span></td>
                                                              <td>  <span className="label label-warning"><span id={"txt-senial-amarillo-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-dot-circle-o"></i></span></td>
                                                            </tr>
                                                            <tr className="bg-success">
                                                              <td>  <span className="label label-success"><span id={"txt-temperatura-verde-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-check"></i></span> </td>
                                                              <td>  <span className="label label-success"><span id={"txt-humedad-verde-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-check"></i></span> </td>
                                                              <td>  <span className="label label-success"><span id={"txt-senial-verde-apiario-" + this.state.apiario_id}>{ "-" }</span> <i className="fa fa-check"></i></span> </td>
                                                              
                                                            </tr>
                                                            <tr className="bg-primary">
                                                              
                                                              <td colSpan={3}><span className="label label-primary">{this.state.datos['cantidad_colmenas']} <i className="fa fa-hashtag"></i></span></td>
                                                              
                                                            </tr>
                                                          </tbody>
                                                      </table>
                                                  </div>

                                              </div>
                                              {/* /.box-body */}
                                          </div>
                                          {/* /.box */}
                                      {/* /.col (LEFT) */}
                                      </div>

                                      
        )
    }
}
