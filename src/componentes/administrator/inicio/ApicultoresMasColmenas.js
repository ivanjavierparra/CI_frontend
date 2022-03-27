import React, { Component } from "react";
import cookie from 'js-cookie';
import { Link } from "react-router-dom";

export default class ApicultoresMasColmenas extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apicultores : [],
            datos : {
              apicultores : ["","","",""],
              apiarios : ["","","",""],
              colmenas : ["","","",""],
            }
        }

        // Methods
        this.procesar_fecha_hora = this.procesar_fecha_hora.bind(this);
        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "http://localhost:8000/api/admin/users/mascolmenas";
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
                
            }, () =>{
              this.procesarDatos(data);
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

    procesarDatos(apicultores) {
        
        var beekeepers = ["","","",""];
        var apiarios = ["","","",""];
        var colmenas = ["","","",""];

        for( var i = 0; i < apicultores.length; i++ ) {
            
            document.getElementById("li-apicultor-grande-" + i).style.display = "block";
            document.getElementById("img-apicultor-grande-" + i).src = "http://localhost:8000/api/public/img/" + apicultores[i]['apicultor']['avatar'];
            document.getElementById("txt-apicultor-grande-nombre-" + i).innerText = apicultores[i]['apicultor']['name'] + " " + apicultores[i]['apicultor']['lastname'];
            document.getElementById("txt-grande-cantidad-colmenas-" + i).innerText = apicultores[i]['colmenas'] + " colmenas";
            document.getElementById("txt-fecha-registro-apicultor-" + i).innerText = "Registrado el día " + this.procesar_fecha_hora(apicultores[i]['apicultor']['created_at']) ;
            
            beekeepers[i] = apicultores[i]['apicultor'];
            apiarios[i] = apicultores[i]['apiarios'];
            colmenas[i] = apicultores[i]['colmenas'];
        }

        this.setState({
          datos : {
            apicultores : beekeepers,
            apiarios : apiarios,
            colmenas : colmenas,
          } 
        });
    }

    procesar_fecha_hora(fecha_hora) {
      var fecha = fecha_hora.split(" ")[0];
      var hora = fecha_hora.split(" ")[1];

      fecha = fecha.split("-")[2] + "-" + fecha.split("-")[1] + "-" + fecha.split("-")[0];
      hora = hora.substr(0,5);

      return fecha + " " + hora;
    }

    handleClickCollapse(event) {
      var id = "box-body-apicultores-mas-colmenas";
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
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">Apicultores con más Colmenas</h3>
            <div className="box-tools pull-right">
              <button
                type="button"
                className="btn btn-box-tool"
                data-widget="collapse"
                onClick={this.handleClickCollapse}
              >
                <i className="fa fa-minus" />
              </button>
              <button
                type="button"
                className="btn btn-box-tool"
                data-widget="remove"
              >
                <i className="fa fa-times" />
              </button>
            </div>
          </div>
          {/* /.box-header */}
          <div id="box-body-apicultores-mas-colmenas" className="box-body">
            <ul className="products-list product-list-in-box">
              <li id="li-apicultor-grande-0" className="item" style={{display:"none"}}>
                <div className="product-img">
                  <img id="img-apicultor-grande-0" className="img-circle" src="dist/img/default-50x50.gif" alt="Product Image" />
                </div>
                <div className="product-info">
                  <Link id="txt-apicultor-grande-nombre-0" className="product-title" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[0],apiarios:this.state.datos.apiarios[0],colmenas:this.state.datos.colmenas[0]}}}>
                    Samsung TV
                    </Link>
                    <span id="txt-grande-cantidad-colmenas-0" className="label label-warning pull-right">
                      $1800
                    </span>
                  
                  <span id="txt-fecha-registro-apicultor-0" className="product-description">
                    Samsung 32" 1080p 60Hz LED Smart HDTV.
                  </span>
                </div>
              </li>
              {/* /.item */} 
              <li id="li-apicultor-grande-1" className="item" style={{display:"none"}}>
                <div className="product-img">
                  <img id="img-apicultor-grande-1" className="img-circle" src="dist/img/default-50x50.gif" alt="Product Image" />
                </div>
                <div className="product-info">
                  <Link id="txt-apicultor-grande-nombre-1" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[1],apiarios:this.state.datos.apiarios[1],colmenas:this.state.datos.colmenas[1]}}} className="product-title">
                    Bicycle
                  </Link>
                  <span id="txt-grande-cantidad-colmenas-1" className="label label-info pull-right">$700</span>
                  <span id="txt-fecha-registro-apicultor-1" className="product-description">
                    26" Mongoose Dolomite Men's 7-speed, Navy Blue.
                  </span>
                </div>
              </li>
              {/* /.item */}
              <li id="li-apicultor-grande-2" className="item" style={{display:"none"}}>
                <div className="product-img">
                  <img id="img-apicultor-grande-2" className="img-circle" src="dist/img/default-50x50.gif" alt="Product Image" />
                </div>
                <div className="product-info">
                  <Link id="txt-apicultor-grande-nombre-2" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[2],apiarios:this.state.datos.apiarios[2],colmenas:this.state.datos.colmenas[2]}}} className="product-title">
                    Xbox One{" "}
                  </Link>
                   <span id="txt-grande-cantidad-colmenas-2" className="label label-danger pull-right">$350</span>
                  <span id="txt-fecha-registro-apicultor-2" className="product-description">
                    Xbox One Console Bundle with Halo Master Chief Collection.
                  </span>
                </div>
              </li>
              {/* /.item */}
              <li id="li-apicultor-grande-3" className="item" style={{display:"none"}}>
                <div className="product-img">
                  <img id="img-apicultor-grande-3" className="img-circle" src="dist/img/default-50x50.gif" alt="Product Image" />
                </div>
                <div className="product-info">
                  <Link id="txt-apicultor-grande-nombre-3" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[3],apiarios:this.state.datos.apiarios[3],colmenas:this.state.datos.colmenas[3]}}} className="product-title">
                    PlayStation 4
                  </Link>
                  <span id="txt-grande-cantidad-colmenas-3" className="label label-success pull-right">$399</span>
                  <span id="txt-fecha-registro-apicultor-3" className="product-description">
                    PlayStation 4 500GB Console (PS4)
                  </span>
                </div>
              </li>
              {/* /.item */}
            </ul>
          </div>
          {/* /.box-body */}
          {/* <div className="box-footer text-center">
            <a href="javascript:void(0)" className="uppercase">
              View All Products
            </a>
          </div> */}
          {/* /.box-footer */}
        </div>
      </div>
    );
  }
}
