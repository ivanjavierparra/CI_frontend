import React, { Component } from "react";
import cookie from 'js-cookie';

export default class Tarjetas extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apicultores : 0,
            apiarios : 0,
            colmenas : 0,
            revisaciones: 0,
        }

        // Methods
        
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/home/tarjetas";
        fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + cookie.get("token"),
        },
        signal: this.abortController.signal
        })
        .then(response => response.json())
        .then(data => {

            /* Si alguien modificó el token que está en las cookies entonces Laravel me responderá que el token es inválido, por lo que cerraré automáticamente la sesión */
            if ( typeof data.status !== 'undefined' ) {
                console.log("Modificaste el token....", data.status);
                cookie.remove("token");
                this.abortController.abort();
                return;
            }

            console.log(data);

           
            this.setState(
            {
                apicultores: data["apicultores"],
                apiarios: data["apiarios"],
                colmenas: data["colmenas"],
                revisaciones: data["revisaciones"],
            }, () => {
              document.getElementById("txt-tarjetas-apicultores").innerText = this.state.apicultores;
              document.getElementById("txt-tarjetas-apiarios").innerText = this.state.apiarios;
              document.getElementById("txt-tarjetas-colmenas").innerText = this.state.colmenas;
              document.getElementById("txt-tarjetas-revisaciones").innerText = this.state.revisaciones;
            });

            

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

  render() {
    return (
      <div className="row">
        <div className="col-lg-3 col-xs-6">
          {/* small box */}
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3 id="txt-tarjetas-apicultores"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Apicultores</p>
            </div>
            <div className="icon">
              <i className="fa fa-user" />
            </div>
            <a href="#" className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              <i className="fa fa-user" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-xs-6">
          {/* small box */}
          <div className="small-box bg-green">
            <div className="inner">
              <h3 id="txt-tarjetas-apiarios"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Apiarios</p>
            </div>
            <div className="icon">
              <i className="fa fa-map-marker" />
            </div>
            <a href="#" className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              <i className="fa fa-map-marker" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-xs-6">
          {/* small box */}
          <div className="small-box bg-yellow">
            <div className="inner">
              <h3 id="txt-tarjetas-colmenas"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Colmenas</p>
            </div>
            <div className="icon">
              <i className="fa fa-forumbee" />
            </div>
            <a href="#" className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-xs-6">
          {/* small box */}
          <div className="small-box bg-red">
            <div className="inner">
              <h3 id="txt-tarjetas-revisaciones"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Revisaciones</p>
            </div>
            <div className="icon">
              <i className="fa fa-thermometer-full" />
            </div>
            <a href="#" className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
      </div>
    );
  }
}
