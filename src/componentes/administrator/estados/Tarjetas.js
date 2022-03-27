import React, { Component } from "react";
import cookie from 'js-cookie';
import AdminModalColmenas from "./AdminModalColmenas";

export default class Tarjetas extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            verde : 0,
            amarillo : 0,
            rojo : 0,
            estado: "",
            isOpen: false,
        }

        // Methods
        this.handleClickComenasBuenas = this.handleClickComenasBuenas.bind(this);
        this.handleClickComenasAlerta = this.handleClickComenasAlerta.bind(this);
        this.handleClickComenasPeligro = this.handleClickComenasPeligro.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/estados/contador/colmenas";
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
                verde: data["verde"],
                amarillo: data["amarillo"],
                rojo: data["rojo"],
            });

            document.getElementById("spinner_verde").style.display = "none";
            document.getElementById("spinner_amarillo").style.display = "none";
            document.getElementById("spinner_rojo").style.display = "none";
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
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
      <div className="row">
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-green">
            <div className="inner">
              <h3>{this.state.verde} <i id={"spinner_verde"} className="fa fa-spinner fa-pulse fa-sm fa-fw" /></h3>
              <p>Colmenas en Buen Estado</p>
            </div>
            <div className="icon">
              <i className="fa fa-check" />
            </div>
            <a href="#" href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasBuenas} className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-yellow">
            <div className="inner">
              <h3>
                {this.state.amarillo} <i id={"spinner_amarillo"} className="fa fa-spinner fa-pulse fa-sm fa-fw" />
              </h3>
              <p>Colmenas en Alerta</p>
            </div>
            <div className="icon">
              <i className="fa fa-dot-circle-o" />
            </div>
            <a href="#" href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasAlerta} className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-4 col-xs-6">
          {/* small box */}
          <div className="small-box bg-red">
            <div className="inner">
              <h3>{this.state.rojo} <i id={"spinner_rojo"} className="fa fa-spinner fa-pulse fa-sm fa-fw" /> </h3>
              <p>Colmenas en Peligro</p>
            </div>
            <div className="icon">
              <i className="fa fa-times" />
            </div>
            <a href="#" data-toggle="modal" href="#modal_modal_modal" onClick={this.handleClickComenasPeligro} className="small-box-footer">
              {/* More info <i className="fa fa-arrow-circle-right" /> */}
              Ver Detalle <i className="fa fa-forumbee" />
            </a>
          </div>
        </div>
        {/* ./col */}
        <AdminModalColmenas
          show = {this.state.isOpen}
          estado = {this.state.estado}
        />
      </div>
    );
  }
}
