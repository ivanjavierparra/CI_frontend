import React, { Component } from "react";
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import Header from "./componentes/base/Header";
import Menu from "./componentes/base/Menu";
import Footer from "./componentes/base/Footer";
import Home from "./componentes/inicio/Home";
import MenuDerecho from "./componentes/base/MenuDerecho";

import Login from "./componentes/login/Login";
import Register from "./componentes/login/Register";

import GraphicsContainer from "./componentes/revisaciones/GraphicsContainer";
import FormCrearApiario from "./componentes/apiarios/FormCrearApiario";
import DataTableApiario from "./componentes/apiarios/DataTableApiario";
import DataTableEstadoApiario from "./componentes/apiarios/DataTableEstadoApiario";
import FormCrearColmena from "./componentes/colmenas/FormCrearColmena";
import DataTableColmena from "./componentes/colmenas/DataTableColmena";
import DataTableEstadoColmena from "./componentes/colmenas/DataTableEstadoColmena";
import DataTableRevisaciones from "./componentes/revisaciones/DataTableRevisaciones";
import ColmenasComparacion from "./componentes/revisaciones/ColmenasComparacion";
import DataTableClima from "./componentes/clima/DataTableClima";
import SignalGraphicsContainer from "./componentes/revisaciones/SignalGraphicsContainer";
import WeatherGraphicsContainer from "./componentes/clima/WeatherGraphicsContainer";
import AlertaHome from "./componentes/inicio/alertas/AlertaHome";
import AlertaCiudad from "./componentes/alertas/AlertaCiudad";
import ContenedorAlertaApiarios from "./componentes/alertas/ContenedorAlertaApiarios";
import DataTableAlertaApiarios from "./componentes/alertas/DataTableAlertaApiarios";
import Estados from "./componentes/estados/Estados";
import DataTableSenal from "./componentes/revisaciones/DataTableSenal";
import DataTableTareas from "./componentes/tareas/DataTableTareas";
import Notificaciones from "./componentes/notificaciones/Notificaciones";

/* Para entender esto: https://medium.com/@benkissi/creating-multiple-layouts-in-react-react-router-v5-cebde25ff6e6 */
import ConMenu from "./componentes/layouts/ConMenu";
import SinMenu from "./componentes/layouts/SinMenu";

import ApicultorProfile from './componentes/profile/ApicultorProfile';
import Profile from "./componentes/login/Profile";
import ProfileExample from "./componentes/login/ProfileExample";
import GuestRoute from "./componentes/login/GuestRoute";
import BeekeeperRoute from "./componentes/login/BeekeeperRoute";
import AdminRoute from "./componentes/login/AdminRoute";
import E404 from "./componentes/login/E404";

import AdminHome from "./componentes/administrator/inicio/AdminHome";
import AdminApiario from "./componentes/administrator/apiarios/AdminApiario";
import AdminApiarioDetalle from "./componentes/administrator/inicio/AdminApiarioDetalle";
import AdminColmena from "./componentes/administrator/colmenas/AdminColmena";
import AdminRevisacion from "./componentes/administrator/revisaciones/AdminRevisacion";
import AdminComparacionColmena from "./componentes/administrator/revisaciones/AdminComparacionColmena";
import AdminSenal from "./componentes/administrator/senal/AdminSenal";
import AdminClima from "./componentes/administrator/climas/AdminClima";
import AdminEstados from "./componentes/administrator/estados/AdminEstados";
import AdminProfile from "./componentes/administrator/profile/AdminProfile";
import AdminUsuarios from "./componentes/administrator/usuarios/AdminUsuarios";
import AdminProfileApicultor from "./componentes/administrator/usuarios/AdminProfileApicultor";
import AdminDataTableApiarios from "./componentes/administrator/apiarios/AdminDataTableApiarios";
import AdminDataTableColmenas from "./componentes/administrator/colmenas/AdminDataTableColmenas";
import AdminDataTableRevisaciones from "./componentes/administrator/revisaciones/AdminDataTableRevisaciones";
import AdminDataTableSenal from "./componentes/administrator/senal/AdminDataTableSenal";
import AdminDataTableClima from "./componentes/administrator/climas/AdminDataTableClima";




export default class App extends Component {
 
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
      //
    };

    // Methods
  }

  
  render() {
    return (
      <Router>
        <div>
          <Switch>
            

            <GuestRoute exact path="/login" component={Login} />
            <GuestRoute exact path="/register" component={Register} />

            

            <BeekeeperRoute exact path="/" component={Home} />
            <BeekeeperRoute exact path="/home" component={Home} />
            <BeekeeperRoute exact path="/apiarios/crear" component={FormCrearApiario} />
            <BeekeeperRoute exact path="/apiarios/consultar" component={DataTableApiario} />
            <BeekeeperRoute exact path="/apiarios/estado/consultar" component={DataTableEstadoApiario} />
            <BeekeeperRoute exact path="/colmenas/crear" component={FormCrearColmena} />
            <BeekeeperRoute exact path="/colmenas/consultar" component={DataTableColmena} />
            <BeekeeperRoute exact path="/colmenas/estado/consultar" component={DataTableEstadoColmena} />
            <BeekeeperRoute exact path="/revisaciones/tempyhum" component={GraphicsContainer} />
            <BeekeeperRoute exact path="/revisaciones/signal" component={SignalGraphicsContainer} />
            <BeekeeperRoute exact path="/revisaciones/signal/listado" component={DataTableSenal} />
            <BeekeeperRoute exact path="/revisaciones/historico" component={DataTableRevisaciones} />
            <BeekeeperRoute exact path="/revisaciones/colmenas/comparacion" component={ColmenasComparacion} />
            <BeekeeperRoute exact path="/clima/charts" component={WeatherGraphicsContainer} />
            <BeekeeperRoute exact path="/clima/historico" component={DataTableClima} />
            <BeekeeperRoute exact path="/alerta/home" component={AlertaHome} />
            <BeekeeperRoute exact path="/estados" component={Estados} />
            <BeekeeperRoute exact path="/tareas" component={DataTableTareas} />
            <BeekeeperRoute exact path="/alertas" component={AlertaCiudad} />
            <BeekeeperRoute exact path="/alertas/ciudad" component={ContenedorAlertaApiarios} />
            <BeekeeperRoute exact path="/alertas/apiarios" component={DataTableAlertaApiarios} />
            <BeekeeperRoute exact path="/profile" component={ApicultorProfile} />
            <BeekeeperRoute exact path="/notificaciones" component={Notificaciones} />
            <BeekeeperRoute exact path="/error_404" component={E404} />
            

            <AdminRoute exact path="/admin/home" component={AdminHome} />
            <AdminRoute exact path="/admin/apiarios" component={AdminApiario} />
            <AdminRoute exact path="/admin/apiarios/detalle" component={AdminApiarioDetalle} />
            <AdminRoute exact path="/admin/apiarios/listado" component={AdminDataTableApiarios} />
            <AdminRoute exact path="/admin/colmenas" component={AdminColmena} />
            <AdminRoute exact path="/admin/colmenas/listado" component={AdminDataTableColmenas} />
            <AdminRoute exact path="/admin/revisaciones/tempyhum" component={AdminRevisacion} />
            <AdminRoute exact path="/admin/revisaciones/tempyhum/listado" component={AdminDataTableRevisaciones} />
            <AdminRoute exact path="/admin/revisaciones/colmenas/comparacion" component={AdminComparacionColmena} />
            <AdminRoute exact path="/admin/senal" component={AdminSenal} />
            <AdminRoute exact path="/admin/senal/listado" component={AdminDataTableSenal} />
            <AdminRoute exact path="/admin/clima" component={AdminClima} />
            <AdminRoute exact path="/admin/clima/listado" component={AdminDataTableClima} />
            <AdminRoute exact path="/admin/estados" component={AdminEstados} />
            <AdminRoute exact path="/admin/profile" component={AdminProfile} />
            <AdminRoute exact path="/admin/profile/apicultor" component={AdminProfileApicultor} />
            <AdminRoute exact path="/admin/usuarios" component={AdminUsuarios} />
            <AdminRoute exact path="/admin/error_404" component={E404} />


            <Route path="/*" component={E404} />
              

          
                
          </Switch>
        </div>
      </Router>
    );
  }
}
