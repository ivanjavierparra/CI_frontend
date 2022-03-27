import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
import { Link } from "react-router-dom";
export default class AdminUsuarios extends Component {

    
    constructor(props) {
        // Las props son propiedades (variables) de la clase padre, que se pasan como parametro. Ejemplo: <GraphicsContainer nombre="hola" valor="1" /> donde nombre y valor serian las variables.
        super(props);
        
        this._isMounted = false;
        this.abortController = new window.AbortController();

        // Defino las variables de la clase.
        this.state = {
            usuarios : [],
            data : {  
                columns: [ 
                  {
                    label: <span>Avatar <i className="fa fa-sort pull-right" /></span>,
                    field: 'avatar', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150 
                  },
                  {
                    label: <span>Nombre y Apellido <i className="fa fa-sort pull-right" /></span>,
                    field: 'n_y_ap', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Rol <i className="fa fa-sort pull-right" /></span>,
                    field: 'rol', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150  
                  },
                  {
                    label: <span>Ciudad <i className="fa fa-sort pull-right" /></span>,
                    field: 'ciudad', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Edad <i className="fa fa-sort pull-right" /></span>,
                    field: 'edad', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Sexo <i className="fa fa-sort pull-right" /></span>,
                    field: 'sexo', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150
                  },
                  {
                    label: <span>Email <i className="fa fa-sort pull-right" /></span>,
                    field: 'email', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span>Apiarios <i className="fa fa-sort pull-right" /></span>,
                    field: 'apiarios', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span>Colmenas <i className="fa fa-sort pull-right" /></span>,
                    field: 'colmenas', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                  {
                    label: <span><i className="fa fa-sort pull-right" /></span>,
                    field: 'detalle', // con este campo identificamos las filas.
                    sort: 'asc',
                    //width: 150   
                  },
                ],
                rows: [
                  {ciudad : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
               ]
              }, 
          
        }

        // Asocio el metodo a la clase.
        this.buscarTodosUsuarios = this.buscarTodosUsuarios.bind(this);
        this.crearDataTable = this.crearDataTable.bind(this);
        this.getAge = this.getAge.bind(this);
      }

      
      
      
    /**
     * Método del ciclo de vida de la clase: Busco los apiarios existentes.
     * 
     * Explicación de llamadas ajax con fetch: Explicacion del fetch: https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/
     */
    componentDidMount() {

        this._isMounted = true;
        
        this.buscarTodosUsuarios();
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    buscarTodosUsuarios() {

        var url = "https://backendcolmenainteligente.herokuapp.com/api/admin/usuarios";
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
                    
                    usuarios: data,
                },
                function() {
                    
                }
                );

                this.crearDataTable(data);
            })
            .catch(function(error) {
                if (error.name === "AbortError") return;
                console.log("Request failed", error);
                //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
            });
      }


      crearDataTable(usuarios) {

        var data = [];
        var columns = this.state.data.columns;

        for(  var i = 0; i < usuarios.length; i++  ) {
            var row = "";
            row = 
            {
                
                avatar: <center><img src={"https://backendcolmenainteligente.herokuapp.com/api/public/img/" + usuarios[i]['usuario']['avatar']} width={20} height={20} className="img-circle" alt="User" /></center>,
                n_y_ap: usuarios[i]['usuario']['name'] + " " + usuarios[i]['usuario']['lastname'],
                rol: usuarios[i]['usuario']['role'] == "Beekeeper" ? "Apicultor" : "Administrador",
                ciudad: usuarios[i]['usuario']['city'],
                edad: this.getAge(usuarios[i]['usuario']['birthdate']) + " años",
                sexo : usuarios[i]['usuario']['gender'] == "Male" ? "Masculino" : usuarios[i]['usuario']['gender'] == "Female" ? "Femenino" : usuarios[i]['usuario']['gender'] == "Other" ? "Otro" : "",
                email: usuarios[i]['usuario']['email'],
                apiarios : usuarios[i]['usuario']['role'] == "Beekeeper" ? <center>{usuarios[i]['apiarios']}</center> : <center>---</center>,
                colmenas: usuarios[i]['usuario']['role'] == "Beekeeper" ? <center>{usuarios[i]['colmenas']}</center> : <center>---</center>,
                detalle: usuarios[i]['usuario']['role'] == "Beekeeper" ? <Link to={{pathname: "/admin/profile/apicultor",state:{apicultor:usuarios[i]['usuario'],apiarios:usuarios[i]['apiarios'],colmenas:usuarios[i]['colmenas']}}}><button
                            id={"consultar-" + usuarios[i]['usuario']['id']}
                            className="btn btn-success btn-sm fa fa-forumbee"
                            //onClick={this.handleClickBtnConsultar}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Ver Perfil"
                          >
                          {""}
                          </button></Link>
                          : ""
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

      getAge(dateString) 
      {
          var today = new Date();
          var birthDate = new Date(dateString);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
          {
              age--;
          }
          return age;
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
                              Usuarios 
                              <br/>
                              <small>Todos los Usuarios </small>
                              <hr/>
                          </h1>

                          <ol className="breadcrumb">
                              <li><i className="fa fa-users" /> Usuarios</li>
                              <li className="active">Usuarios</li>
                          </ol>

                          <div id="row-contenedor-total" className="row">
                            <div className="col-md-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Usuarios Registrados</h3>
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
                                                        small = {true}
                                                        exportToCSV 
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

