import React, { Component } from "react";
import cookie from 'js-cookie';
import { Link } from "react-router-dom";

export default class UltimosApicultores extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            apicultores: [],
            datos : {
              apicultores : ["","","","","","","",""],
              apiarios : ["","","","","","","",""],
              colmenas : ["","","","","","","",""],
            },
        }

        // Methods
        this.completarDatosApicultores = this.completarDatosApicultores.bind(this);
        this.procesar_fecha_hora = this.procesar_fecha_hora.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "http://localhost:8000/api/admin/users/lastusers";
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
                apicultores : data,
            }, () => {
              this.completarDatosApicultores(data);
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


    completarDatosApicultores(apicultores) {
        //li-apicultor-0  img-apicultor-0  txt-apicultor-nombre-0  txt-apicultor-fecha-0
        var beekeepers = ["","","","","","","",""];
        var apiarios = ["","","","","","","",""];;
        var colmenas = ["","","","","","","",""];;

        for( var i = 0; i < apicultores.length; i++ ) {
            
            document.getElementById("li-apicultor-" + i).style.display = "block";
            document.getElementById("img-apicultor-" + i).src = "http://localhost:8000/api/public/img/" + apicultores[i]['apicultor']['avatar'];
            document.getElementById("txt-apicultor-nombre-" + i).innerText = apicultores[i]['apicultor']['name'] + " " + apicultores[i]['apicultor']['lastname'];
            document.getElementById("txt-apicultor-fecha-" + i).innerText = this.procesar_fecha_hora(apicultores[i]['apicultor']['created_at']);

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
      var id = "box-body-ultimos-apicultores";
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
        {/* USERS LIST */}
        <div className="box box-danger">
          <div className="box-header with-border">
            <h3 className="box-title">Últimos Apicultores Registrados</h3>
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
          <div id="box-body-ultimos-apicultores" className="box-body no-padding">
            <ul className="users-list clearfix"> 
              <li style={{display:'none'}} id="li-apicultor-0">
                <img id="img-apicultor-0" style={{width:79.93, height:79.93}} src="dist/img/user1-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-0" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[0],apiarios:this.state.datos.apiarios[0],colmenas:this.state.datos.colmenas[0]}}}>
                  Alexander Pierce
                </Link> 
                <span id="txt-apicultor-fecha-0" className="users-list-date">Today</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-1">
                <img id="img-apicultor-1" style={{width:79.93, height:79.93}} src="dist/img/user8-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-1" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[1],apiarios:this.state.datos.apiarios[1],colmenas:this.state.datos.colmenas[1]}}}>
                  Norman
                </Link>
                <span id="txt-apicultor-fecha-1" className="users-list-date">Yesterday</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-2">
                <img id="img-apicultor-2" style={{width:79.93, height:79.93}} src="dist/img/user7-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-2" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[2],apiarios:this.state.datos.apiarios[2],colmenas:this.state.datos.colmenas[2]}}}>
                  Jane
                </Link>
                <span id="txt-apicultor-fecha-2" className="users-list-date">12 Jan</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-3">
                <img id="img-apicultor-3" style={{width:79.93, height:79.93}} src="dist/img/user6-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-3" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[3],apiarios:this.state.datos.apiarios[3],colmenas:this.state.datos.colmenas[3]}}}>
                  John
                </Link>
                <span id="txt-apicultor-fecha-3" className="users-list-date">12 Jan</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-4">
                <img id="img-apicultor-4" style={{width:79.93, height:79.93}} src="dist/img/user2-160x160.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-4" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[4],apiarios:this.state.datos.apiarios[4],colmenas:this.state.datos.colmenas[4]}}}>
                  Alexander
                </Link>
                <span id="txt-apicultor-fecha-4" className="users-list-date">13 Jan</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-5">
                <img id="img-apicultor-5" style={{width:79.93, height:79.93}} src="dist/img/user5-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-5" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[5],apiarios:this.state.datos.apiarios[5],colmenas:this.state.datos.colmenas[5]}}}>
                  Sarah
                </Link>
                <span id="txt-apicultor-fecha-5" className="users-list-date">14 Jan</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-6">
                <img id="img-apicultor-6" style={{width:79.93, height:79.93}} src="dist/img/user4-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-6" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[6],apiarios:this.state.datos.apiarios[6],colmenas:this.state.datos.colmenas[6]}}}>
                  Nora
                </Link>
                <span id="txt-apicultor-fecha-6" className="users-list-date">15 Jan</span>
              </li>
              <li style={{display:'none'}} id="li-apicultor-7">
                <img id="img-apicultor-7" style={{width:79.93, height:79.93}} src="dist/img/user3-128x128.jpg" alt="User Image" />
                <Link id="txt-apicultor-nombre-7" className="users-list-name" to={{pathname: "/admin/profile/apicultor",state:{apicultor:this.state.datos.apicultores[7],apiarios:this.state.datos.apiarios[7],colmenas:this.state.datos.colmenas[7]}}}>
                  Nadia
                </Link>
                <span id="txt-apicultor-fecha-7" className="users-list-date">15 Jan</span>
              </li>
            </ul>
            {/* /.users-list */}
          </div>
          {/* /.box-body */}
          <div className="box-footer text-center">
            <Link to="/admin/usuarios">
              Ver todos los usuarios
            </Link>
          </div>
          {/* /.box-footer */}
        </div>
        {/*/.box */}
      </div>
    );
  }
}
