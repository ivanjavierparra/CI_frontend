import React, { Component } from 'react';
import cookie from 'js-cookie';
export default class AlertaApiarios extends Component {

    

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
          datos : [],
        };


        // Methods
        this.refrescarComponente = this.refrescarComponente.bind(this);
        
    }



    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
          apiario : nextProps.apiario,
      }, //() => this.componentDidMount() 
      ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }


    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

        this._isMounted = true;
      
        
        var url = new URL("http://localhost:8000/api/apiario/alertas/colores");
        var params = {
                        apiario: this.state.apiario['id'], 
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

            console.log("Datos encontrados: ", data);

            this.setState(
                {
                    datos: data['datos'],
                },
                function() { 
                    // Naranja fanta....
                }
            );

            this.completarTarjetas(data['datos']);
              document.getElementById("div-row-apiario-" + this.state.apiario['id']).style.pointerEvents = "all";
              document.getElementById("div-row-apiario-" + this.state.apiario['id']).style.opacity = 1;
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request apiarios failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
        //jhol
        
   }


   

   completarTarjetas(datos) {
    document.getElementById("txt-titulo-apiario-" + this.state.apiario['id']).innerText = "Apiario " + this.state.apiario['direccion_chacra'];
    document.getElementById("txt-colmenas-" + this.state.apiario['id']).innerText = parseInt(datos["verde"]) + parseInt(datos["amarillo"]) + parseInt(datos["rojo"]) + " Colmenas"; 
    document.getElementById("txt-colmenas-verde-" + this.state.apiario['id']).innerText = datos['verde'];
    document.getElementById("txt-colmenas-amarillo-" + this.state.apiario['id']).innerText = datos['amarillo'];
    document.getElementById("txt-colmenas-rojo-" + this.state.apiario['id']).innerText = datos['rojo'];
 }
   
    
   
   

   refrescarComponente() {
      window.location.reload(true);
   }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    rerenderParentCallback() {
        console.log('Entre al callback!!!!!!');
        //this.forceUpdate();
        window.location.reload();
    }

    render() {

      

          
        return (
            

        
        <div className="row" id={"div-row-apiario-" + this.state.apiario['id']} style={{pointerEvents: 'none', opacity: 0.8}}> {/* ----------------------------- CIUDAD HERE! ------------------------------  */}
            <div className="col-md-12">            
                <div id="div-alertas-trelew">
                    <button className="btn btn-xs btn-info pull-right">Ver Colmenas <i className="fa fa-arrow-circle-right" /></button>
                    <div className="callout callout-info">
                        <h4> <i className="fa fa-street-view fa-fw" /> <span id={"txt-titulo-apiario-" + this.state.apiario['id']}> Apiarios de Trelew </span></h4>
                        <hr />
                        <div className="small-box-footer">
                          <b><i className="fa fa-hashtag" /><span id={"txt-colmenas-" + this.state.apiario['id']}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b>
                        </div>
                    </div>
                </div> {/* /.div-alertas-trelew */}
                <div id={"div-alertas-apiarios-" + this.state.apiario['id']}>

                      <div className="row">
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id={"txt-colmenas-verde-" + this.state.apiario['id']}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span>Ver Detalle <i className="fa fa-arrow-circle-right" /></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id={"txt-colmenas-amarillo-" + + this.state.apiario['id']}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span>Ver Detalle <i className="fa fa-arrow-circle-right" /></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id={"txt-colmenas-rojo-" + this.state.apiario['id']}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas a revisar</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span>Ver Detalle <i className="fa fa-arrow-circle-right" /></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                </div>{/* /.div-alertas-apiarios-trelew */}
            </div>{/* /.col */}
            {/* /.row */}
        </div>




          
            

  

        )
    }
}
