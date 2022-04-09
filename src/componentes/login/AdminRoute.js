import { Route, Redirect } from "react-router-dom";
import React from "react";
import AdminHeader from "../administrator/base/AdminHeader";
import AdminMenu from "../administrator/base/AdminMenu";
import AdminFooter from "../administrator/base/AdminFooter";
import AdminMenuDerecho from "../administrator/base/AdminMenuDerecho";
import { connect } from "react-redux";
import cookie from "js-cookie";

const AdminRoute = ({ component: Component, ...rest }) => {
  const token = cookie.get("token");
  var user = cookie.get("user");
  if (user) user = JSON.parse(user);

  
  /**
   * Las rutas que maneja este componente "AdminRoute" son propias
   * del administrador. Por lo tanto, si el usuario logueado es
   * un apicultor, e intenta acceder a una ruta del administrador, rechazo
   * esta petición redireccionandolo a una pagina de error /error_404. Otra opción
   * es redireccionarlo al /home.
   *
   * Si soy administrador, y la ruta a la que quiero acceder es del
   * administrador, entonces permito que vaya sin problemas.
   *
   * Por último, si no estoy logueado, redirecciono al /login, este path
   * es administrador por GuestRoute.
   */
  return (
    <Route
      {...rest}
      render={props =>
        //token ? (
        rest.loggedIn && user.role === "beekeeper" ? (
          <Redirect
            to={{
              pathname: "/error_404", // /home
              state: { from: props.location }
            }}
          />
        ) : rest.loggedIn ? (
          <div>
            <AdminHeader />
            <AdminMenu />
            <Component {...props} />
            <AdminFooter />
            {/* <AdminMenuDerecho /> */}
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  };
};
export default connect(mapStateToProps)(AdminRoute);
//export default Admin;
