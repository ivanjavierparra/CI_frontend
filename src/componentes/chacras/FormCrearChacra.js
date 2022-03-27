import React, { Component } from 'react'

export default class FormCrearChacra extends Component {
 
  /**
   * Constructor: defino propiedades, estados y métodos.
   * @props propiedades que me pasa el padre como parámetros.
   */ 
  constructor(props) {
    super(props);

    // Creo mis estados.
    this.state = { 
        direccion : "",
        localidad : "",
        propietario : "",
    };

     // Asocio el metodo a la clase.
     this.handleSubmitChacra = this.handleSubmitChacra.bind(this);
     this.handleChangeDireccion = this.handleChangeDireccion.bind(this);
     this.handleChangeLocalidad = this.handleChangeLocalidad.bind(this);
     this.handleChangePropietario = this.handleChangePropietario.bind(this);
     this.handleChangeValores = this.handleChangeValores.bind(this);
     
  }

  

  /**
     * Capturo el evento de SUBMIT del formulario registrar chacra.
     * Hago validaciones y una llamada AJAX POST al Servidor para crear una chacra.
     * 
     * @param {*} event 
     */
    handleSubmitChacra(event) { 
        // Evito que el formulario se recargue cuando apreto en el botón SUBMIT.
        event.preventDefault();

        // Valido direccion.
        if(this.state.direccion == '') {
          document.getElementById('direccion').style.borderColor = "red";
          alert('Ingrese una dirección.');
          return;
        }

        // Valido localidad.
        if(this.state.localidad == '') {
          document.getElementById('localidad').style.borderColor = "red";
          alert('Ingrese una localidad.');
          return;
        }

        // Valido propietario.
        if(this.state.propietario == '') {
          document.getElementById('propietario').style.borderColor = "red";
          alert('Ingrese un propietario.');
          return;
        }
       
        // END POINT para crear Chacra.
        var url = 'https://backendcolmenainteligente.herokuapp.com/chacras/crear';
        // DATA a enviar.
        var data = {
          'direccion': this.state.direccion,
          'localidad': this.state.localidad,
          'propietario': this.state.propietario,
        };        

        // AJAX POST
        fetch(url, {
            method: 'POST', 
            body: JSON.stringify(data), 
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if( data['resultado' == 200] ) {
                // Mensaje de EXITO.
                alert(data['mensaje']);
                // Cambio estado.
                this.setState({
                  direccion: "",
                  localidad: "",
                  propietario: ""
                });
                // Reseteo formulario.
                document.getElementById("direccion").value = "";
                document.getElementById("localidad").value = "";
                document.getElementById("propietario").value = "";
            }
            else {
                // Mensaje de ERROR.
                alert(data['mensaje']);
            }
        })
        .catch(function(error) {
            console.log("Request failed", error);
            //alert("Ha ocurrido un error: " + error);
        });
    }

    /**
     * Muestro por consola los valores del estado de este componente.
     * @param {*} event 
     */
    handleChangeValores(event) {
        console.log(this.state.direccion);
        console.log(this.state.localidad);
        console.log(this.state.propietario);
    }

    /**
     * El usuario ingreso una dirección nueva.
     * @param {*} event 
     */
    handleChangeDireccion(event) {
      this.setState({direccion: event.target.value});
      if(event.target.value != '') {
        document.getElementById('direccion').style.borderColor = "";
        return;
      }
    }

    /**
     * El usuario ingresó una localidad nueva.
     * @param {*} event 
     */
    handleChangeLocalidad(event) {
      console.log(event.target.value);
      this.setState({localidad: event.target.value});
      if(event.target.value != '') {
          document.getElementById('localidad').style.borderColor = "";
      }
    }

    /**
     * El usuario ingreso un propietario nuevo.
     * @param {*} event 
     */
    handleChangePropietario(event) {
      this.setState({propietario: event.target.value});
      if(event.target.value != '') {
        document.getElementById('propietario').style.borderColor = "";
      }
    }

    render() {
        return (
            <div>
  {/* Content Wrapper. Contains page content */}
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <section className="content-header">
    <h1>
        Chacras
        <br/>
        <small>Nueva Chacra</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="fake_url"><i className="fa fa-tree" /> Chacras</a></li>
        <li className="active">Registrar Chacra</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      <div className="row">
        {/* left column */}
        <div className="col-md-6">
          {/* general form elements */}
          <div className="box box-primary">
            <div className="box-header with-border">
              <h3 className="box-title">Crear nueva Chacra</h3>
            </div>{/* /.box-header */}
            {/* form start */}
            <form role="form" onSubmit={this.handleSubmitChacra}>
              <div className="box-body">
                <div className="form-group">
                  <div className="row">
                      <div className="col-md-3">
                      <label htmlFor="chacra" name="chacra">Chacra</label>
                          <input type="text" className="form-control" value={"Chacra"} id="chacra" name="chacra" disabled />
                      </div>
                      <div className="col-md-9">
                      <label htmlFor="direccion" name="direccion">N°</label>
                          <input type="number" min={1}  className="form-control" value={this.state.direccion} onChange={this.handleChangeDireccion} id="direccion" name="direccion" placeholder="Ingresar dirección" />
                      </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="localidad">Localidad</label>
                  <select className="form-control" style={{width: '100%'}} onChange={this.handleChangeLocalidad} id="localidad" name="localidad">
                    <option value={""}>----- Seleccionar -----</option>
                    <option value={"Trelew"}>Trelew</option>
                    <option value={"Gaiman"}>Gaiman</option>
                    <option value={"Dolavon"}>Dolavon</option>
                    <option value={"28 de Julio"}>28 de Julio</option>
                  </select>
                </div>
                {/*<div className="form-group">
                  <label htmlFor="localidad">Localidad</label>
                  <input type="text" className="form-control" value={this.state.localidad}  onChange={this.handleChangeLocalidad} id="localidad" name="localidad" placeholder="Ingresar Localidad" />
                </div>*/}
                <div className="form-group">
                  <label htmlFor="propietario">Propietario</label>
                  <input type="text" className="form-control" value={this.state.propietario}  onChange={this.handleChangePropietario} id="propietario" name="propietario" placeholder="Ingresar propietario" />
                </div>
              </div>{/* /.box-body */}
              <div className="box-footer">
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>{/* /.box */}
        </div>{/*/.col (left) */}
        {/* right column */}
      </div>   {/* /.row */}
    </section>{/* /.content */}
  </div>{/* /.content-wrapper */}
</div>

        )
    }
}


