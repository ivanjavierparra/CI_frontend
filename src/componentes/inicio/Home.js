import React, { Component } from 'react'
import Clima from './Clima';
import ContenedorApiario from './ContenedorApiario';
import { HashRouter, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import ContenedorGraficos from './ContenedorGraficos';
import MapaApiarios from './MapaApiarios';
import cookie from 'js-cookie';
import { connect } from 'react-redux';
class Home extends Component {
  

  constructor(props) {  
      super(props);

      this._isMounted = false;
      //init controller
      this.abortController = new window.AbortController();

      this.state = {
          titulo : "Ejemplo",
          apiario : [],
          direccion_chacra: "",
          variable : "",
          showContenedorGraficos : false,
          datosColmena: [],
      }

      // Methods
      this.handleClickBtnRawson = this.handleClickBtnRawson.bind(this);
      this.handleClickBtnTrelew = this.handleClickBtnTrelew.bind(this);
      this.handleClickBtnGaiman = this.handleClickBtnGaiman.bind(this);
      this.handleClickBtnDolavon = this.handleClickBtnDolavon.bind(this);
      this.handleClickBtn28deJulio = this.handleClickBtn28deJulio.bind(this);
      this.showContenedorGraficos = this.showContenedorGraficos.bind(this);
      this.hideContenedorGraficos = this.hideContenedorGraficos.bind(this);
  }



  componentDidMount () {

        this._isMounted = true;

        var url = new URL("http://localhost:8000/api/colmenas/dashboard");
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
            

            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log('Tarjetas', data); 

            this.setState({ 
                datosColmena : data['datos'],
            });

            document.getElementById("txt-colmenas-verde").innerHTML = data['datos']['verde'];
            document.getElementById("txt-colmenas-amarillo").innerHTML = data['datos']['amarillo'];
            document.getElementById("txt-colmenas-rojo").innerHTML = data['datos']['rojo']; 
            
            document.getElementById("div-row-estadisticas").style.pointerEvents = "all";
            document.getElementById("div-row-estadisticas").style.opacity = 1;

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed: get apiarios por ciudad", error);
            //alert("Ha ocurrido un error: " + error);
        });

    }

    handleClickBtnRawson(event) {
      var display = document.getElementById("div-apiarios-rawson").style.display;
      if( display == "none" ) {
        document.getElementById("div-apiarios-rawson").style.display = "block";
      }
      else {
        document.getElementById("div-apiarios-rawson").style.display = "none";
      }
    }
 
    /**
     * Muestra/Oculta el div que contiene los apiarios de Trelew.
     * @param {*} event 
     */
    handleClickBtnTrelew(event) {
        var display = document.getElementById("div-apiarios-trelew").style.display;
        if( display == "none" ) {
          document.getElementById("div-apiarios-trelew").style.display = "block";
        }
        else {
          document.getElementById("div-apiarios-trelew").style.display = "none";
        }
    }

    /**
     * Muestra/Oculta el div que contiene los apiarios de Gaiman.
     * @param {*} event 
     */
    handleClickBtnGaiman(event) {
        var display = document.getElementById("div-apiarios-gaiman").style.display;
        if( display == "none" ) {
          document.getElementById("div-apiarios-gaiman").style.display = "block";
        }
        else {
          document.getElementById("div-apiarios-gaiman").style.display = "none";
        }
    }


    /**
     * Muestra/Oculta el div que contiene los apiarios de Dolavon.
     * @param {*} event 
     */
    handleClickBtnDolavon(event) {
        var display = document.getElementById("div-apiarios-dolavon").style.display;
        if( display == "none" ) {
          document.getElementById("div-apiarios-dolavon").style.display = "block";
        }
        else {
          document.getElementById("div-apiarios-dolavon").style.display = "none";
        }
    }

    /**
     * Muestra/Oculta el div que contiene los apiarios de 28 de Julio.
     * @param {*} event 
     */
    handleClickBtn28deJulio(event) {
        var display = document.getElementById("div-apiarios-28-de-julio").style.display;
        if( display == "none" ) {
          document.getElementById("div-apiarios-28-de-julio").style.display = "block";
        }
        else {
          document.getElementById("div-apiarios-28-de-julio").style.display = "none";
        }
    }

    /*
    showContenedorGraficos(event) {
        this.setState({
          showContenedorGraficos: true
        });
    } */


    showContenedorGraficos = (apiario_id, direccion_chacra, variable) => {
      console.log("jlfad",apiario_id, variable);
      this.setState({
        showContenedorGraficos: true,
        apiario: apiario_id,
        direccion_chacra : direccion_chacra,
        variable : variable,
      });
    }


    hideContenedorGraficos = () => {
      this.setState({
        showContenedorGraficos: false,
        apiario: [],
        direccion_chacra : "",
        variable : "",
      });
      this.componentDidMount();
      // window.location.reload(true); // BUSCAR FORMA ALTERNATIVA DE NO CARGAR TODO DE NUEVO!!!....
    }


    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    render() {

        if( this.state.showContenedorGraficos ) {
            return (
                <ContenedorGraficos apiario={this.state.apiario} variable={this.state.variable} direccion_chacra={this.state.direccion_chacra} actionHide={this.hideContenedorGraficos} />
            )
        }
     
        return (
          

            <div>
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <h1>
                          Bienvenido
                          <br/>
                          <small>Página Principal</small>
                          <hr/>
                        </h1>
                        <ol className="breadcrumb">
                          <li><a href="#"><i className="fa fa-home" /> Inicio</a></li>
                          <li className="active"><a href="#">Home</a></li>
                        </ol>
                    </section>
                    {/* Main content */}
                    <section className="content">


                      {/* ----------------------------- ESTADÍSTICAS ------------------------------  */}
                      <div id={"div-row-estadisticas"} className="row" style={{pointerEvents: 'none', opacity: 0.8}}>
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-green">
                                <div className="inner">
                                  <h3 id="txt-colmenas-verde"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
                                  <p>Colmenas en buen estado</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-check" />
                                </div>
                                {/* <a className="small-box-footer">
                                  <Link to="/colmenas/consultar" value={"colmenas_consultar"} data-key={"abcde"}>More info <i className="fa fa-arrow-circle-right" /></Link>
                                </a> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alerta/home",state:{estado:"verde",totales:this.state.datosColmena['verde']}}} style={{  color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcde"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-yellow">
                                <div className="inner">
                                  <h3 id="txt-colmenas-amarillo"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en alerta</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-dot-circle-o" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alerta/home",state:{estado:"amarillo",totales:this.state.datosColmena['amarillo']}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcdefg"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>
                            {/* ./col */}
                            <div className="col-lg-4 col-xs-4">
                              {/* small box */}
                              <div className="small-box bg-red">
                                <div className="inner">
                                  <h3 id="txt-colmenas-rojo"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
                                  <p>Colmenas en peligro</p>
                                </div>
                                <div className="icon">
                                  <i className="fa fa-times" />
                                </div>
                                {/* <div className="small-box-footer">More info <i className="fa fa-arrow-circle-right" /></div> */}
                                <div className="small-box-footer">
                                  <span><Link to={{pathname: "/alerta/home",state:{estado:"rojo",totales:this.state.datosColmena['rojo']}}} style={{ color:"rgba(255,255,255,0.8)" }} value={"colmenas_consultar"} data-key={"abcdef"}>Ver Detalle <i className="fa fa-arrow-circle-right" /></Link></span>
                                </div>
                              </div>
                            </div>{/* ./col */}
                      </div> {/* ./row */}


                        
                      {/* ----------------------------- MAPA APIARIO ------------------------------  */}
                      
                      <MapaApiarios />



                      {/* ----------------------------- RAWSON ------------------------------  */}

                      <div className="row">
                        <div className="col-xs-12">
                          
                            {/* <button id="btn-rawson" onClick={this.handleClickBtnRawson} type="button" className="btn btn-sm btn-flat btn-box-tool btn-success pull-right"><i className="fa fa-lg fa-chevron-down" style={{color:'black'}} /></button> */}
                            {/* Rawson  */}
                            <div id="div-clima-rawson">
                                <Clima ciudad={"Rawson"} />
                            </div> 
                                 
                            <div id="div-apiarios-rawson">
                                {/* Apiarios Rawson  */}
                                <ContenedorApiario ciudad={"Rawson"} action={this.showContenedorGraficos}  />
                            </div>{/* Fin Rawson  */}

                        </div>{/* /.col */}
                      </div>{/* /.row */}

                      {/* ----------------------------- TRELEW ------------------------------  */}

                      <div className="row">
                        <div className="col-xs-12">
                          
                            {/* <button id="btn-trelew" onClick={this.handleClickBtnTrelew} type="button" className="btn btn-sm btn-flat btn-box-tool btn-success pull-right"><i className="fa fa-lg fa-chevron-down" style={{color:'black'}} /></button> */}
                            {/* Trelew  */}
                            <div id="div-clima-trelew">
                                <Clima ciudad={"Trelew"} />
                            </div> 
                                 
                            <div id="div-apiarios-trelew">
                                {/* Apiarios Trelew  */}
                                <ContenedorApiario ciudad={"Trelew"} action={this.showContenedorGraficos}  />
                            </div>{/* Fin Trelew  */}

                        </div>{/* /.col */}
                      </div>{/* /.row */}



                     {/* ----------------------------- GAIMAN ------------------------------  */}                           
                      <div className="row">
                        <div className="col-xs-12">

                                {/* <button id="btn-gaiman" onClick={this.handleClickBtnGaiman} type="button" className="btn btn-sm btn-flat btn-box-tool btn-success pull-right"><i className="fa fa-lg fa-chevron-down" style={{color:'black'}} /></button> */}
                                {/* Gaiman  */}
                                <div id="div-clima-gaiman">
                                    <Clima ciudad={"Gaiman"} />
                                </div> 
                                 
                                <div id="div-apiarios-gaiman">
                                    {/* Apiarios Gaiman  */}
                                    <ContenedorApiario ciudad={"Gaiman"} action={this.showContenedorGraficos} />
                                </div> {/* Fin Gaiman  */}
                       
                          </div>{/* /.col */}
                      </div>{/* /.row */}



                      {/* ----------------------------- DOLAVON ------------------------------  */}                              
                      <div className="row">
                        <div className="col-xs-12">
                                
                                {/* <button id="btn-dolavon" onClick={this.handleClickBtnDolavon} type="button" className="btn btn-sm btn-flat btn-box-tool btn-success pull-right"><i className="fa fa-lg fa-chevron-down" style={{color:'black'}} /></button> */}
                                {/* Dolavon  */}
                                <div id="div-clima-dolavon">
                                    <Clima ciudad={"Dolavon"} />
                                </div> 
                                 
                                <div id="div-apiarios-dolavon"> 
                                    <ContenedorApiario ciudad={"Dolavon"} action={this.showContenedorGraficos} />
                                </div> {/* Fin Dolavon  */}
                       
                          </div>{/* /.col */}
                      </div>{/* /.row */}




                      {/* ----------------------------- 28 DE JULIO ------------------------------  */}                                
                      <div className="row">
                        <div className="col-xs-12">

                                {/* <button id="btn-28-de-julio" onClick={this.handleClickBtn28deJulio} type="button" className="btn btn-sm btn-flat btn-box-tool btn-success pull-right"><i className="fa fa-lg fa-chevron-down" style={{color:'black'}} /></button> */}
                                {/* 28 de Julio  */}
                                <div id="div-clima-28-de-julio">
                                    <Clima ciudad={"28 de Julio"} />
                                </div>    
                                <div id="div-apiarios-28-de-julio">
                                    <ContenedorApiario ciudad={"28 de Julio"} action={this.showContenedorGraficos} />
                                </div> {/* Fin 28 de Julio  */}
                       
                          </div>{/* /.col */}
                      </div>{/* /.row */}






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
export default connect(null,mapDispatchToProps)(Home)