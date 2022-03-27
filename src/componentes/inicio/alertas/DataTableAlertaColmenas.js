import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import cookie from "js-cookie";

export default class DataTableAlertaColmenas extends Component {
  

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
      apiarios: this.props.apiarios,
      estado: this.props.estado,
      totales: this.props.totales, // Puede ser: "verde", "amarillo" o "rojo".
      datos_alertas: [],

      show: false,
      data: {
        columns: [
          {
            label: <span>Apiario</span>,
            field: "apiario", // con este campo identificamos las filas.
            sort: "asc"
            //width: 150
          },
          {
            label: <span>Colmena</span>,
            field: "colmena", // con este campo identificamos las filas.
            sort: "asc"
            //width: 150
          },
          {
            label: <span>Temperatura</span>,
            field: "temperatura", // con este campo identificamos las filas.
            sort: "asc"
            //width: 150
          },
          {
            label: <span>Humedad</span>,
            field: "humedad", // con este campo identificamos las filas.
            sort: "asc"
            //width: 150
          },
          {
            label: <span>Última Actualización</span>,
            field: "fecha", // con este campo identificamos las filas.
            sort: "asc"
            //width: 150
          }
        ],
        rows: [
          {
            temperatura: (
              <div>
                {" "}
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
              </div>
            )
          }
        ]
      }
    };

    // Methods
    this.obtenerIDsApiarios = this.obtenerIDsApiarios.bind(this);
    this.completarDatatable = this.completarDatatable.bind(this);
    this.obtenerDatosColmena = this.obtenerDatosColmena.bind(this);
  }

  /**
   * Si se selecciona otro apiario en la clase padre (GraphicsContainer) entonces se actualiza el state de esta Clase.
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        apiarios: nextProps.apiarios,
        estado: nextProps.estado,
        totales: nextProps.totales
      } //() => this.componentDidMount()
    ); // NUevamente un AJAX CALL...: cuidado que los estados son asincronos!!!
  }

  obtenerIDsApiarios() {
    var apiarios = this.state.apiarios;
    var ids = new Array();
    for (var i = 0; i < apiarios.length; i++) {
      ids.push(apiarios[i]["id"]);
    }
    return ids;
  }

  /**
   * Búsqueda de colmenas.
   */
  componentDidMount() {
    // console.log("SOY un datatable!", this.props.totales);
    this._isMounted = true;
    // Si no hay colmenas en el estado pasado por parametro (verde, amarillo, rojo), entonces no consulto al servidor!!!!
    if (this.props.totales == 0) {
      this.setState(
        {
          data: { columns: this.state.data.columns, rows: [] },
          show: true
        },
        function() {
          //console.log("Datos del DataTable",JSON.stringify(this.state.data.rows));
        }
      );
    } else {
      this.obtenerDatosColmena();
    }
  }

  obtenerDatosColmena() {
    var ids_apiarios = this.obtenerIDsApiarios();

    var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios/alertas");
    var params = {
      apiarios: ids_apiarios,
      estado: this.state.estado
    };

    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookie.get("token")
      },
      signal: this.abortController.signal,
    })
      .then(response => response.json())
      .then(data => {
        
        /* Si alguien modificó el token que está en las cookies
        entonces Laravel me responderá que el token es inválido,
        por lo que cerraré automáticamente la sesión
        */
        if (typeof data.status !== "undefined") {
            console.log("Modificaste el token....", data.status);
            this.abortController.abort();
            //var token = cookie.get("token");
            //if(token) cookie.remove("token");
            return;
        }

        console.log("Datos del DT", data);

        this.setState(
          {
            datos_alertas: data["datos"]
          },
          function() {
            // Completo el datatable
            this.completarDatatable(data["datos"]);
          }
        );
      })
      .catch(function(error) {
        console.log("Request apiarios failed", error);
        //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
  }

  /**
   * datos tiene el siguiente formato: ([apiario,[(colmena,revisacion)]])
   */
  completarDatatable(datos) {
    var data = [];
    var columns = this.state.data.columns;

    for (var i = 0; i < datos.length; i++) {
      var apiario = datos[i][0];
      var colmenas_revisaciones = datos[i][1];

      for (var j = 0; j < colmenas_revisaciones.length; j++) {
        var colmena = colmenas_revisaciones[j][0];
        var revisacion = colmenas_revisaciones[j][1];
        var row = "";

        if (revisacion) {
          row = {
            apiario: apiario["direccion_chacra"] + " - " + apiario["nombre_fantasia"],
            colmena: colmena["identificacion"],
            temperatura: revisacion["temperatura"] + "°C",
            humedad: revisacion["humedad"] + "%",
            fecha:
              revisacion["fecha_revisacion"].split("-")[2] +
              "-" +
              revisacion["fecha_revisacion"].split("-")[1] +
              "-" +
              revisacion["fecha_revisacion"].split("-")[0] +
              " " +
              revisacion["hora_revisacion"].substr(0,5)
          };
        } else {
          row = {
            apiario: apiario["direccion_chacra"] + " - " + apiario["nombre_fantasia"],
            colmena: colmena["identificacion"],
            temperatura: "--- °C",
            humedad: "--- %",
            fecha: "---"
          };
        }

        data.push(row);
      }
    }

    // Seteo los datos del DataTable.
    this.setState(
      {
        data: { columns: columns, rows: data },
        show: true
      },
      function() {
        console.log(
          "Datos del DataTable",
          JSON.stringify(this.state.data.rows)
        );
      }
    );
  }

  refrescarComponente() {
    window.location.reload(true);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }

  rerenderParentCallback() {
    console.log("Entre al callback!!!!!!");
    //this.forceUpdate();
    window.location.reload();
  }

  render() {
    return (
      <div className="col-md-12">
        <MDBDataTable
          striped
          //bordered
          small
          hover
          bordered
          responsive={true}
          //sorting={false}
          sorting={"true"}
          //scrollY
          //rows = {this.state.rows}
          //columns={this.state.columns}
          data={this.state.data}
        />
      </div>
    );
  }
}
