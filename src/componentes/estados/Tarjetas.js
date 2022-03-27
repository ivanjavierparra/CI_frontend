import React, { Component } from "react";
import cookie from 'js-cookie';
import ModalColmenasEstados from "./ModalColmenasEstados";

export default class Tarjetas extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            verde : 0,
            amarillo : 0,
            rojo : 0,
            total: 0,
            isOpen: false,
            estado : "",
        }

        // Methods
        this.handleClickComenasBuenas = this.handleClickComenasBuenas.bind(this);
        this.handleClickComenasAlerta = this.handleClickComenasAlerta.bind(this);
        this.handleClickComenasPeligro = this.handleClickComenasPeligro.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "https://backendcolmenainteligente.herokuapp.com/api/colmenas/dashboard";
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
            // if ( typeof data.status !== 'undefined' ) {
            //     console.log("Modificaste el token....", data.status);
            //     cookie.remove("token");
            //     this.abortController.abort();
            //     return;
            // }

            console.log(data);

           
            this.setState(
            {
                verde: data["datos"]['verde'],
                amarillo: data["datos"]['amarillo'],
                rojo: data["datos"]['rojo'],
                total: data["cantidad_colmenas"],
            });

            document.getElementById("txt-colmenas-verde").innerHTML = data['datos']['verde'];
            document.getElementById("txt-colmenas-amarillo").innerHTML = data['datos']['amarillo'];
            document.getElementById("txt-colmenas-rojo").innerHTML = data['datos']['rojo'];

            document.getElementById("div-row-estadisticas").style.pointerEvents = "all";
            document.getElementById("div-row-estadisticas").style.opacity = 1;

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

    handleClickComenasBuenas(e) {
      e.preventDefault();
      console.log("hola");

        this.setState(
          {
              isOpen : true,
              estado: "verde",
          },
          function() { 
              
            // Naranja fanta...
              
          }
        );
    }


    handleClickComenasAlerta(e) {
      e.preventDefault();
      console.log("hola");

        this.setState(
          {
              isOpen : true,
              estado: "amarillo",
          },
          function() { 
              
            // Naranja fanta...
              
          }
        );
    }


    handleClickComenasPeligro(e) {
      e.preventDefault();
      console.log("hola");

        this.setState(
          {
              isOpen : true,
              estado: "rojo",
          },
          function() { 
              
            // Naranja fanta...
              
          }
        );
    }

  render() {
    return (
      <div id={"div-row-estadisticas"} className="row" style={{pointerEvents: 'none', opacity: 0.8}}>
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-green">
            <div className="inner">
              {/* <h3>{this.state.verde}</h3> */}
              <h3 id="txt-colmenas-verde"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /><sup style={{fontSize: 20}}></sup></h3>
              <p>Colmenas en Buen Estado</p>
            </div>
            <div className="icon">
              <i className="fa fa-check" />
            </div>
            <a href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasBuenas} className="small-box-footer">
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-yellow">
            <div className="inner">
              {/* <h3>
                {this.state.amarillo}
              </h3> */}
              <h3 id="txt-colmenas-amarillo"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Colmenas en Alerta</p>
            </div>
            <div className="icon">
              <i className="fa fa-dot-circle-o" />
            </div>
            <a href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasAlerta} className="small-box-footer">
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-red">
            <div className="inner">
              {/* <h3>{this.state.rojo}</h3> */}
              <h3 id="txt-colmenas-rojo"><i className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Colmenas en Peligro</p>
            </div>
            <div className="icon">
              <i className="fa fa-times" />
            </div>
            <a href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasPeligro} className="small-box-footer">
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <ModalColmenasEstados
          show = {this.state.isOpen}
          estado = {this.state.estado}
        />
      </div>
    );
  }
}
