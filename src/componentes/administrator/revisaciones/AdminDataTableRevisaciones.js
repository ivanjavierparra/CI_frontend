import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';

export default class AdminDataTableRevisaciones extends Component {

    
    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);
        
        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Defino las variables de la clase.
        this.state = {
            apiarios : [],
            revisaciones : [],
            ciudad_seleccionada: "",
            apicultor_seleccionado: "",
            apiario_seleccionado : "",
            data : {  
                columns: [ 
                  { 
                    label: <span>Apiario</span>,
                    field: 'apiario', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150 
                  }, 
                  { 
                    label: <span>Colmena</span>,
                    field: 'colmena', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150 
                  }, 
                  {
                    label: <span>Temperatura</span>,
                    field: 'temperatura', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Humedad</span>,
                    field: 'humedad', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150  
                  },
                  {
                    label: <span>Fecha</span>,
                    field: 'fecha', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Hora</span>,
                    field: 'hora', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                ],
                rows: [
                  {humedad : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
               ]
              },
              
              isLoadCiudad : true,
              isLoadApicultor : true,
              isLoadApiario : true,
              isLoadColmena : true, 
        }

        // Asocio el metodo a la clase.
        this.handleChangeRangoFechas = this.handleChangeRangoFechas.bind(this);
        
        this.buscarTodasRevisaciones = this.buscarTodasRevisaciones.bind(this);
        this.crearDataTable = this.crearDataTable.bind(this);

        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);

        this.buscarApicultoresApiariosColmenas = this.buscarApicultoresApiariosColmenas.bind(this);
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this);

        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.handleChangeApicultor = this.handleChangeApicultor.bind(this);
        this.handleChangeApiario = this.handleChangeApiario.bind(this);
        

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
     * Método del ciclo de vida de la clase: Busco los apiarios existentes.
     * 
     * Explicación de llamadas ajax con fetch: Explicacion del fetch: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/
     */
    componentDidMount() {

        this._isMounted = true;
        
        this.buscarApicultoresApiariosColmenas();
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }


    buscarApicultoresApiariosColmenas() {
        
        var url = "http://localhost:8000/api/admin/apicultores/apiarios/colmenas";
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

            console.log(data);

            this.setState(
            {
                
                apiarios: data,
                isLoadCiudad : false,
                isLoadApicultor : false,
                isLoadApiario : false,
                isLoadColmena : false,
            },
            function() {
                
            }
            );

        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });

    }



    /**
     * Elimina todos los options del selector-apiario.
     */
    emptySelector(selector_id) { 
        var select = document.getElementById(selector_id);
        var length = select.options.length;
        for (var i = length-1; i >= 0; i--) {
          select.options[i] = null;
        }
          
      }
      
      
      /**
       * Creo un nuevo option para el selector-apiario con los datos
       * pasados como parámetros.
       * @param {*} key 
       * @param {*} text 
       * @param {*} value 
       */
      createDefaultValueSelector(selector_id, key, text, value) { 
        
        var selector = document.getElementById(selector_id);
      
        // create new option element
        var opt = document.createElement('option');
      
        // create text node to add to option element (opt)
        opt.appendChild( document.createTextNode(text) );
      
        // set value property of opt
        opt.value = value; 
        opt.key = key;
      
        // add opt to end of select box (sel)
        selector.appendChild(opt); 
      }

      /**
         * Devuelvo el nombre del apiario.
         * @param {*} direccion_chacra 
         * @param {*} nombre_fantasia 
         */
        createTextSelect(direccion_chacra, nombre_fantasia) { 
            var text = direccion_chacra;
            if ( !nombre_fantasia ) return text;
        
            text = text + " - " + nombre_fantasia;
        
            return text;
        }


      handleChangeCiudad(event) {

        this.setState({ ciudad_seleccionada : event.target.value }, () => {
            this.emptySelector("selector-apicultor");
            this.emptySelector("selector-apiario");
            this.createDefaultValueSelector("selector-apicultor",0,'----- Seleccionar -----',"");
            this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----',"");
            if ( this.state.ciudad_seleccionada != "" ) {
      
                var apiarios_existentes = this.state.apiarios;
                var apicultores_cargados = [];
      
                for( var i=0; i<apiarios_existentes.length; i++ ) {
                    
                    if( apiarios_existentes[i]['apiario']['localidad_chacra'] == this.state.ciudad_seleccionada ) {
      
                      if(  apicultores_cargados.includes(apiarios_existentes[i]['apiario']['apicultor_id']) ) continue;
      
                      apicultores_cargados.push(apiarios_existentes[i]['apiario']['apicultor_id']);
      
                      var apicultor = apiarios_existentes[i]['apicultor'];
      
                      this.createDefaultValueSelector(
                        "selector-apicultor",  
                        apiarios_existentes[i]['apiario']['apicultor_id'], 
                        apicultor['name'] + " " + apicultor['lastname'],
                        apiarios_existentes[i]['apiario']['apicultor_id']
                      );
                    }
                }
            }
          });

      }

      handleChangeApicultor(event) {
        this.setState({ apicultor_seleccionado : event.target.value }, () => {
            this.emptySelector("selector-apiario");
            this.createDefaultValueSelector("selector-apiario",0,'----- Seleccionar -----',"");
            if ( this.state.apicultor_seleccionado != "" ) {
      
                var apiarios_existentes = this.state.apiarios;
                
                for( var i=0; i<apiarios_existentes.length; i++ ) {
                    
                    if( apiarios_existentes[i]['apiario']['apicultor_id'] == this.state.apicultor_seleccionado ) {
      
                      this.createDefaultValueSelector(
                        "selector-apiario",  
                        apiarios_existentes[i]['apiario']['id'], 
                        this.createTextSelect(apiarios_existentes[i]['apiario']['direccion_chacra'], apiarios_existentes[i]['apiario']['nombre_fantasia']),
                        apiarios_existentes[i]['apiario']['id']
                      );
                    }
                }
            }
          });
      
      }

      handleChangeApiario(event) {
        this.setState({ apiario_seleccionado : event.target.value }, () => {
            this.emptySelector("selector-colmena");
            this.createDefaultValueSelector("selector-colmena",0,'----- Seleccionar -----',"");
            if ( this.state.apiario_seleccionado != "" ) {
      
                var apiarios_existentes = this.state.apiarios;
                
                for( var i=0; i<apiarios_existentes.length; i++ ) {
                    
                    if( apiarios_existentes[i]['apiario']['id'] == this.state.apiario_seleccionado ) {

                     var colmenas = apiarios_existentes[i]['colmenas'];
                     for( var j = 0; j < colmenas.length; j++ ) {

                        this.createDefaultValueSelector(
                            "selector-colmena",  
                            colmenas[j]['id'], 
                            colmenas[j]['identificacion'], 
                            colmenas[j]['id'], 
                          );

                     }
      
                      break;

                    }
                }
            }
          });
      }



    buscarTodasRevisaciones(ciudad,apicultor,apiario,colmena,tipoAccion) {

        // Muestro el datatable
        document.getElementById("datatable-revisaciones").style.display = "block";

        var url = new URL("http://localhost:8000/api/admin/revisaciones/tyh/todas");
        var params = {
                      ciudad: ciudad, 
                      apicultor: apicultor, 
                      apiario: apiario, 
                      colmena: colmena, 
                      tipoAccion: JSON.stringify(tipoAccion),
                  };
        console.log(params);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
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

            console.log(data);

            this.setState(
            {
                
                revisaciones: data,
            },
            function() {
                
            }
            );

            this.crearDataTable(data);
        })
        .catch(function(error) {
            if (error.name == "AbortError") return;
            console.log("Request failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
      }


      crearDataTable(revisaciones) {

        var data = [];
        var columns = this.state.data.columns;

        for(  var i = 0; i < revisaciones.length; i++  ) {
            var row = "";
            row = 
            { 
                // apiario colmena temperatura humedad fecha hora
                apiario: revisaciones[i]['apiario']['localidad_chacra'] + " - " + revisaciones[i]['apiario']['direccion_chacra'] + " - "  + revisaciones[i]['apiario']['nombre_fantasia'],
                colmena: revisaciones[i]['colmena']['identificacion'],
                temperatura: revisaciones[i]['revisacion']['temperatura'] + " °C",
                humedad: revisaciones[i]['revisacion']['humedad'] + "%",
                fecha : revisaciones[i]['revisacion']['fecha_revisacion'].split("-")[2] + "/" + revisaciones[i]['revisacion']['fecha_revisacion'].split("-")[1] + "/" + revisaciones[i]['revisacion']['fecha_revisacion'].split("-")[0],
                hora: revisaciones[i]['revisacion']['hora_revisacion'].substr(0,5),
            };

            data.push(row);
        }


        // Seteo los datos del DataTable.
        this.setState(
        {
            data: {columns: columns, rows: data},
        },function(){
            console.log("Datos del DataTable",JSON.stringify(this.state.data.rows));
        });


      }

      handleClickBuscarDatos(event) { 
        
        var ciudad = document.getElementById("selector-ciudad").value;
        var apicultor = document.getElementById("selector-apicultor").value;
        var apiario = document.getElementById("selector-apiario").value;
        var colmena = document.getElementById("selector-colmena").value;
        
        if( ciudad == "" ) { alert("Ingrese ciudad."); return; }
        if( apicultor == "" ) { alert("Ingrese apicultor."); return; }
        if( apiario == "" ) { alert("Ingrese apiario."); return; }
        if( colmena == "" ) { alert("Ingrese colmena."); return; }

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
        
        this.buscarTodasRevisaciones(ciudad,apicultor,apiario,colmena,tipoAccion);

      }
    

    /**
     * 
     */
    render() {
        
        

        return (
            <div>
  
                <div className="content-wrapper">

                      {/* Content Header (Page header) */}
                      <section className="content-header">
                          <h1>
                              Revisaciones 
                              <br/>
                              <small>Histórico de temperatura y humedad de las colmenas </small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><a href="fake_url"><i className="fa fa-thermometer-full" /> Temperatura y Humedad</a></li>
                              <li className="active">Histórico</li>
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
                                                            <div className="col-md-6">
                                                                <select 
                                                                    className="form-control" 
                                                                    id="selector-ciudad" 
                                                                    name="selector-ciudad" 
                                                                    defaultValue={''} 
                                                                    onChange={this.handleChangeCiudad}
                                                                    disabled = {this.state.isLoadCiudad}
                                                                >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                    <option key={1} value={'Rawson'}>Rawson</option> 
                                                                    <option key={2} value={'Trelew'}>Trelew</option> 
                                                                    <option key={3} value={'Gaiman'}>Gaiman</option> 
                                                                    <option key={4} value={'Dolavon'}>Dolavon</option> 
                                                                    <option key={5} value={'28 de Julio'}>28 de Julio</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="selector-apicultor" className="col-md-12">Apicultor</label>
                                                            <div className="col-md-6">
                                                                <select 
                                                                    className="form-control" 
                                                                    id="selector-apicultor" 
                                                                    name="selector-apicultor" 
                                                                    defaultValue={''} 
                                                                    onChange={this.handleChangeApicultor} 
                                                                    disabled = {this.state.isLoadApicultor}
                                                                >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="selector-apiario" className="col-md-12">Apiario</label>
                                                            <div className="col-md-6">
                                                                <select 
                                                                    className="form-control" 
                                                                    id="selector-apiario" 
                                                                    name="selector-apiario" 
                                                                    defaultValue={''} 
                                                                    onChange={this.handleChangeApiario} 
                                                                    disabled = {this.state.isLoadApiario}
                                                                >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="selector-colmena" className="col-md-12">Colmena</label>
                                                            <div className="col-md-6">
                                                                <select 
                                                                    className="form-control" 
                                                                    id="selector-colmena" 
                                                                    name="selector-colmena" 
                                                                    defaultValue={''} 
                                                                    disabled = {this.state.isLoadColmena}
                                                                >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="select-rango-fechas" className="col-md-12">Rango de fechas</label>
                                                            <div className="col-md-6">
                                                                <select className="form-control" id="select-rango-fechas" name="select-rango-fechas" defaultValue={''} onChange={this.handleChangeRangoFechas}>
                                                                    <option key={0} value={''}>----- Seleccionar -----</option>
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
                                                                    <div className="col-md-6">
                                                                        <input id="fecha-desde-rango" className="form-control" type="date" name="bday" />  
                                                                        <br />
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label htmlFor="rango-fechas" className="col-md-12">Hasta</label>
                                                                    <div className="col-md-6">
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
                                            {/* ./box-footer */}
                                        </div>  
                                        {/* ./box */}
                                </div>  
                                {/* ./col */}
                            </div>  
                            {/* ./row */}

                          <div id="datatable-revisaciones" className="row" style={{display:'none'}}>
                            <div className="col-md-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Revisaciones Registradas</h3>
                                    </div>
                                    <div className="box-body">
                        
                                        {/* Row: Cabecera */}
                                        <div className="row" style={{marginTop: 10}}>
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
                                                {/* ./col */}
                                        </div>
                                        {/* ./row */}
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
                        <div id="contenedor" className="row"> 
                           
                        </div>
                        {/* /.row */}
                    </section>
                    {/* /.content */}

              </div>
          </div>

        )
    }
}

