import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';

export default class AdminDataTableColmenas extends Component {

    
    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);
        
        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Defino las variables de la clase.
        this.state = {
            apiarios : [],
            colmenas : [],
            ciudad_seleccionada : "",
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
                    label: <span>Apicultor</span>,
                    field: 'apicultor', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150 
                  }, 
                  {
                    label: <span>Identificación</span>,
                    field: 'identificacion', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Raza de la Abeja</span>,
                    field: 'raza_abeja', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150  
                  },
                  {
                    label: <span>Fecha Creación</span>,
                    field: 'fecha', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Descripcion</span>,
                    field: 'descripcion', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Estado</span>,
                    field: 'estado', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                ],
                rows: [
                  {raza_abeja : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
               ]
              }, 
          
        }

        // Asocio el metodo a la clase.
        this.buscarTodasColmenas = this.buscarTodasColmenas.bind(this);
        this.crearDataTable = this.crearDataTable.bind(this);
        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);
        
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);
        this.createTextSelect = this.createTextSelect.bind(this);  
        this.buscarApicultoresApiariosColmenas = this.buscarApicultoresApiariosColmenas.bind(this);

        this.handleChangeCiudad = this.handleChangeCiudad.bind(this);
        this.handleChangeApicultor = this.handleChangeApicultor.bind(this);
        this.handleChangeApiario = this.handleChangeApiario.bind(this);

        this.getApiario = this.getApiario.bind(this);
        this.getApicultor = this.getApicultor.bind(this);

        this.buscarEstado = this.buscarEstado.bind(this);
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

        var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/apicultores/apiarios/colmenas";
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
            },
            function() {
                
            }
            );

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
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
        this.setState({ apiario_seleccionado : event.target.value });
    }


    handleClickBuscarDatos(event) {
        this.buscarTodasColmenas();
    
    }

    buscarTodasColmenas() {

        var ciudad = document.getElementById("selector-ciudad").value;
        var apicultor = document.getElementById("selector-apicultor").value;
        var apiario = document.getElementById("selector-apiario").value;

        if( ciudad == "" ) { alert("Ingrese ciudad."); return; }
        if( apicultor == "" ) { alert("Ingrese apicultor."); return; }
        if( apiario == "" ) { alert("Ingrese apiario."); return; }

        document.getElementById("spinner").style.display = "block";
        var apiarios = this.state.apiarios;

        for( var i=0; i < apiarios.length; i++ ) {

            if( apiarios[i]['apiario']['id'] == apiario ) {
                this.crearDataTable(apiarios[i]['colmenas'], apiarios[i]['estados']);
                break;
            }

        }

        document.getElementById("spinner").style.display = "none";
        document.getElementById("box-colmenas").style.display = "block";

    }

    buscarTodasColmenas__viejo() {

        var ciudad = document.getElementById("selector-ciudad").value;
        var apicultor = document.getElementById("selector-apicultor").value;

        if( ciudad == "" && apicultor == "" ) { alert("Ingrese algún parámetro."); return; }

        
        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/admin/todos/colmenas");
        var params = {
          ciudad: ciudad, 
          apicultor: apicultor,
        };

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
                
                colmenas: data,
            },
            function() {
                
            }
            );

            this.crearDataTable(data);
            document.getElementById("box-colmenas").style.display = "block";
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
      }


      crearDataTable(colmenas, estados) {

        var data = [];
        var columns = this.state.data.columns;

        var apiario = this.getApiario(this.state.apiario_seleccionado);
        var apicultor = this.getApicultor(this.state.apicultor_seleccionado);

        for(  var i = 0; i < colmenas.length; i++  ) {
            var row = "";
            row = 
            { 
                // apiario apicultor identificacion raza_abeja fecha descripcion
                apiario: apiario['localidad_chacra'] + " - " + apiario['direccion_chacra'] + " - "  + apiario['nombre_fantasia'],
                apicultor: apicultor['name'] + "  " + apicultor['lastname'],
                identificacion: colmenas[i]['identificacion'],
                raza_abeja: colmenas[i]['raza_abeja'],
                fecha : colmenas[i]['fecha_creacion'].split("-")[2] + "-" + colmenas[i]['fecha_creacion'].split("-")[1] + "-" + colmenas[i]['fecha_creacion'].split("-")[0],
                descripcion: colmenas[i]['descripcion'],
                estado: this.buscarEstado(estados, colmenas[i]['id']),
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


      getApiario(apiario_id) {

        var apiarios = this.state.apiarios;

        for( var i = 0; i < apiarios.length; i++ ) {
            if( apiarios[i]['apiario']['id'] == apiario_id ) return apiarios[i]['apiario'];
        }

        return [];
      }

      getApicultor(apicultor_id) {

        var apiarios = this.state.apiarios;

        for( var i = 0; i < apiarios.length; i++ ) {
            if( apiarios[i]['apicultor']['id'] == apicultor_id ) return apiarios[i]['apicultor'];
        }

        return [];

      }

      buscarEstado(estados, colmena_id) {

        for ( var i = 0; i < estados.length; i++ ) {

            if( estados[i][0] == colmena_id ) return estados[i][1];

        }
      }

      crearDataTable__viejo(colmenas) {

        var data = [];
        var columns = this.state.data.columns;

        for(  var i = 0; i < colmenas.length; i++  ) {
            var row = "";
            row = 
            { 
                // apiario apicultor identificacion raza_abeja fecha descripcion
                apiario: colmenas[i]['apiario']['localidad_chacra'] + " - " + colmenas[i]['apiario']['direccion_chacra'] + " - "  + colmenas[i]['apiario']['nombre_fantasia'],
                apicultor: colmenas[i]['apicultor']['name'] + "  " + colmenas[i]['apicultor']['lastname'],
                identificacion: colmenas[i]['identificacion'],
                raza_abeja: colmenas[i]['raza_abeja'],
                fecha : colmenas[i]['fecha_creacion'].split("-")[2] + "-" + colmenas[i]['fecha_creacion'].split("-")[1] + "-" + colmenas[i]['fecha_creacion'].split("-")[0],
                descripcion: colmenas[i]['descripcion'],
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
                              Colmenas 
                              <br/>
                              <small>Todas las Colmenas </small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><a href="fake_url"><i className="fa fa-forumbee" /> Colmenas</a></li>
                              <li className="active">Listado Colmenas</li>
                          </ol>

                         {/* ComboBox 'Seleccionar Apiario' */}
                         <div className="row">
                                <div className="col-xs-12 col-md-12 col-lg-12">
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
                                                            <div className="col-md-3">
                                                                <select className="form-control" id="selector-ciudad" name="selector-ciudad" defaultValue={''} onChange={this.handleChangeCiudad}>
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
                                                            <div className="col-md-3">
                                                                <select className="form-control" id="selector-apicultor" name="selector-apicultor" defaultValue={''} onChange={this.handleChangeApicultor} >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        <div className="form-group">
                                                            <label htmlFor="selector-apiario" className="col-md-12">Apiario</label>
                                                            <div className="col-md-3">
                                                                <select className="form-control" id="selector-apiario" name="selector-apiario" defaultValue={''} onChange={this.handleChangeApiario} >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
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
                                                    <div className="form-group">
                                                        <div className="col-xs-3 col-md-3 col-lg-3">
                                                            <i id={"spinner"} style={{display:"none"}} className="fa fa-spinner fa-pulse fa-sm fa-fw" />  
                                                        </div>                                    
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

                          <div id="row-contenedor-total" className="row">
                            <div className="col-md-12">
                                <div id="box-colmenas" className="box box-primary" style={{display:'none'}}>
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Colmenas Registradas</h3>
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

