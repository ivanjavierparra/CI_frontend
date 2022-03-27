import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import cookie from 'js-cookie';
class AlertaCiudad extends Component {


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
            datos : [],
        };


        // Methods
        this.refrescarComponente = this.refrescarComponente.bind(this);
        this.completarTarjetas = this.completarTarjetas.bind(this);
        this.completarTarjetasTrelew = this.completarTarjetasTrelew.bind(this);
        this.completarTarjetasGaiman = this.completarTarjetasGaiman.bind(this);
        this.completarTarjetasDolavon = this.completarTarjetasDolavon.bind(this);
        this.completarTarjetasVeintiochoDeJulio = this.completarTarjetasVeintiochoDeJulio.bind(this);
    }

    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

        this._isMounted = true;
      
        
        
        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/alertas/dashboard");
        /* var params = {
                        color: this.state.estado, 
                    };
        
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));*/
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
              cookie.remove("token");
              this.abortController.abort();
              this.props.logout();
              return;
            }

            this.setState(
                {
                    datos: data,
                },
                function() { 
                    console.log("Datos encontrados: " + JSON.stringify(this.state.datos));
                }
            );

            var trelew = data[0];
            var gaiman = data[1];
            var dolavon = data[2];
            var veintiocho_de_julio = data[3];

            this.completarTarjetas(trelew);
            this.completarTarjetas(gaiman);
            this.completarTarjetas(dolavon);
            this.completarTarjetas(veintiocho_de_julio);

            document.getElementById("section-ciudades").style.pointerEvents = "all";
            document.getElementById("section-ciudades").style.opacity = 1;
            
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request apiarios failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
        
        
   }


   completarTarjetas(ciudad) {


        if( ciudad["ciudad"] == "Trelew" ) this.completarTarjetasTrelew(ciudad);
        else if( ciudad["ciudad"] == "Gaiman" ) this.completarTarjetasGaiman(ciudad);
        else if( ciudad["ciudad"] == "Dolavon" ) this.completarTarjetasDolavon(ciudad);
        else if( ciudad["ciudad"] == "28 de Julio" ) this.completarTarjetasVeintiochoDeJulio(ciudad);
 
   }


   completarTarjetasTrelew(datos) {
      document.getElementById("txt-apiarios-trelew").innerText = datos['apiarios'] +  " " + "Apiarios";
      document.getElementById("txt-colmenas-trelew").innerText = datos['colmenas'] +  " " + "Colmenas";
      document.getElementById("txt-colmenas-verde-trelew").innerText = datos['colores']['verde'];
      document.getElementById("txt-colmenas-amarillo-trelew").innerText = datos['colores']['amarillo'];
      document.getElementById("txt-colmenas-rojo-trelew").innerText = datos['colores']['rojo'];
   }

   completarTarjetasGaiman(datos) {
      document.getElementById("txt-apiarios-gaiman").innerText = datos['apiarios'] +  " " + "Apiarios";
      document.getElementById("txt-colmenas-gaiman").innerText = datos['colmenas'] +  " " + "Colmenas";
      document.getElementById("txt-colmenas-verde-gaiman").innerText = datos['colores']['verde'];
      document.getElementById("txt-colmenas-amarillo-gaiman").innerText = datos['colores']['amarillo'];
      document.getElementById("txt-colmenas-rojo-gaiman").innerText = datos['colores']['rojo'];
   }

   completarTarjetasDolavon(datos) {
      document.getElementById("txt-apiarios-dolavon").innerText = datos['apiarios'] +  " " + "Apiarios";
      document.getElementById("txt-colmenas-dolavon").innerText = datos['colmenas'] +  " " + "Colmenas";
      document.getElementById("txt-colmenas-verde-dolavon").innerText = datos['colores']['verde'];
      document.getElementById("txt-colmenas-amarillo-dolavon").innerText = datos['colores']['amarillo'];
      document.getElementById("txt-colmenas-rojo-dolavon").innerText = datos['colores']['rojo'];
   }


   completarTarjetasVeintiochoDeJulio(datos) {
      document.getElementById("txt-apiarios-28-de-julio").innerText = datos['apiarios'] +  " " + "Apiarios";
      document.getElementById("txt-colmenas-28-de-julio").innerText = datos['colmenas'] +  " " + "Colmenas";
      document.getElementById("txt-colmenas-verde-28-de-julio").innerText = datos['colores']['verde'];
      document.getElementById("txt-colmenas-amarillo-28-de-julio").innerText = datos['colores']['amarillo'];
      document.getElementById("txt-colmenas-rojo-28-de-julio").innerText = datos['colores']['rojo'];
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
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Alertas 
        <br/>
        <small>Estado de los Apiarios por Ciudad</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-exclamation-triangle" /> Alertas</a></li>
        <li className="active"><a href="#">Alertas</a></li>
      </ol>
    </section>
    {/* Main content */}
    <section id={"section-ciudades"} className="content" style={{pointerEvents: 'none', opacity: 0.8}}>

        {/* ----------------------------- TRELEW ------------------------------  */}
        <div className="row">
            <div className="col-md-12">            
                <div id="div-alertas-trelew">
                    <button className="btn btn-xs btn-info pull-right"><Link to={{pathname: "/alertas/ciudad",state:{ciudad:"Trelew"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcdefg"}>Ver Apiarios <i className="fa fa-arrow-circle-right" /></Link></button>
                    <div className="callout callout-info">
                        <h4> <i className="fa fa-street-view fa-fw" /> Apiarios de Trelew</h4>
                        <hr />
                        <div className="small-box-footer">
                          <b><i className="fa fa-hashtag" /><span id="txt-apiarios-trelew"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span>   <i className="fa fa-long-arrow-right" />  <i className="fa fa-hashtag" /><span id="txt-colmenas-trelew"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b>
                        </div>
                    </div>
                </div> {/* /.div-alertas-trelew */}
                <div id="div-alertas-apiarios-trelew">

                      <div className="row">
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id="txt-colmenas-verde-trelew"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"verde",ciudad:"Trelew"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_trelew"} data-key={"1234"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id="txt-colmenas-amarillo-trelew"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"amarillo",ciudad:"Trelew"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_trelew"} data-key={"12345"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id="txt-colmenas-rojo-trelew"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas a revisar</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"rojo",ciudad:"Trelew"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_trelew"} data-key={"123456"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                </div>{/* /.div-alertas-apiarios-trelew */}
            </div>{/* /.col */}
        </div>{/* /.row trelew */}




          {/* ----------------------------- GAIMAN ------------------------------  */}
        <div className="row">
            <div className="col-md-12">            
                <div id="div-alertas-gaiman">
                    <button className="btn btn-xs btn-info pull-right"><Link to={{pathname: "/alertas/ciudad",state:{ciudad:"Gaiman"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcdefgh"}>Ver Apiarios <i className="fa fa-arrow-circle-right" /></Link></button>
                    <div className="callout callout-info">
                        <h4> <i className="fa fa-street-view fa-fw" /> Apiarios de Gaiman</h4>
                        <hr />
                        <div className="small-box-footer">
                          <b><i className="fa fa-hashtag" /><span id="txt-apiarios-gaiman"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span>   <i className="fa fa-long-arrow-right" />  <i className="fa fa-hashtag" /><span id="txt-colmenas-gaiman"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b>
                        </div>
                    </div>
                </div> {/* /.div-alertas-trelew */}
                <div id="div-alertas-apiarios-gaiman">

                      <div className="row">
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id="txt-colmenas-verde-gaiman"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"verde",ciudad:"Gaiman"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_gaiman"} data-key={"1234523"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id="txt-colmenas-amarillo-gaiman"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"amarillo",ciudad:"Gaiman"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_gaiman"} data-key={"112345"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id="txt-colmenas-rojo-gaiman"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas a revisar</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"rojo",ciudad:"Gaiman"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_gaiman"} data-key={"1223456"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                </div>{/* /.div-alertas-apiarios-gaiman */}
            </div>{/* /.col */}
        </div>{/* /.row gaiman */}
        




        {/* ----------------------------- DOLAVON ------------------------------  */}
        <div className="row">
            <div className="col-md-12">            
                <div id="div-alertas-dolavon">
                    <button className="btn btn-xs btn-info pull-right"><Link to={{pathname: "/alertas/ciudad",state:{ciudad:"Dolavon"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcdefdfgh"}>Ver Apiarios <i className="fa fa-arrow-circle-right" /></Link></button>
                    <div className="callout callout-info">
                        <h4> <i className="fa fa-street-view fa-fw" /> Apiarios de Dolavon</h4>
                        <hr />
                        <div className="small-box-footer">
                          <b><i className="fa fa-hashtag" /><span id="txt-apiarios-dolavon"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span>   <i className="fa fa-long-arrow-right" />  <i className="fa fa-hashtag" /><span id="txt-colmenas-dolavon"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b>
                        </div>
                    </div>
                </div> {/* /.div-alertas-trelew */}
                <div id="div-alertas-apiarios-dolavon">

                      <div className="row">
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id="txt-colmenas-verde-dolavon"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"verde",ciudad:"Dolavon"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_dolavon"} data-key={"1234123523"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id="txt-colmenas-amarillo-dolavon"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"amarillo",ciudad:"Dolavon"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_dolavon"} data-key={"111232345"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id="txt-colmenas-rojo-dolavon"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas a revisar</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"rojo",ciudad:"Dolavon"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_dolavon"} data-key={"122345886"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                </div>{/* /.div-alertas-apiarios-dolavon */}
            </div>{/* /.col */}
        </div>{/* /.row dolavon */}                      




        {/* ----------------------------- 28 DE JULIO ------------------------------  */}
        <div className="row">
            <div className="col-md-12">            
                <div id="div-alertas-28-de-julio">
                    <button className="btn btn-xs btn-info pull-right"><Link to={{pathname: "/alertas/ciudad",state:{ciudad:"28 de Julio"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abaaacdefdfgh"}>Ver Apiarios <i className="fa fa-arrow-circle-right" /></Link></button>
                    <div className="callout callout-info">
                        <h4> <i className="fa fa-street-view fa-fw" /> Apiarios de 28 de Julio</h4>
                        <hr />
                        <div className="small-box-footer">
                          <b><i className="fa fa-hashtag" /><span id="txt-apiarios-28-de-julio"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span>   <i className="fa fa-long-arrow-right" />  <i className="fa fa-hashtag" /><span id="txt-colmenas-28-de-julio"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b>
                        </div>
                    </div>
                </div> {/* /.div-alertas-trelew */}
                <div id="div-alertas-apiarios-28-de-julio">

                      <div className="row">
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id="txt-colmenas-verde-28-de-julio"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"verde",ciudad:"28 de Julio"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_28_de_julio"} data-key={"123412343523"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id="txt-colmenas-amarillo-28-de-julio"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"amarillo",ciudad:"28 de Julio"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_28_de_julio"} data-key={"1112aa32345"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id="txt-colmenas-rojo-28-de-julio"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas a revisar</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alertas/apiarios",state:{estado:"rojo",ciudad:"28 de Julio"}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"datatable_28_de_julio"} data-key={"122345dew886"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                </div>{/* /.div-alertas-apiarios-28-de-julio */}
            </div>{/* /.col */}
        </div>{/* /.row 28-de-julio */}
            

    </section>{/* /.content */}
  </div>{/* /.content-wrapper */} 
</div>

        )
    }
}

// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = dispatch => {
  return {
      logout: () => dispatch({type:'SET_LOGOUT'})
  };
};
export default connect(null,mapDispatchToProps)(AlertaCiudad)