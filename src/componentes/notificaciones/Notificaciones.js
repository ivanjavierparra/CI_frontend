import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MDBDataTable } from "mdbreact";
import { connect } from "react-redux";
import cookie from "js-cookie";
import moment from 'moment';
const $ = require("jquery");

var notificaciones_a_eliminar = [];
var filtro = "no leidas";
var categoria = "todas";

class Notificaciones extends Component {
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
      notificaciones_leidas : [],
      notificaciones_no_leidas : [],
      data: {
        columns: [
          {
            label: <span></span>,
            field: "eliminar_ckb", // con este campo identificamos las filas.
            sort: "asc",
            width: 150,
          },
          {
            label: <span></span>,
            field: "icono", // con este campo identificamos las filas.
            sort: "asc",
            width: 150,
          },
          {
            label: <span>Notificación</span>,
            field: "mensaje", // con este campo identificamos las filas.
            sort: "asc",
            width: 150,
          },
          // {
          //   label: <span>Apiario</span>,
          //   field: "apiario", // con este campo identificamos las filas.
          //   sort: "asc",
          //   width: 150,
          // },
          {
            label: <span>Fecha y Hora</span>,
            field: "fecha_hora",
            sort: "asc",
            width: 150,
          },
          {
            label: <span>Acciones</span>,
            field: "acciones",
            sort: "asc",
            width: 150,
          },
        ],
        rows: [
          {
            fecha_hora: (
              <div>
                {" "}
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
              </div>
            ),
          },
        ],
      },
    };
    

    // Asocio el metodo a la clase.
    this.handleClickNoLeidas = this.handleClickNoLeidas.bind(this);
    this.handleClickLeidas = this.handleClickLeidas.bind(this);

    this.buscarNotificaciones = this.buscarNotificaciones.bind(this);
    this.crearDataTable = this.crearDataTable.bind(this);
    this.handleClickBtnEliminar = this.handleClickBtnEliminar.bind(this);
    this.setEliminados = this.setEliminados.bind(this);
    this.eliminar_notificacion_arreglo = this.eliminar_notificacion_arreglo.bind(this);
    this.eliminacion_masiva = this.eliminacion_masiva.bind(this);
    this.actualizar_notificaciones = this.actualizar_notificaciones.bind(this);

    this.getNotificacionesTodas = this.getNotificacionesTodas.bind(this);
    this.getNotificacionesTemperatura = this.getNotificacionesTemperatura.bind(this);
    this.getNotificacionesHumedad = this.getNotificacionesHumedad.bind(this);
    this.getNotificacionesSenial = this.getNotificacionesSenial.bind(this);

  }


  componentDidMount () {

   this._isMounted = true;
   
   this.buscarNotificaciones();
     
  }


  buscarNotificaciones() {

      var url = 'http://localhost:8000/api/notificaciones/apicultor';     
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
            //this.props.logout();
            return;
          }

          console.log(data);

          this.setState(
              {
                  notificaciones_leidas : data['leidas'],
                  notificaciones_no_leidas : data['no_leidas'],
              },
              function() { 
                this.crearDataTable(data['no_leidas']);
              }
          ); 
          
          
          
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Request apiarios failed", error);
          //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
  }


  crearDataTable(notificaciones) {

    var datos = [];
    var columns = this.state.data.columns;

    if(  categoria == "todas"  ) {
        datos = this.getNotificacionesTodas(notificaciones);
    }
    else if(  categoria == "temperatura"  ) {
        datos = this.getNotificacionesTemperatura(notificaciones);
    }
    else if(  categoria == "humedad"  ) {
        datos = this.getNotificacionesHumedad(notificaciones);
    }
    else if(  categoria == "senial"  ) {
        datos = this.getNotificacionesSenial(notificaciones);
    }
    else {
      console.log("Categoria de notificacion no encontrada.");
    }
   
    this.setState(
      {
        data: { columns: columns, rows: datos },
        show: true
      },
      function() {
        
      }
    );
  }


  getNotificacionesTodas(notificaciones) {
      var datos = [];

      for (var i = 0; i < notificaciones.length; i++) {
        var row = {
          eliminar_ckb: <input id={"ckb-eliminar-" + notificaciones[i]['id']} onClick={this.setEliminados} type="checkbox"></input>,
          icono: <i className={notificaciones[i]['class'] + " " + notificaciones[i]['icono']}></i>,
          mensaje: notificaciones[i]['texto'],
          //apiario: "John Doe",
          fecha_hora: this.procesarFechaHora(notificaciones[i]['fecha'],notificaciones[i]['hora']),
          acciones: ( <center>
            <button
              id={"eliminar-" + notificaciones[i]["id"]}
              className="btn btn-danger btn-xs btn-flat fa fa-trash-o"
              onClick={this.handleClickBtnEliminar}
              data-toggle="tooltip"
              data-placement="top"
              title="Eliminar"
            ></button></center>
          ),
        };
  
        datos.push(row);
      }

      return datos;
  }

  getNotificacionesTemperatura(notificaciones) {
    var datos = [];

    for (var i = 0; i < notificaciones.length; i++) {
      if( notificaciones[i]['tipo'] != "temperatura" ) continue;
      var row = {
        eliminar_ckb: <input id={"ckb-eliminar-" + notificaciones[i]['id']} onClick={this.setEliminados} type="checkbox"></input>,
        icono: <i className={notificaciones[i]['class'] + " " + notificaciones[i]['icono']}></i>,
        mensaje: notificaciones[i]['texto'],
        //apiario: "John Doe",
        fecha_hora: this.procesarFechaHora(notificaciones[i]['fecha'],notificaciones[i]['hora']),
        acciones: ( <center>
          <button
            id={"eliminar-" + notificaciones[i]["id"]}
            className="btn btn-danger btn-xs btn-flat fa fa-trash-o"
            onClick={this.handleClickBtnEliminar}
            data-toggle="tooltip"
            data-placement="top"
            title="Eliminar"
          ></button></center>
        ),
      };

      datos.push(row);
    }

    return datos;
  }

  getNotificacionesHumedad(notificaciones) {
    var datos = [];

    for (var i = 0; i < notificaciones.length; i++) {
      if( notificaciones[i]['tipo'] != "humedad" ) continue;
      var row = {
        eliminar_ckb: <input id={"ckb-eliminar-" + notificaciones[i]['id']} onClick={this.setEliminados} type="checkbox"></input>,
        icono: <i className={notificaciones[i]['class'] + " " + notificaciones[i]['icono']}></i>,
          mensaje: notificaciones[i]['texto'],
        //apiario: "John Doe",
        fecha_hora: this.procesarFechaHora(notificaciones[i]['fecha'],notificaciones[i]['hora']),
        acciones: ( <center>
          <button
            id={"eliminar-" + notificaciones[i]["id"]}
            className="btn btn-danger btn-xs btn-flat fa fa-trash-o"
            onClick={this.handleClickBtnEliminar}
            data-toggle="tooltip"
            data-placement="top"
            title="Eliminar"
          ></button></center>
        ),
      };

      datos.push(row);
    }

    return datos;
  }

  getNotificacionesSenial(notificaciones) {
    var datos = [];

    for (var i = 0; i < notificaciones.length; i++) {
      if( notificaciones[i]['tipo'] != "senial" ) continue;
      var row = {
        eliminar_ckb: <input id={"ckb-eliminar-" + notificaciones[i]['id']} onClick={this.setEliminados} type="checkbox"></input>,
        icono: <i className={notificaciones[i]['class'] + " " + notificaciones[i]['icono']}></i>,
        mensaje: notificaciones[i]['texto'],
        //apiario: "John Doe",
        fecha_hora: this.procesarFechaHora(notificaciones[i]['fecha'],notificaciones[i]['hora']),
        acciones: ( <center>
          <button
            id={"eliminar-" + notificaciones[i]["id"]}
            className="btn btn-danger btn-xs btn-flat fa fa-trash-o"
            onClick={this.handleClickBtnEliminar}
            data-toggle="tooltip"
            data-placement="top"
            title="Eliminar"
          ></button></center>
        ),
      };

      datos.push(row);
    }

    return datos;
  }


  procesarFechaHora(fecha, hora)  {
    fecha = fecha.split("-")[2] + "-" + fecha.split("-")[1] + "-" + fecha.split("-")[0];
    hora = hora.substr(0,5);
    return fecha + " " + hora;
  }

  setEliminados(event){
   
    var id = event.target.id;
    var id_notificacion = id.split("-")[2];
    console.log(id_notificacion);

    if ( document.getElementById(id).checked ) {
      console.log("check");
      notificaciones_a_eliminar.push(id_notificacion);
    }
    else {
      console.log("no check");
      this.eliminar_notificacion_arreglo(id_notificacion);
    }
  }

  eliminar_notificacion_arreglo(id_notificacion) {

    var index = notificaciones_a_eliminar.indexOf(id_notificacion);
    if (index > -1) {
      notificaciones_a_eliminar.splice(index, 1);
    }

    console.log(notificaciones_a_eliminar);
  }

  handleClickBtnEliminar(event) {
    
    var result = window.confirm("Está a punto de eliminar una notificación. ¿Está seguro?");
    if (!result) return;

    var id = event.target.id;
    var id_notificacion = id.split("-")[1];
    console.log(id_notificacion);

    var url = new URL("http://localhost:8000/api/notificaciones/eliminar");
    var params = {
                    notificacion_id: id_notificacion,
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
          cookie.remove("token");
          this.abortController.abort();
          //this.props.logout();
          return;
        }

        console.log(data);

        this.setState(
            {
                notificaciones_leidas : data['leidas'],
                notificaciones_no_leidas : data['no_leidas'],
            },
            function() { 
              this.crearDataTable(data['no_leidas']);
            }
        ); 
        
        
        
    })
    .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request apiarios failed", error);
        //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
    });


  }


  eliminacion_masiva(event) {

    if( notificaciones_a_eliminar.length == 0 ) {alert("Seleccione notificaciones a eliminar."); return; }

    var result = window.confirm("Está a punto de eliminar notificaciones. ¿Está seguro?");
    if (!result) return;


    var url = new URL("http://localhost:8000/api/notificaciones/eliminar/masiva");
    var params = {
                    notificacion_id: JSON.stringify(notificaciones_a_eliminar),
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
          cookie.remove("token");
          this.abortController.abort();
          //this.props.logout();
          return;
        }

        console.log(data);

        notificaciones_a_eliminar = [];

        this.setState(
            {
                notificaciones_leidas : data['leidas'],
                notificaciones_no_leidas : data['no_leidas'],
            },
            function() { 
              this.crearDataTable(data['no_leidas']);
            }
        ); 
        
        
        
    })
    .catch(function(error) {
        if (error.name === "AbortError") return;
        console.log("Request apiarios failed", error);
        //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
    });

  }

  actualizar_notificaciones(event) {
    
    notificaciones_a_eliminar = [];
    window.location.reload(true);
  }




  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }

  handleClickNoLeidas(event) {
      document.getElementById("li-no-leidas").className = "active";
      document.getElementById("icon-no-leidas").className = "fa fa-envelope";

      document.getElementById("li-leidas").className = "";
      document.getElementById("icon-leidas").className = "fa fa-envelope-open-o";

      notificaciones_a_eliminar = [];
      filtro = "no leidas";
      this.crearDataTable(this.state.notificaciones_no_leidas);
  }


  handleClickLeidas(event) {
      document.getElementById("li-no-leidas").className = "";
      document.getElementById("icon-no-leidas").className = "fa fa-envelope-o";

      document.getElementById("li-leidas").className = "active";
      document.getElementById("icon-leidas").className = "fa fa-envelope-open";

      notificaciones_a_eliminar = [];
      filtro = "leidas";
      this.crearDataTable(this.state.notificaciones_leidas);
  }



  handleClickTodas = e => {
    
    console.log("todas");

    this.desactivarCategorias();
    document.getElementById("li-notificacion-todas").className = "active";
    document.getElementById("icon-notificacion-todas").className = "fa fa-check-square";
    categoria = "todas";

    if(  filtro == "no leidas"  ) {
      this.crearDataTable(this.state.notificaciones_no_leidas);
    }
    else {
      this.crearDataTable(this.state.notificaciones_leidas);
    }

  };

  handleClickTemperatura = e => {
    
    console.log("temperatura");

    this.desactivarCategorias();
    document.getElementById("li-notificacion-temperatura").className = "active";
    document.getElementById("icon-notificacion-temperatura").className = "fa fa-check-square";
    categoria = "temperatura";

    if(  filtro == "no leidas"  ) {
      this.crearDataTable(this.state.notificaciones_no_leidas);
    }
    else {
      this.crearDataTable(this.state.notificaciones_leidas);
    }
  };

  handleClickHumedad = e => {
    
    console.log("Humedad");

    this.desactivarCategorias();
    document.getElementById("li-notificacion-humedad").className = "active";
    document.getElementById("icon-notificacion-humedad").className = "fa fa-check-square";
    categoria = "humedad";

    if(  filtro == "no leidas"  ) {
      this.crearDataTable(this.state.notificaciones_no_leidas);
    }
    else {
      this.crearDataTable(this.state.notificaciones_leidas);
    }
  };

  handleClickSenial = e => {
    
    console.log("Senial");
    this.desactivarCategorias();
    document.getElementById("li-notificacion-senial").className = "active";
    document.getElementById("icon-notificacion-senial").className = "fa fa-check-square";
    categoria = "senial";

    if(  filtro == "no leidas"  ) {
      this.crearDataTable(this.state.notificaciones_no_leidas);
    }
    else {
      this.crearDataTable(this.state.notificaciones_leidas);
    }
  };


  desactivarCategorias = () => {

    document.getElementById("li-notificacion-todas").className = "";
    document.getElementById("li-notificacion-temperatura").className = "";
    document.getElementById("li-notificacion-humedad").className = "";
    document.getElementById("li-notificacion-senial").className = "";

    document.getElementById("icon-notificacion-todas").className = "fa fa-check-square-o";
    document.getElementById("icon-notificacion-temperatura").className = "fa fa-check-square-o";
    document.getElementById("icon-notificacion-humedad").className = "fa fa-check-square-o";
    document.getElementById("icon-notificacion-senial").className = "fa fa-check-square-o";
  }
  

  render() {
    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>
              Notificaciones
              <br />
              <small>Todas las Notificaciones</small>
              <hr />
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-bell" /> Notificaciones
                </a>
              </li>
              <li className="active">
                <a href="#">Todas las Notificaciones</a>
              </li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-3">
                <div className="row">
                    <div className="col-md-12">
                      <div className="box box-solid">
                        <div className="box-header with-border">
                          <h3 className="box-title">Filtros</h3>
                          <div className="box-tools">
                            <button
                              type="button"
                              className="btn btn-box-tool"
                              data-widget="collapse"
                            >
                              <i className="fa fa-minus" />
                            </button>
                          </div>
                        </div>
                        <div className="box-body no-padding">
                          <ul className="nav nav-pills nav-stacked">
                            <li id="li-no-leidas" className="active" onClick={this.handleClickNoLeidas}>
                              <a href="#">
                                <i id="icon-no-leidas" className="fa fa-envelope"/> No Leídas
                                {this.state.notificaciones_no_leidas.length > 0 ? 
                                <span className="label label-primary pull-right">
                                  {this.state.notificaciones_no_leidas.length}
                                </span>
                                : ""
                                }
                              </a>
                            </li>
                            <li id="li-leidas" onClick={this.handleClickLeidas}>
                              <a href="#">
                                <i id="icon-leidas" className="fa fa-envelope-open-o" /> Leídas
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* /.box-body */}
                      </div>
                      {/* /. box */}
                    </div>
                    {/* /. col */}
                    <div className="col-md-12">
                      <div className="box box-solid">
                        <div className="box-header with-border">
                          <h3 className="box-title">Categorías</h3>
                          <div className="box-tools">
                            <button
                              type="button"
                              className="btn btn-box-tool"
                              data-widget="collapse"
                            >
                              <i className="fa fa-minus" />
                            </button>
                          </div>
                        </div>
                        <div className="box-body no-padding">
                          <ul className="nav nav-pills nav-stacked">
                            <li id={"li-notificacion-todas"} className="active" value={"li-notificacion-todas"} onClick={this.handleClickTodas}>
                              <a href="#">
                                <i id={"icon-notificacion-todas"} className="fa fa-check-square"/> Todas
                              </a>
                            </li>
                            <li id={"li-notificacion-temperatura"} value={"li-notificacion-temperatura"} onClick={this.handleClickTemperatura}>
                              <a href="#">
                                <i id={"icon-notificacion-temperatura"} className="fa fa-check-square-o" /> Temperatura
                              </a>
                            </li>
                            <li id={"li-notificacion-humedad"} value={"li-notificacion-humedad"} onClick={this.handleClickHumedad}>
                              <a href="#">
                                <i id={"icon-notificacion-humedad"} className="fa fa-check-square-o" /> Humedad
                              </a>
                            </li>
                            <li id={"li-notificacion-senial"} value={"li-notificacion-senial"} onClick={this.handleClickSenial}>
                              <a href="#">
                                <i id={"icon-notificacion-senial"} className="fa fa-check-square-o" /> Señal
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* /.box-body */}
                      </div>
                      {/* /. box */}
                    </div>
                    {/* /. col */}
                </div>
                {/* /. row */}                     
              </div>
              {/* /. col */}
              <div className="col-md-9">
                {/* Aca comienza la tabla */}
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Notificaciones</h3>
                    <button type="button" onClick={this.eliminacion_masiva} className="btn btn-danger btn-flat btn-xs pull-right"><strong><i className="fa fa-trash-o"></i> Eliminar</strong></button>
                    <button type="button" onClick={this.actualizar_notificaciones} className="btn btn-success btn-flat btn-xs pull-right" style={{marginRight:10}}><strong><i className="fa fa-refresh"></i> Actualizar</strong></button>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <MDBDataTable
                          striped
                          bordered
                          small
                          hover
                          bordered
                          responsive={true}
                          //searching = {false}
                          //sorting={false}
                          sorting={"true"}
                          //scrollY
                          //rows = {this.state.rows}
                          //columns={this.state.columns}
                          data={this.state.data}
                        />
                      </div>
                    </div>
                  </div>
                  {/* /.box-body */}
                </div>
                {/* /.box */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}

// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "SET_LOGOUT" }),
  };
};
export default connect(null, mapDispatchToProps)(Notificaciones);
