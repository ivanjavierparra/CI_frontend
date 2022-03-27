import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';

export default class AdminDataTableApiarios extends Component {

    
    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);
        
        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Defino las variables de la clase.
        this.state = {
            apiarios : [],
            apicultores : [],
            data : {  
                columns: [ 
                  {
                    label: <span>Nombre de Fantasía</span>,
                    field: 'nombre_fantasia', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150 
                  }, 
                  {
                    label: <span>Dirección</span>,
                    field: 'direccion', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Ciudad</span>,
                    field: 'ciudad', // con este campo identificamos las filas.
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
                    label: <span>Latitud</span>,
                    field: 'latitud', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Longitud</span>,
                    field: 'longitud', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  }, 
                  {
                    label: <span>Fecha de Creación</span>,
                    field: 'fecha', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span>Propietario de la Chacra</span>,
                    field: 'propietario', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span>Descripción</span>,
                    field: 'descripcion', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span>Colmenas</span>,
                    field: 'colmenas', // con este campo identificamos las filas.
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
                  {longitud : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
               ]
              }, 
          
        }

        // Asocio el metodo a la clase.
        this.obtenerApicultores = this.obtenerApicultores.bind(this);
        this.buscarTodosApiarios = this.buscarTodosApiarios.bind(this);
        this.crearDataTable = this.crearDataTable.bind(this);
        this.handleClickBuscarDatos = this.handleClickBuscarDatos.bind(this);
        this.crearSelectorApicultores = this.crearSelectorApicultores.bind(this);
        this.createDefaultValueSelector = this.createDefaultValueSelector.bind(this);
        this.emptySelector = this.emptySelector.bind(this);

        this.procesar_fecha_hora = this.procesar_fecha_hora.bind(this);
      }

      
      
      
    /**
     * Método del ciclo de vida de la clase: Busco los apiarios existentes.
     * 
     * Explicación de llamadas ajax con fetch: Explicacion del fetch: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/
     */
    componentDidMount() {

        this._isMounted = true;
        
        // this.buscarTodosApiarios();

        this.obtenerApicultores();
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }


    obtenerApicultores() {

      var url = "http://localhost:8000/api/admin/todos/apicultores";
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

          this.crearSelectorApicultores(data);
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
          // alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
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

    
    crearSelectorApicultores(apicultores) {
      this.emptySelector("selector-apicultor");
      this.createDefaultValueSelector("selector-apicultor",0,'----- Seleccionar -----',"");
      
      for( var i=0; i<apicultores.length; i++ ) {
          
            this.createDefaultValueSelector(
              "selector-apicultor",  
              apicultores[i]['id'], 
              apicultores[i]['name'] + " " + apicultores[i]['lastname'],
              apicultores[i]['id']
            );
          
      }

      if( apicultores.length > 0 ) {
        
        this.createDefaultValueSelector(
          "selector-apicultor",  
          "Todos", 
          "Todos",
          "Todos"
        );
      } 
      
    }


    handleClickBuscarDatos(event) {
      this.buscarTodosApiarios();
    }

    buscarTodosApiarios() {

        var ciudad = document.getElementById("selector-ciudad").value;
        var apicultor = document.getElementById("selector-apicultor").value;

        if( ciudad == "" && apicultor == "" ) { alert("Ingrese algún parámetro."); return; }

        document.getElementById("spinner").style.display = "block";

        var url = new URL("http://localhost:8000/api/admin/todos/apiarios");
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
                
                apiarios: data,
            },
            function() {
                
            }
            );

            document.getElementById("spinner").style.display = "none";
            this.crearDataTable(data);
            document.getElementById("datatable-apiarios").style.display = "block";
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Ha ocurrido un error al tratar de buscar apiarios", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
      }


      crearDataTable(apiarios) {

        var data = [];
        var columns = this.state.data.columns;

        for(  var i = 0; i < apiarios.length; i++  ) {
            var row = "";
            row = 
            {
                // nombre_fantasia direccion ciudad apicultor latitud longitud fecha propietario descripcion colmenas   
                nombre_fantasia: apiarios[i]['apiario']['nombre_fantasia'],
                direccion: apiarios[i]['apiario']['direccion_chacra'],
                ciudad: apiarios[i]['apiario']['localidad_chacra'],
                apicultor: apiarios[i]['apicultor']['name'] + apiarios[i]['apicultor']['lastname'],
                latitud: apiarios[i]['apiario']['latitud'],
                longitud : apiarios[i]['apiario']['longitud'],
                fecha: this.procesar_fecha_hora(apiarios[i]['apiario']['created_at']),
                propietario : apiarios[i]['apiario']['propietario_chacra'],
                descripcion: apiarios[i]['apiario']['descripcion'],
                colmenas: apiarios[i]['colmenas'],
                estado : apiarios[i]['estado'] == "verde" ? "Buen estado" : apiarios[i]['estado'] == "amarillo" ? "Alerta" : "Peligro",
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

      procesar_fecha_hora(fecha_hora) {
        var fecha = fecha_hora.split(" ")[0];
        var hora = fecha_hora.split(" ")[1];

        fecha = fecha.split("-")[2] + "-" + fecha.split("-")[1] + "-" + fecha.split("-")[0];
        hora = hora.substr(0,5);

        return fecha + " " + hora;
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
                              Apiarios 
                              <br/>
                              <small>Todos los Apiarios </small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><a href="fake_url"><i className="fa fa-map-marker" /> Apiarios</a></li>
                              <li className="active">Listado Apiarios</li>
                          </ol>
                          
                          {/* Filtros */}
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
                                                                <select className="form-control" id="selector-ciudad" name="selector-ciudad" defaultValue={'Seleccionar'} >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
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
                                                            <label htmlFor="selector-apicultor" className="col-md-12">Apicultor</label>
                                                            <div className="col-md-6">
                                                                <select className="form-control" id="selector-apicultor" name="selector-apicultor" defaultValue={'Seleccionar'} >
                                                                    <option key={0} value={''}>----- Seleccionar -----</option> 
                                                                </select>
                                                                <br />
                                                            </div>
                                                        </div>

                                                        

                                                        
                                                  </div>
                                                {/* ./div-parametros */}
                                              
                                            </div>  
                                            
                                            <div className="box-footer">
                                                <div className="form-group">
                                                    <label htmlFor="btn-buscar-datos" className="col-md-12"></label>
                                                    <div className="col-xs-3 col-md-3 col-lg-3">
                                                        <button id="btn-buscar-datos" type="button" onClick={this.handleClickBuscarDatos} className="btn btn-sm btn-flat btn-primary pull-left"><i className="fa fa-search" /><strong> Buscar datos &nbsp;</strong></button>
                                                    </div>                                    
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-xs-3 col-md-3 col-lg-3">
                                                    <i id={"spinner"} style={{display:"none"}} className="fa fa-spinner fa-pulse fa-sm fa-fw" />  
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
                                <div className="box box-primary" id="datatable-apiarios" style={{display:'none'}} >
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Apiarios Registrados</h3>
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

