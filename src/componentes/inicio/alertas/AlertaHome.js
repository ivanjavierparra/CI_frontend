import React, { Component } from 'react'
import ContenedorApiarioCiudad from './ContenedorApiarioCiudad';
import TarjetasCiudades from './TarjetasCiudades';
import ChartCiudad from './ChartCiudad';
export default class AlertaHome extends Component {

   

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
            estado : !this.props.location.state ? {estado:"verde"} : this.props.location.state, // {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
            totales : !this.props.location.state ? {totales:0} : this.props.location.state,
            apiarios : [],
            colmenas : [],
        };


        // Methods
        this.refrescarComponente = this.refrescarComponente.bind(this);
    }

    /**
     * Búsqueda de colmenas.
     */
    componentDidMount () {

        this._isMounted = true;
        console.log("Colorcito", this.state.totales);
  
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
        Colmenas del VIRCh 
        <br/>
        <small>Estado de las Colmenas</small>
        <hr/>
      </h1>
      <ol className="breadcrumb">
        <li><a href="#"><i className="fa fa-home" /> Inicio</a></li>
        <li className="active"><a href="#">Alertas</a></li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">

        <ChartCiudad estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} />

        {/* <div className="row">
            
            Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". 
            <TarjetasCiudades  estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
            
        </div> */} {/*/.row */}
            

      {/*
      <div className="row">
        
         Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". 
        <ChartCiudad estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} />
        
      </div>*/} {/* /.row */} 
      
      <div className="row">
        
        {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
        <ContenedorApiarioCiudad ciudad={"Rawson"} estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
        
      </div>{/* /.row */}

      <div className="row">
        
        {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
        <ContenedorApiarioCiudad ciudad={"Trelew"} estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
        
      </div>{/* /.row */}

      <div className="row">
        
        {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
        <ContenedorApiarioCiudad ciudad={"Gaiman"} estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
        
      </div>{/* /.row */}

      <div className="row">
        
        {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
        <ContenedorApiarioCiudad ciudad={"Dolavon"} estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
        
      </div>{/* /.row */}

      <div className="row">
        
        {/* Si por alguna razon el "estado" no se cargó, entonces lo hardcodeo con "verde". */}
        <ContenedorApiarioCiudad ciudad={"28 de Julio"} estado={!this.props.location.state ? {estado:"verde"} : this.props.location.state} totales={!this.props.location.state ? {totales:0} : this.props.location.state} />
        
      </div>{/* /.row */}

      {/* <ContenedorApiarioCiudad ciudad="Trelew" estado={this.state.estado} /> seria un box, dentro del contenedor hacemos un for por cada apiario */}

    </section>{/* /.content */}
  </div>{/* /.content-wrapper */} 
</div>

        )
    }
}
