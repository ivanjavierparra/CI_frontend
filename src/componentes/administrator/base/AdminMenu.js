import React, { Fragment, Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import logo from '../../../images/bee_icon.png';

class AdminMenu extends Component {
 
      constructor(props) {
        super(props);
        
        // Creo mis estados.
        this.state = { 
            inicio : false,
            apiarios : false,
            colmenas : false,
            revisaciones : false,
            alertas : false,
        };
      }
  
      handleClick = (e) => {
        e.preventDefault()
        console.log('onclick..',e.target.id);

        // ocultamos todo
        document.getElementById("inicio-ul").style.display = "none";
        document.getElementById("apiarios-ul").style.display = "none";
        document.getElementById("colmenas-ul").style.display = "none";
        document.getElementById("revisaciones-ul").style.display = "none";
        document.getElementById("senal-ul").style.display = "none";
        document.getElementById("climas-ul").style.display = "none";
        document.getElementById("alertas-ul").style.display = "none";
        document.getElementById("usuarios-ul").style.display = "none";

        // mostramos el selccionado
        var item_selected = e.target.id + "-ul";
        try {
          document.getElementById(item_selected).style.display = "block";
        } catch(e) {
          console.log("Que paso?",e);
        }
      
      }

      handleRutaChange = (e) => {
        console.log(e.target);
      }

      render() {
        return (
            <div>
                  {/* Left side column. contains the logo and sidebar */}
                  <aside className="main-sidebar">
                    {/* sidebar: style can be found in sidebar.less */}
                    <section className="sidebar">
                      {/* Sidebar user panel */}
                      <div className="user-panel">
                        <div className="pull-left image">
                          {/* <img src={logo} className="img-circle" alt="User" /> */}
                          <img src={"http://localhost:8000/api/public/img/" + this.props.user.avatar} className="img-circle" alt="User" />
                          {/* <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" /> */}
                        </div>
                        <div className="pull-left info">
                          {/* <p>Juan Emanuel Pérez</p> */}
                            <p>{this.props.user.name + " " + this.props.user.lastname}</p>
                            <a href="fake_url"><i className="fa fa-circle text-success" /> Administrador</a>
                            {/* <a> <i> Monitoreo de Colmenas </i></a> */}
                        </div>
                      </div>  
                      {/* sidebar menu: : style can be found in sidebar.less */}
                      <ul className="sidebar-menu" data-widget="tree">
                        <li className="header">MENÚ PRINCIPAL</li>
                        {/* <li className="treeview">
                          <Link to="/home" value={"inicio"} data-key={"inicio"} onClick={this.handleRutaChange}> 
                            <i className="fa fa-home" /> <span> Inicio </span>
                          </Link>
                        </li> */}
                        <li className="treeview">
                          <a href="#" id="inicio" onClick={this.handleClick}>
                            <i className="fa fa-home" /> <span> Inicio </span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="inicio-ul" className="treeview-menu">
                            <li><Link to="/admin/home"><i className="fa fa-circle-o" /> Home </Link></li> 
                          </ul>
                        </li>   
                        <li className="treeview">
                          <a href="fake_url" id="apiarios" onClick={this.handleClick}>
                            <i className="fa fa-map-marker" />
                            <span>Apiarios</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="apiarios-ul" className="treeview-menu">
                            <li><Link to="/admin/apiarios" value={"apiarios_crear"} data-key={"apiarios_crear"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Apiarios</Link></li>
                            <li><Link to="/admin/apiarios/listado" value={"apiarios_listado"} data-key={"apiarios_listado"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Listado Apiarios</Link></li>
                          </ul>
                        </li>
                        <li className="treeview">
                          <a href="fake_url" id="colmenas" onClick={this.handleClick}>
                            <i className="fa fa-forumbee" />
                            <span>Colmenas</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a> 
                          <ul id="colmenas-ul" className="treeview-menu">
                            <li><Link to="/admin/colmenas" value={"colmenar_crear"} data-key={"colmenar_crear"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Colmenas</Link></li>
                            <li><Link to="/admin/colmenas/listado" value={"colmenar_listado"} data-key={"colmenar_listado"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Listado Colmenas</Link></li>
                          </ul>
                        </li>
                        <li className="treeview">
                          <a href="fake_url" id="revisaciones" onClick={this.handleClick}>
                            <i className="fa fa-thermometer-full" />
                            <span>Temperatura y Humedad</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="revisaciones-ul" className="treeview-menu">
                            <li><Link to="/admin/revisaciones/tempyhum" value={"revisacion_tempyhum"} data-key={"revisacion_tempyhum"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Gráficos</Link></li>
                            <li><Link to="/admin/revisaciones/tempyhum/listado" value={"revisacion_historico"} data-key={"revisacion_historico"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Histórico</Link></li>
                            <li><Link to="/admin/revisaciones/colmenas/comparacion" value={"revisacion_comparacion"} data-key={"revisacion_comparacion"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Comparación de Colmenas</Link></li>
                            {/* <li><a href="#"><i className="fa fa-circle-o" /> Ejemplo </a></li> */}
                          </ul>
                        </li> 
                        <li className="treeview">
                          <a href="#" id="senal" onClick={this.handleClick}>
                            <i className="fa fa-wifi" /> <span> Señal </span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="senal-ul" className="treeview-menu">
                            <li><Link to="/admin/senal"><i className="fa fa-circle-o" /> Gráficos </Link></li> 
                            <li><Link to="/admin/senal/listado"><i className="fa fa-circle-o" /> Histórico </Link></li> 
                          </ul>
                        </li> 
                        <li className="treeview">
                          <a href="fake_url" id="climas" onClick={this.handleClick}>
                            <i className="fa fa-sun-o" />
                            <span>Clima</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="climas-ul" className="treeview-menu">
                            <li><Link to="/admin/clima" value={"clima_charts"} data-key={"clima_charts"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Gráficos </Link></li>
                            <li><Link to="/admin/clima/listado" value={"clima_historico"} data-key={"clima_historico"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Histórico </Link></li>
                          </ul>
                        </li> 
                        <li className="treeview">
                          <a href="fake_url" id="alertas" onClick={this.handleClick}>
                            <i className="fa fa-heartbeat" />
                            <span>Estados</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="alertas-ul" className="treeview-menu">
                            <li><Link to="/admin/estados" value={"alertas"} data-key={"alertas"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" /> Estado de los Apiarios </Link></li>
                          </ul>
                        </li>
                        <li className="treeview">
                          <a href="fake_url" id="usuarios" onClick={this.handleClick}>
                            <i className="fa fa-users" />
                            <span>Usuarios</span>
                            <span className="pull-right-container">
                              <i className="fa fa-angle-left pull-right" />
                            </span>
                          </a>
                          <ul id="usuarios-ul" className="treeview-menu">
                            <li><Link to="/admin/usuarios" value={"usuarios"} data-key={"usuarios"} onClick={this.handleRutaChange}><i className="fa fa-circle-o" />Listado de Usuarios </Link></li>
                          </ul>
                        </li>

                        <hr />
                      </ul>
                    </section>
                    {/* /.sidebar */}
                  </aside>
</div>

        )
    }
}

// Acá obtengo de REDUX el usuario actual.
const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};


export default connect(mapStateToProps,null)(AdminMenu)
