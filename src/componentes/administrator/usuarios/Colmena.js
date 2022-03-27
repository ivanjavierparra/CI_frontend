import React, { Component } from 'react';

import cookie from 'js-cookie';




export default class Colmena extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;      
        this.abortController = new window.AbortController();

        this.state = {
            apiario : this.props.apiario,
            colmena : this.props.colmena,
            ultima_revisacion : [],
            datos : [],
        }

        // Methods
        this.completarCampos = this.completarCampos.bind(this);
        this.descompletarCampos = this.descompletarCampos.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }


    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            apiario : nextProps.apiario,
            colmena : nextProps.colmena,
        }, () => this.componentDidMount() ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }

    





    

    /**
     * Cuando se inicializa el componente se hace una llamada AJAX para obtener las temperaturas, humedades y
     * demás datos que necesita el Chart para crearse, como los labels, y backgroundColors.
     * 
     */
    componentDidMount() {

        this._isMounted = true;
        console.log("colmenita",this.state.colmena);
      
        var url = new URL("http://localhost:8000/api/colmena/detalle/tyh");
        var params = {
                        apiario_id: this.state.apiario, 
                        colmena_id: this.state.colmena['id'],
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

            this.setState(
            {
              ultima_revisacion : data[0],
              
            }, function() {

                if( data.length == 0 ) {this.descompletarCampos(); return;}
                this.completarCampos(this.state.ultima_revisacion);
                if( data[1] != "" ) {
                  document.getElementById("txt-msj-" + this.state.colmena['id']).style.display = "block";
                  document.getElementById("txt-msj-" + this.state.colmena['id']).innerText = data[1];
                }
                else{
                  document.getElementById("txt-msj-temperatura-" + this.state.colmena['id']).style.display = "flex";
                  document.getElementById("txt-msj-temperatura-" + this.state.colmena['id']).innerText = data[2];
                  document.getElementById("txt-msj-humedad-" + this.state.colmena['id']).style.display = "flex";
                  document.getElementById("txt-msj-humedad-" + this.state.colmena['id']).innerText = data[3];
                }
                document.getElementById("spinner-estado-colmenas-" + this.state.colmena['id']).style.display = "none";
              
            });
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error", error);
            //alert("Ha ocurrido un error: " + error);
        });
    }


    completarCampos(revisacion) {
        // Acá voy seteando los valors..
        document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerText = revisacion['temperatura'] + "°C";
        document.getElementById("txt-humedad-" + this.state.colmena['id']).innerText = revisacion['humedad'] + "%";
        document.getElementById("txt-fecha-revisacion-" + this.state.colmena['id']).innerText = "*Fecha de actualización: " + revisacion['fecha_revisacion'].split("-")[2]+"-"+revisacion['fecha_revisacion'].split("-")[1]+"-"+revisacion['fecha_revisacion'].split("-")[0] + " - " + revisacion['hora_revisacion'].substr(0,5) + " hs.";
    }

    descompletarCampos() {
      document.getElementById("txt-temperatura-" + this.state.colmena['id']).innerText = "---";
      document.getElementById("txt-humedad-" + this.state.colmena['id']).innerText = "---";
      document.getElementById("txt-fecha-revisacion-" + this.state.colmena['id']).innerText = "*Fecha de actualización: ---";
    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }
    
    handleClickCollapse(event) {
      var id = "box-body-colmena-" + this.state.colmena['id'];
      var display = document.getElementById(id).style.display;
      if( display == "none" ) {
        document.getElementById(id).style.display = "block";
      }
      else {
        document.getElementById(id).style.display = "none";
      }
    }

    render() {
        
        

        return (
            
                <div className="col-md-6">
                  
          {/* LINE CHART */}
          <div className="box box-primary">
            <div className="box-header with-border">
            <h3 className="box-title">Colmena N° {this.state.colmena['identificacion']}</h3>
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
            <div id={"box-body-colmena-" + this.state.colmena['id']} className="box-body">

                  <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block border-right">
                              <span className="description-percentage text-red"><i className="fa fa-thermometer-full fa-3x fa-fw" /> </span>
                              <h5 id={"txt-temperatura-" + this.state.colmena['id']} className="description-header"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h5>
                              <span className="description-text">Temperatura</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                        <div className="col-sm-3 col-xs-6">
                            <div className="description-block">
                              <span className="description-percentage text-blue"><i className="fa fa-tint fa-3x fa-fw" /> </span>
                              <h5 id={"txt-humedad-" + this.state.colmena['id']} className="description-header"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h5>
                              <span className="description-text">Humedad</span>
                            </div> {/* /.description-block */}
                        </div> {/* /.col */}
                  </div>
                  <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                      <small><span id={"txt-fecha-revisacion-" + this.state.colmena['id']}> *Fecha de actualización: <i className="fa fa-spinner fa-pulse fa-sm fa-fw" />  </span></small>
                  </div> {/* /.row */}
                  
                  <hr />

                  <strong><i className="fa fa-book margin-r-5" /> Estado </strong>
                  <i id={"spinner-estado-colmenas-" + this.state.colmena['id']} className="fa fa-spinner fa-pulse fa-sm fa-fw" />
                  <p id={"txt-msj-" + this.state.colmena['id']} className="text-muted" style={{display:"none"}}> { " " } </p>
                  <p id={"txt-msj-temperatura-" + this.state.colmena['id']} className="text-muted" style={{display:"none"}}> { " " } </p>
                  <p id={"txt-msj-humedad-" + this.state.colmena['id']} className="text-muted" style={{display:"none"}}> { " " } </p>
                  
                  <hr />
          
                  <strong><i className="fa fa-book margin-r-5" /> Identificación </strong>
                  <p id={"txt-identificacion-" + this.state.colmena['id']} className="text-muted">
                      {this.state.colmena['identificacion'] || ''}
                  </p>
                  <hr />

                  <strong><i className="fa fa-book margin-r-5" /> Raza Abeja </strong>
                  <p id={"txt-identificacion-" + this.state.colmena['id']} className="text-muted">
                      {this.state.colmena['raza_abeja'] || ''}
                  </p>
                  <hr />

                  <strong><i className="fa fa-book margin-r-5" /> Fecha de Creación </strong>
                  <p id={"txt-fecha-creacion-" + this.state.colmena['id']} className="text-muted">
                      {this.state.colmena['fecha_creacion'].split("-")[2]+"-"+this.state.colmena['fecha_creacion'].split("-")[1]+"-"+this.state.colmena['fecha_creacion'].split("-")[0]}
                  </p>
                  <hr />

                  <strong><i className="fa fa-book margin-r-5" /> Descripción </strong>
                  <p id={"txt-descripcion-" + this.state.colmena['id']} className="text-muted">
                      { this.state.colmena['descripcion'] || '' }
                  </p>
                        


            </div> {/* /.box-body */}

            {/* Footer del Box
            <div className="box-footer" style={{backgroundColor:"rgba(0,0,0,.03)"}}>
                <div className="row" style={{display: 'flex', justifyContent: 'center'}}>
                  <div className="col-sm-3 col-xs-6">
                    <div className="description-block border-right">
                      <span className="description-percentage text-red"><i className="fa fa-thermometer-full fa-3x fa-fw" /> </span>
                      <h5 className="description-header">35°C</h5>
                      <span className="description-text">Temperatura</span>
                    </div>
                    {/* /.description-block */}
                {/*   </div>
                  {/* /.col */}
              {/*     <div className="col-sm-3 col-xs-6">
                    <div className="description-block">
                      <span className="description-percentage text-blue"><i className="fa fa-tint fa-3x fa-fw" /> </span>
                      <h5 className="description-header">60%</h5>
                      <span className="description-text">Humedad</span>
                    </div> {/* /.description-block */}
                {/*   </div> {/* /.col */}
              {/*   </div> {/* /.row */}
        {/*  </div> {/* /.box-footer */}
                  


          </div> {/* /.box */}
        {/* /.col (LEFT) */}
        </div> 
       




                
                
           
        );
    }
}
