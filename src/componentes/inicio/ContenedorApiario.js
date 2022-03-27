import React, { Component } from 'react'
import Apiario from './Apiario';
import ReactDOM from 'react-dom';
import cookie from 'js-cookie';
export default class ContenedorApiario extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        //init controller
        this.abortController = new window.AbortController();

        this.state = {
            ciudad : props.ciudad,
        }
    }

    /**
     * Obtengo todos los apiarios de la ciudad pasada como parámetro {Trelew, Gaiman, Dolavon, 28 de Julio}.
     * Por cada apiario creo un componente "Apiario", al que delego la responsabilidad de completar la tabla.
     */
    componentDidMount () {

        this._isMounted = true;

        var url = new URL("https://backendcolmenainteligente.herokuapp.com/api/apiarios/ciudad");
        var params = {
                        ciudad: this.state.ciudad, 
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
                return;
            }
            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(JSON.stringify(data)); 

            var apiarios = [];

            // Recorro apiarios y creo componentes
            for( var i=0; i< data.length; i++ ) {
                apiarios.push(<Apiario apiario={data[i]} apiario_id={data[i]['id']} direccion_chacra={data[i]['direccion_chacra']} key={data[i]['id']} action={this.props.action}  />);
            }

            // buscaria las colmenas, y nada mas...despues que el chart maneje sus cosas.
            ReactDOM.render(apiarios, document.getElementById('contenedor-'+this.state.ciudad));

        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed: get apiarios por ciudad", error);
            //alert("Ha ocurrido un error: " + error);
        });

    }

    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    render() {
        return (
            <div id={"contenedor-" + this.state.ciudad} className="row">
               {/*   <Apiario />
                 <Apiario />
                 <Apiario /> */}
            </div>
        )
    }
}
