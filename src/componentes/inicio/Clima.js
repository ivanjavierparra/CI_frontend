import React, { Component } from 'react'
import cookie from 'js-cookie';
export default class Clima extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        //init controller
        this.abortController = new window.AbortController();

        this.state = {
            ciudad : this.props.ciudad,
            clima : [],
        }

        // Methods
        this.setearDatos = this.setearDatos.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
        this.getNombreDiv = this.getNombreDiv.bind(this);
    }

    componentDidMount () {

        this._isMounted = true;
        
        var url = new URL("http://localhost:8000/api/clima/ciudad/dashboard");
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
                return;
            }

            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 

            this.setState({ 
                clima : data,
            });

            if( !data ) return;
            this.setearDatos(data);            

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed: get apiarios por ciudad", error);
            //alert("Ha ocurrido un error: " + error);
        });
    }


    setearDatos(data) {
        try{

        
            var f_y_hs = data['fecha'].split("-")[2]+"-"+data['fecha'].split("-")[1]+"-"+data['fecha'].split("-")[0]+" "+data['hora'].substr(0,5);
            document.getElementById("txt-actualizacion-" + this.state.ciudad).innerText = f_y_hs;
            document.getElementById("txt-descripcion-" + this.state.ciudad).innerText = data['descripcion'] + ". Horas de sol: " + parseFloat(data['horas_de_sol']).toFixed(1) + " horas.";
            document.getElementById('txt-temperatura-minima-' + this.state.ciudad).innerText = parseFloat(data['temperatura_minima']).toFixed(0);
            document.getElementById('txt-temperatura-maxima-' + this.state.ciudad).innerText = parseFloat(data['temperatura_maxima']).toFixed(0) + "°C / " + parseFloat(data['temperatura']).toFixed(0);
            document.getElementById('txt-humedad-' + this.state.ciudad).innerText = parseFloat(data['humedad']).toFixed(0);
            document.getElementById('txt-velocidad-viento-' + this.state.ciudad).innerText = parseFloat(data['velocidad_del_viento_km_hs']).toFixed(0);
            document.getElementById('txt-direccion-viento-' + this.state.ciudad).innerText = data['direccion_del_viento'];
            document.getElementById('txt-presion-' + this.state.ciudad).innerText = parseFloat(data['presion_hpa']).toFixed(0);
        }
        catch(e) {
            console.log("Hay un error capo", e);
        }
    }


    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    getNombreDiv() {
        if ( this.state.ciudad == "Rawson") return "div-apiarios-rawson";
        if ( this.state.ciudad == "Trelew") return "div-apiarios-trelew";
        if ( this.state.ciudad == "Gaiman") return "div-apiarios-gaiman";
        if ( this.state.ciudad == "Dolavon") return "div-apiarios-dolavon";
        if ( this.state.ciudad == "28 de Julio") return "div-apiarios-28-de-julio";
    }

    handleClickCollapse(event) {
        var div_apiarios = this.getNombreDiv();
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
            <div>
                {/* Título  */}
                <div className="row">
                <div className="col-md-12">
                  <div className="box box-success box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title"><i className="fa fa-street-view fa-fw" /> {this.state.ciudad}</h3>
                        <div className="box-tools pull-right">
                            <button type="button" className="btn btn-box-tool" onClick={this.handleClickCollapse} data-widget="collapse"><i className="fa fa-chevron-down" /> </button>
                        </div>
                    </div>
                    <div className="box-body">
                            <p> <i className="fa fa-sun-o fa-fw" /> <strong>Descripción:</strong> <span id={"txt-descripcion-" + this.state.ciudad}> <i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span></p>
                            <p><i className="fa fa-calendar-plus-o" aria-hidden="true"></i> <strong> Última actualización:</strong> <span id={"txt-actualizacion-" + this.state.ciudad}> <i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </p>
                    </div>
                  </div>
                </div>
                </div>

                {/* <div className="callout callout-info"> */}
                {/* <div className="callout callout-info">
                    <h4> <i className="fa fa-street-view fa-fw" /> {this.state.ciudad} <small className="pull-right" style={{color:'floralwhite'}}><b><i className="fa fa-calendar-plus-o" aria-hidden="true"></i> Última actualización: <span id={"txt-actualizacion-" + this.state.ciudad}> <i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span> </b></small></h4>
                    <hr />
                    <p> <i className="fa fa-sun-o fa-fw" /> <span id={"txt-descripcion-" + this.state.ciudad}> <i className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </span></p>
                </div> */}

                {/* Datos */}
                <div className="row">
                    
                    {/* Temperatura */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-thermometer-full" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Mín. / Máx. / Actual</span>
                                <span className="info-box-number">  <span id={"txt-temperatura-minima-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span><small>°C</small> / <span id={"txt-temperatura-maxima-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span><small>°C</small></span>
                            </div>
                            {/* /.info-box-content */}
                        </div>
                    {/* /.info-box */}
                    </div>  {/* /.col */}
                   
                    {/* Humedad */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-tint" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Humedad</span>
                                <span className="info-box-number"><span id={"txt-humedad-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span><small>%</small></span>
                            </div>
                            {/* /.info-box-content */}
                        </div>
                    {/* /.info-box */}
                    </div> {/* /.col */}
                    
                    {/* fix for small devices only */}
                    <div className="clearfix visible-sm-block" />

                    {/* Vientos */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-mixcloud" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Viento</span>
                                <span className="info-box-number"><span id={"txt-velocidad-viento-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span><small>&nbsp;km/h</small></span>
                                <small><span className="info-box-number"><span id={"txt-direccion-viento-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span></span></small>
                            </div>
                            {/* /.info-box-content */}
                        </div>
                        {/* /.info-box */}
                    </div> {/* /.col */}
                    
                    {/* Presión Atmosférica */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-info"><i className="fa fa-sort-amount-asc" /></span>
                            <div className="info-box-content">
                            <span className="info-box-text">Presión</span>
                            <span className="info-box-number"><span id={"txt-presion-" + this.state.ciudad}><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></span> <small>&nbsp;mbar</small></span>
                            </div>
                            {/* /.info-box-content */}
                        </div>
                        {/* /.info-box */}
                    </div> {/* /.col */}
                    
                </div>
                {/* /.CLIMA  */}
            </div>
        )
    }
}
