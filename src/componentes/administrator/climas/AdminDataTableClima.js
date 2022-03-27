import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact'
import ModalClima from './ModalClima';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
const $ = require('jquery');

class AdminDataTableClima extends Component {


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
            ciudad_seleccionada : "",
            tipoAccion : [],
            datos_clima : [], // almacenará los datos del clima que provienen del servidor.
            datos_seleccionado : [], // almacenará el detalle de clima que seleccionó el usuario con btn consultar.
            isOpen: false,
            show : false,     
            data : {  
              columns: [
                {
                  label: <span>Ciudad</span>,
                  field: 'ciudad', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Temperatura</span>,
                  field: 'temperatura', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                }, 
                {
                  label: <span>Humedad</span>,
                  field: 'humedad', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Velocidad del Viento</span>,
                  field: 'velocidad_viento', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Presión</span>,
                  field: 'presion', // con este campo identificamos las filas.
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Horas de Sol</span>,
                  field: 'horas_sol', 
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span>Fecha</span>,
                  field: 'fecha', 
                  sort: 'asc',
                  width: 150
                },
                {
                  label: <span></span>,
                  field: 'consultar', 
                  sort: 'asc',
                  width: 150
                },
              ],
              rows: [
                {velocidad_viento : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
             ]
            },
        };

        // Methods
        this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
        this.handleClickParametros = this.handleClickParametros.bind(this);
        this.obtenerDatos = this.obtenerDatos.bind(this);
        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);
        this.handleClickBtnConsultar = this.handleClickBtnConsultar.bind(this);
    }

    /**
     * No se utiliza.
     */
    componentDidMount () {
        this._isMounted = true; 
    }  

   

    /**
     * Obtiene del servidor el pedido ingresado por el usuario.
     * 
     * @param {} event 
     */
    handleClickBtnConsultar(event) { 
        
      console.log( event.target.id );

      if( !this.state.datos_clima ) return;

      var str = event.target.id;
      var id_revisacion = parseInt(str.split('-')[1]);
      var datos = this.state.datos_clima;
      console.log("Que hay",datos);
      var resultado = [];
      
      for( var i=0; i < datos.length; i++ ) {
          if( datos[i]['id'] == id_revisacion ) {
              resultado = datos[i];
              break;
          }
      }
      

      this.setState(
        {
            //datos_seleccionado: this.state.datos_clima[numero - 1],
            datos_seleccionado: resultado,
            isOpen: !this.state.isOpen,
            
        },function(){
            
        });  

     
    }


    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    rerenderParentCallback() {
        console.log('Entre al callback!!!!!!');
        //this.forceUpdate();
        window.location.reload();
    }


     /**
     * El usuario cambio el rango de fechas en el panel de rango de fechas.
     * Muesto/oculto el div de rango de fechas personalizado.
     * 
     * @param {*} event 
     */
    handleChangeRangoFechas(event) {
        var rango_seleccionado = document.getElementById("select-rango-fechas").value;
        if( rango_seleccionado == "personalizado" ) {
            document.getElementById("div-rangos-personalizados").style.display = "block";
        }
        else {
            document.getElementById("div-rangos-personalizados").style.display = "none";
        }
    }

    /**
     * 
     * @param {*} event 
     */
    handleClickParametros(event) {
      if(  document.getElementById("div-parametros").style.display == "none" ) {
        document.getElementById("div-parametros").style.display = "block";
      }
      else {
        document.getElementById("div-parametros").style.display = "none";
      }
    }

    
    handleClickBuscarDatos(event) {
        
        // Obtengo datos seleccionados por el usuario
        var ciudad = document.getElementById("selector-ciudad").value;
        if( ciudad == 'Seleccionar' ) { alert("Seleccione una ciudad"); return; }

        // Valido Si el usuario no seleccionó un rango
        var rango_seleccionado = document.getElementById("select-rango-fechas").value;
        if( rango_seleccionado == 'Seleccionar' ) { alert("Seleccione un rango"); return; }

        var fecha_desde = '';
        var fecha_hasta = '';
        
        // Verifico si el usuario selecciono la opción "personalizado" y busco fecha desde y hasta
        if( rango_seleccionado == "personalizado" ) {
            fecha_desde = document.getElementById("fecha-desde-rango").value;
            fecha_hasta = document.getElementById("fecha-hasta-rango").value;

            if( fecha_desde == '' ) { alert("Ingrese fecha desde."); return; }
            if( fecha_hasta == '' ) { alert("Ingrese fecha hasta."); return; }
            if( fecha_desde > fecha_hasta ) { alert("Fecha Desde debe ser mayor a Fecha Hasta"); return; }
        }

        // Datos
        var tipoAccion = {
            accion: "Rango",
            tipo: rango_seleccionado,
            fecha_actual: fecha_desde,
            fecha_pasada: fecha_hasta,
            horario_desde: "Todo el dia",
            horario_hasta: "Todo el dia",
            rango: 60,
        };

        this.setState(
          {
            ciudad_seleccionada : ciudad,
            tipoAccion : tipoAccion,
          });
            
        
        document.getElementById("datatable-clima").style.display = "block";
         this.obtenerDatos(ciudad, tipoAccion);

    }


    obtenerDatos(ciudad, tipoAccion) {

      
      
      
      var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/clima/ciudad/historico");
      var params = {
                      ciudad: ciudad, 
                      tipoAccion: JSON.stringify(tipoAccion),
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
              this.props.logout();
              return;
            }
            
            console.log("Data",data);
            
            
            this.setState(
                {
                  datos_clima: data['datos'],
                  show: true,
                },
                function() { 
                    

                    var datos = [];
                    var columns = this.state.data.columns;
                    var datos_procesar = data['datos']; 

                    if( datos_procesar ) {

                          for( var i=0; i<datos_procesar.length; i++ ) {
                              var row = 
                                  {
                                      ciudad: datos_procesar[i]['ciudad'],
                                      temperatura: parseFloat(datos_procesar[i]['temperatura']).toFixed(0) + " °C",
                                      humedad: parseFloat(datos_procesar[i]['humedad']).toFixed(0) + " %",
                                      velocidad_viento: parseFloat(datos_procesar[i]['velocidad_del_viento_km_hs']).toFixed(0) + " km/h",
                                      presion: parseFloat(datos_procesar[i]['presion_hpa']).toFixed(0) + " hpa",
                                      horas_sol : parseFloat(datos_procesar[i]['horas_de_sol']).toFixed(1) + " hs",
                                      fecha : datos_procesar[i]['fecha'].split("-")[2]+"-"+datos_procesar[i]['fecha'].split("-")[1]+"-"+datos_procesar[i]['fecha'].split("-")[0]+" "+ datos_procesar[i]['hora'].substr(0,5),
                                      consultar : <button id={'consultar-' + datos_procesar[i]['id']} className="btn btn-success btn-sm fa fa-eye" onClick={this.handleClickBtnConsultar} data-toggle="modal" data-target="#modal_cp"> </button>
                                  };
                              
                              datos.push(row);
                          }
                    }
                    // Seteo los datos del DataTable.
                    this.setState(
                    {
                        data: {columns: columns, rows: datos},
                        show: true,
                    },function(){
                        console.log("Datos del DataTable",JSON.stringify(this.state.data.rows));
                    });
                }
            );
        
          
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Ha ocurrido un error al obtener Clima", error);
          //alert("Ha ocurrido un error al obtener Clima: " + error);
      });
    }

    render() {

          
        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Clima 
        <br/>
        <small>Histórico de Clima</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-sun-o" /> Clima</a></li>
        <li className="active"><a href="#">Histórico</a></li>
      </ol>
          {/* ComboBox 'Seleccionar Apiario' */}
          <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-6">
                    <div className="box box-primary">
                          <div className="box-header with-border">
                              <h3 className="box-title">Seleccionar Datos</h3>
                          </div>
                          {/* /.box-header */}
                          <div className="box-body">

                              <div id="div-parametros">    

                                    {/* <div className="form-group">
                                        <label htmlFor="b-buscar-datos" className="col-md-12"></label>
                                        <div className="col-xs-12 col-md-12 col-lg-3">
                                          <b id="b-buscar-datos"> Ingrese parámetros:  </b>
                                          <hr /> 
                                        </div>                                    
                                    </div>     */}

                                    <div className="form-group">
                                          <label htmlFor="selector-ciudad" className="col-md-12">Ciudad</label>
                                          <div className="col-md-12">
                                              <select className="form-control" id="selector-ciudad" name="selector-ciudad" defaultValue={'Seleccionar'} >
                                                  <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option> 
                                                  <option key={1} value={'Rawson'}>Rawson</option> 
                                                  <option key={2} value={'Trelew'}>Trelew</option> 
                                                  <option key={3} value={'Gaiman'}>Gaiman</option> 
                                                  <option key={4} value={'Dolavon'}>Dolavon</option> 
                                                  <option key={5} value={'28 de Julio'}>28 de Julio</option> 
                                                  <option key={6} value={'Todos'}>Todos</option>
                                              </select>
                                              <br />
                                          </div>
                                      </div>

                                      <div className="form-group">
                                          <label htmlFor="select-rango-fechas" className="col-md-12">Rango de fechas</label>
                                          <div className="col-md-12">
                                              <select className="form-control" id="select-rango-fechas" name="select-rango-fechas" defaultValue={'Seleccionar'} onChange={this.handleChangeRangoFechas}>
                                                  <option key={0} value={'Seleccionar'}>----- Seleccionar -----</option>
                                                  <option key={1} value={'hoy'}>Hoy</option>
                                                  <option key={2} value={'7'}>Últimos 7 días</option>
                                                  <option key={3} value={'14'}>Últimos 14 días</option>
                                                  <option key={4} value={'30'}>Últimos 30 días</option>
                                                  <option key={5} value={'personalizado'}>Rango personalizado</option>
                                              </select>
                                              <br />
                                          </div>
                                      </div>

                                      <div id="div-rangos-personalizados" style={{display : 'none'}}>
                                            
                                            <div className="form-group">
                                                <label htmlFor="rango-fechas-personalizado" className="col-md-12">Rango de fechas personalizado</label>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="rango-fechas" className="col-md-12">Desde</label>
                                                <div className="col-md-12">
                                                    <input id="fecha-desde-rango" className="form-control" type="date" name="bday" />  
                                                    <br />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="rango-fechas" className="col-md-12">Hasta</label>
                                                <div className="col-md-12">
                                                    <input id="fecha-hasta-rango" className="form-control" type="date" name="bday" />  
                                                    <br />
                                                </div>
                                            </div>

                                      </div>

                                      
                                </div>
                              {/* ./div-parametros */}
                            
                          </div>  
                          {/* ./box-body */}
                          <div className="box-footer">
                                <div className="form-group">
                                    <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                    <div className="col-xs-3 col-md-3 col-lg-3">
                                        <button id="btn-buscar-datos" type="button" onClick={this.handleClickBuscarDatos} className="btn btn-sm btn-flat btn-primary pull-left"><i className="fa fa-search" /><strong> Buscar datos &nbsp;</strong></button>
                                    </div>                                    
                                </div>
                          </div>
                          {/* ./box-body */}
                    </div>  
                    {/* ./box */}
              </div>  
              {/* ./col */}
        </div>  
          {/* ./row */}
          
    </section>
    {/* Main content */}
    <section className="content">
      <div className="row">
        <div className="col-xs-12">
          {/* Aca comienza la tabla */}
          <div id="datatable-clima" className="box box-primary" style={{display:"none"}}>
            <div className="box-header with-border">
            <h3 className="box-title">Datos climáticos</h3>
            </div>{/* /.box-header */}
            <div className="box-body">
             
               


                  <div  className="row">
                        <div className="col-md-12"> 
                            <MDBDataTable
                                      striped
                                      //bordered
                                      small
                                      hover
                                      bordered
                                      responsive = { true }
                                      //sorting={false}
                                      sorting = {"true"}
                                      //scrollY
                                      //rows = {this.state.rows}
                                      //columns={this.state.columns}
                                      data={this.state.data}
                              />
                          </div>
                    </div>

               
            </div>{/* /.box-body */}
          </div>{/* /.box */}
        </div>{/* /.col */}
      </div>{/* /.row */}
    </section>{/* /.content */}
  </div>{/* /.content-wrapper */}
  <ModalClima 
      datos={this.state.datos_seleccionado}
      show={this.state.isOpen}
  />        
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
export default connect(null,mapDispatchToProps)(AdminDataTableClima)