import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { MDBDataTable } from 'mdbreact';
import cookie from 'js-cookie';
export default class DataTableAlertaApiarios extends Component {


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
          ciudad : !this.props.location.state ? "Trelew" : this.props.location.state['ciudad'], // {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}  
          estado : !this.props.location.state ? "verde" : this.props.location.state['estado'],
          box_border : {verde:"box box-success",amarillo:"box box-warning",rojo:"box box-danger"},
          datos : [],
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
                label: <span>Última Actualización</span>,
                field: 'fecha', // con este campo identificamos las filas.
                sort: 'asc',
                //width: 150
              },
            ],
            rows: [
              {temperatura : <div> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>},
           ]
          },
        };


        // Methods
        this.refrescarComponente = this.refrescarComponente.bind(this);
        this.completarDataTable = this.completarDataTable.bind(this);
    }



    /**
     * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
      this.setState({
          ciudad : nextProps.location.state['ciudad'],
          estado : nextProps.location.state['estado'],
      }, //() => this.componentDidMount() 
      ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
    }


    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

        this._isMounted = true;
        
        
        document.getElementById("titulo-contenedor").innerText = "Estado de los Apiarios en " + this.state.ciudad;
        
        var url = new URL("http://localhost:8000/api/apiario/alertas/ciudad");
        var params = {
                        ciudad: this.state.ciudad, 
                        estado: this.state.estado, // verde, amarillo, rojo
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
              this.abortController.abort();
              //var token = cookie.get("token");
              //if(token) cookie.remove("token");
              return;
            }

            console.log("Datos encontrados: ", data);

            this.setState(
                {
                    datos: data['datos'],
                },
                function() { 
                    // Naranja fanta....
                }
            );



            this.completarDataTable(data['datos']);
            
            
            
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request apiarios failed", error);
            //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
        });
        
        
        
   }



   completarDataTable(datos) {


    var data = [];
    var columns = this.state.data.columns;

    for( var i = 0; i<datos.length; i++ ) {
        var apiario = datos[i][0];
        var colmenas_revisaciones = datos[i][1];

        for( var j=0; j < colmenas_revisaciones.length; j++ ) {
            var colmena = colmenas_revisaciones[j][0];
            var revisacion = colmenas_revisaciones[j][1];
            var row = "";
            if( revisacion ) {
                row = 
                {
                    apiario: "Apiario " + apiario['direccion_chacra'],
                    colmena: "Colmena N° " + colmena['identificacion'],
                    temperatura: revisacion['temperatura'] + "°C",
                    humedad: revisacion['humedad'] + "%",
                    fecha: revisacion['fecha_revisacion'].split("-")[2]+"-"+revisacion['fecha_revisacion'].split("-")[1]+"-"+revisacion['fecha_revisacion'].split("-")[0]+" "+revisacion['hora_revisacion'],
                };
            }
            else {
                row = 
                {
                    apiario: "Apiario " + apiario['direccion_chacra'],
                    colmena: "Colmena N° " + colmena['identificacion'],
                    temperatura: "--- °C",
                    humedad: "--- %",
                    fecha: "---",
                };
            }
            
        
            data.push(row);

        }
    }

    // Seteo los datos del DataTable.
    this.setState(
      {
          data: {columns: columns, rows: data},
      },function(){
          console.log("Datos del DataTable",JSON.stringify(this.state.data.rows));
      });

   }
   


   
    
   
   

   refrescarComponente() {
      window.location.reload(true);
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

    render() {

      

          
        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Alertas 
        <br/>
        <small> <span id="titulo-contenedor"> Estado de los Apiarios Trelew </span></small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-exclamation-triangle" /> Alertas</a></li>
        <li className="active"><a href="#">Alertas por Apiarios</a></li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">

        
    <div className="row">
        


    <div className="col-md-12">
          
          {/* LINE CHART */}
          <div className={this.state.box_border[this.state.estado] || "box box-primary"}>
            <div className="box-header with-border">
              <h3 className="box-title"> Apiarios - Colmenas - Último valor de Temperatura y Humedad recibido</h3>
              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" /> </button>
                <div className="btn-group">
                  <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-wrench"></i></button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                  </ul>
                </div>
                <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button>
              </div>
            </div>
            <div className="box-body">
              
                {/*<canvas id="areaChart" style={{height: 250}} /> */} {/* ACA IRÍA EL GRÁFICO */}
                    {/* SPINNER */}
                    {/* <div id={'div-spinner-chart-ciudades'}>
                    <br />
                    <center> <i className="fa fa-spinner fa-pulse fa-3x fa-fw" /> </center>
                    </div> */}
                    
                
                      <div id={"contenedor-" + this.state.ciudad} className="row">
                      
                          

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



                          
                      </div> {/* /.contendedor */}




              
            </div>
            {/* /.box-body */}
          </div>
          {/* /.box */}

           {/* /.col (LEFT) */}
        </div>



    </div>
    
    

          
            

    </section>{/* /.content */}
  </div>{/* /.content-wrapper */} 
</div>

        )
    }
}
