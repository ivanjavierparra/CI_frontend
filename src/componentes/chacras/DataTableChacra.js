import React, { Component } from 'react'




export default class DataTableChacra extends Component {
   
   /**
   * Constructor: defino propiedades, estados y métodos.
   * @props propiedades que me pasa el padre como parámetros.
   */ 
  constructor(props) {
    super(props);

    // Creo mis estados.
    this.state = { 
        chacras : [],
        chacras_ocupadas : [],
        chacra_seleccionada : 0,  
        columnas: [
          { title: "ID"},
          { title: "Dirección"},
          { title: "Localidad"},
          { title: "Propietario"},
          //{ title: "Acciones"},
        ],
        show : false,     
        
        //dataSet : [
         // [ "Tiger Nixon", "System Architect", "Edinburgh", "5421" ],
        //], 
    };

    

     // Asocio el metodo a la clase.
     this.armarTabla = this.armarTabla.bind(this);
     this.generarTabla = this.generarTabla.bind(this);
     
  }


  
    


    componentDidMount () {
        // ---------------   Carga de Script ------------
        /* const script = document.createElement("script");

        script.src = "js/datatableChacras.js";
        script.async = true;

        document.body.appendChild(script); */

        // ---------------   Busqueda de Chacras ------------
        let todas_las_chacras = [];
        fetch('http://localhost:8000/chacras')
            .then(response => {
                return response.json();
            }).then(data => {
                
                todas_las_chacras = data.map((chacra) => {
                    return chacra
                });

                console.log(todas_las_chacras); 

                this.setState({
                    chacras: todas_las_chacras,
                    show: true,
                });

                
                

            });
        // ---------------   Busqueda de Chacras Ocupadas ------------
        let solo_chacras_ocupadas = [];
        fetch('http://localhost:8000/chacras/consultar/ocupadas')
            .then(response => {
                return response.json();
            }).then(data => {
                
                solo_chacras_ocupadas = data.map((chacra) => {
                    return chacra
                });

                console.log(solo_chacras_ocupadas); 

                this.setState({
                    chacras_ocupadas: solo_chacras_ocupadas,
                });
            });
    }


    // no se usa.....
    armarTabla() {
      var tableRef = document.getElementById('tbody');
      var chacras = this.state.chacras;
      
      for(var i=0; i < chacras.length; i++) {
        // Insert a row in the table at the last row
        var row = tableRef.insertRow();

        // Insert a cell in the row at index 0
        var id  = row.insertCell(0);
        var direccion  = row.insertCell(1);
        var localidad  = row.insertCell(2);
        var propietario  = row.insertCell(3);
        var acciones  = row.insertCell(4);

        // Add some text to the new cells:
        id.innerHTML = chacras[i].id;
        direccion.innerHTML = chacras[i].direccion;
        localidad.innerHTML = chacras[i].localidad;
        propietario.innerHTML = chacras[i].propietario;
        acciones.innerHTML = "NEW CELL2";

        
      }
      
    }

    // no se usa.....
    generarTabla() {
      var body = document.getElementById('tbody');
      var chacras = this.state.chacras;
      
      for(var i=0; i < chacras.length; i++) {
        // Insert a row in the table at the last row
        /*var tr = document.createElement("tr");
        tr.className = "odd";
        tr.role="row";

        var td_id = document.createElement("td");
        td_id.className = "sorting_1";
        var id = document.createTextNode(chacras[i].id);
        td_id.appendChild(id);
        
        var td_direccion = document.createElement("td");
        td_direccion.className = "sorting_1";
        var id = document.createTextNode(chacras[i].direccion);
        td_direccion.appendChild(id);

        var td_localidad = document.createElement("td");
        td_localidad.className = "sorting_1";
        var id = document.createTextNode(chacras[i].localidad);
        td_localidad.appendChild(id);

        var td_propietario = document.createElement("td");
        td_propietario.className = "sorting_1";
        var id = document.createTextNode(chacras[i].propietario);
        td_propietario.appendChild(id);

        var td_acciones = document.createElement("td");
        td_acciones.className = "sorting_1";
        var id = document.createTextNode("joa");
        td_acciones.appendChild(id);

        tr.appendChild(td_id);
        tr.appendChild(td_direccion);
        tr.appendChild(td_localidad);
        tr.appendChild(td_propietario);
        tr.appendChild(td_acciones);

        body.appendChild(tr);*/
        
        

        
      }
    }

    
  
    render() {
      
      if ( this.state.show == false ) {
          return <div>No result found for this subscription</div>;
      } 


      // Normal case         
      var chacras = this.state.chacras.map(function(chacra){
        return (
          [chacra.id, chacra.direccion, chacra.localidad, chacra.propietario]
        )
      });
      
      
      

      /*let filas = this.state.chacras.map(chacra =>{
            return (
              
                <tr role="row" className="odd">    
                    <td className="sorting_1">
                        {chacra.id}
                    </td>  
                    <td>
                        {chacra.direccion}
                    </td>   
                    <td>
                        {chacra.localidad}
                    </td> 
                    <td>
                        {chacra.propietario}
                    </td> 
                    <td>
                        {chacra.id}
                    </td> 
                    <td>
                        <div className="text-center">
                            <a className="btn btn-sm btn-warning" id={"editar-" + chacra.id} data-toggle="tooltip" data-placement="top" title="Editar"><i className="fa fa-pencil" /></a>
                            <a className="btn btn-sm btn-danger" id={"eliminar-" + chacra.id} data-toggle="tooltip" data-placement="top" title="Eliminar" style={{marginLeft: 5}}><i className="fa fa-remove" /></a>
                          </div>
                    </td>
                </tr>
            );
      }); */

      

     
              



        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
    <h1>
        Chacras 
        <br/>
        <small>Todas las Chacras</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-tree" /> Chacras</a></li>
        <li className="active"><a href="#">Ver Chacras</a></li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      <div className="row">
        <div className="col-xs-12">
          {/* Aca comienza la tabla */}
          <div className="box box-primary">
            <div className="box-header">
              <h3 className="box-title">Mis Chacras</h3>
              <hr />
            </div>{/* /.box-header */}
            <div className="box-body">
            {/*  <Tabla data={this.state.dataSet} /> */}
            
            
            
            

              {/* <Tabla clase="Chacra" data={this.state.chacras} titulos={this.state.columnas} /> */}
            
            {/*   <table id="tabla-chacras" className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dirección</th>
                    <th>Localidad</th>
                    <th>Propietario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="tbody">
                 <tr>
                    <td>1</td>
                    <td>Chacra 365</td>
                    <td>28 de Julio</td>
                    <td>Samarreño</td>
                    <td>
                      <div className="text-center">
                        <a className="btn btn-sm btn-warning" data-toggle="tooltip" data-placement="top" title="Editar"><i className="fa fa-pencil" /></a>
                        <a className="btn btn-sm btn-danger" data-toggle="tooltip" data-placement="top" title="Eliminar" style={{marginLeft: 5}}><i className="fa fa-remove" /></a>
                      </div>
                    </td>
                  </tr> 
                  {this.generarTabla()} 
                </tbody>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th>Dirección</th>
                    <th>Localidad</th>
                    <th>Propietario</th>
                    <th>Acciones</th>
                  </tr>
                </tfoot>
              </table> */}
            </div>{/* /.box-body */}
          </div>{/* /.box */}
        </div>{/* /.col */}
      </div>{/* /.row */}
    </section>{/* /.content */}
  </div>{/* /.content-wrapper */}</div>

        )
    }

    
}
