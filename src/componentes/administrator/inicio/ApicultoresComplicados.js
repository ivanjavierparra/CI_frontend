import React, { Component } from "react";
import cookie from 'js-cookie';
import { Redirect } from 'react-router';

export default class ApicultoresComplicados extends Component {


    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            redirect : false,
            datos : [],
            apiario_id : 0,
        }

        // Methods
        this.completarTabla = this.completarTabla.bind(this);
        this.crearCeldaApiario = this.crearCeldaApiario.bind(this);
        this.crearCelda = this.crearCelda.bind(this);

        this.handleClickCollapse = this.handleClickCollapse.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/apiarios/complicados";
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

            console.log("Porcentaje Peligro", data);

           
            this.setState(
            {
                datos : data,
            }, () => {
              this.completarTabla(data);
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

    completarTabla(apiarios) {

        var tbody = document.getElementById("tbody-colmenas-en-peligro");
        
        for( var i = 0; i < apiarios.length; i++ ) {


            var apiario = apiarios[i]['apiario']['direccion_chacra'] + " - " + apiarios[i]['apiario']['nombre_fantasia'];
            var ciudad = apiarios[i]['apiario']['localidad_chacra'];
            var apicultor = apiarios[i]['apicultor']['name'] + " " + apiarios[i]['apicultor']['lastname'];
            var porcentaje = apiarios[i]['porcentaje'].toFixed(2) + "%" + " (De un total de " + apiarios[i]['colmenas'] + " colmenas)";
            
            var tr = document.createElement('tr');
            tr.appendChild(this.crearCeldaApiario(apiario));
            tr.appendChild(this.crearCelda(ciudad));
            tr.appendChild(this.crearCelda(apicultor));
            tr.appendChild(this.crearCelda(porcentaje));
            
            tbody.appendChild(tr);
        }
         
    }

    crearCeldaApiario(apiario) {
        var td = document.createElement('td');

        var a = document.createElement('a');
        a.href = "#";
        
        a.onclick = function() {
          console.log('here be dragons');
          var apiario_id = (apiario.split("-")[0]).trim();
          this.setState({ redirect : true, apiario_id : apiario_id }, () => {
            console.log(this.state.redirect);
          });
        }.bind(this);

        a.appendChild(document.createTextNode(apiario));
        
        td.appendChild(a);
        return td;
    }

    

    crearCelda(dato) {
        var td = document.createElement('td');
        var center = document.createElement('center');
        center.appendChild(document.createTextNode(dato));
        td.appendChild(center);
        return td;
    }

    handleClickCollapse(event) {
      var id = "box-body-apicultores-complicados";
      var display = document.getElementById(id).style.display;
      if( display == "none" ) {
        document.getElementById(id).style.display = "block";
      }
      else {
        document.getElementById(id).style.display = "none";
      }
    }
    
  render() {

    if (this.state.redirect) {
      return <Redirect push to={{pathname: "/admin/apiarios/detalle",state:{apiario_id:this.state.apiario_id}}} />;
    }

    return (
      <div className="col-md-6">
        <div className="box box-info">
          <div className="box-header with-border">
            <h3 className="box-title">Apiarios del VIRCH en Peligro</h3>
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
          <div id="box-body-apicultores-complicados" className="box-body">
            <div className="table-responsive">
              <table className="table no-margin">
                <thead>
                  <tr>
                    <th>Apiario</th>
                    <th>Ciudad</th>
                    <th>Apicultor</th>
                    <th>Porcentaje de Colmenas en Peligro</th>
                  </tr>
                </thead> 
                <tbody id="tbody-colmenas-en-peligro">
                  <tr id="tr-tr-0" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-0" href="pages/examples/invoice.html">OR9842</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-0" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-0" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-0" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-1" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-1" href="pages/examples/invoice.html">OR9842</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-1" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-1" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-1" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-2" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-2" href="pages/examples/invoice.html">OR9842</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-2" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-2" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-2" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-3" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-3" href="pages/examples/invoice.html">OR9843</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-3" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-3" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-3" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-4" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-4" href="pages/examples/invoice.html">OR9844</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-4" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-4" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-4" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-5" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-5" href="pages/examples/invoice.html">OR9845</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-5" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-5" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-5" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                  <tr id="tr-tr-6" style={{display:"none"}}>
                    <td>
                      <a id="txt-apiario-en-peligro-6" href="pages/examples/invoice.html">OR9846</a>
                    </td>
                    <td>
                        <span id="txt-ciudad-en-peligro-6" className="label label-success">Shipped</span>
                    </td>
                    <td>
                      <span id="txt-apicultor-en-peligro-6" className="label label-success">Shipped</span>
                    </td>
                    <td>
                        <span id="txt-porcentaje-en-peligro-6" className="label label-success">Shipped</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* /.table-responsive */}
          </div>
          {/* /.box-body */}
          {/* <div className="box-footer clearfix">
            <a
              href="javascript:void(0)"
              className="btn btn-sm btn-info btn-flat pull-left"
            >
              Place New Order
            </a>
            <a
              href="javascript:void(0)"
              className="btn btn-sm btn-default btn-flat pull-right"
            >
              View All Orders
            </a>
          </div> */}
          {/* /.box-footer */}
        </div>
      </div>
    );
  }
}
