import { Route, Redirect } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import cookie from "js-cookie";
import Header from "../base/Header";
import Menu from "../base/Menu";
import Footer from "../base/Footer";
import MenuDerecho from "../base/MenuDerecho";

const BeekeeperRoute = ({ component: Component, ...rest }) => {
  const token = cookie.get("token");
  var user = cookie.get("user");
  if (user) user = JSON.parse(user);

  const beekeeper_routes = [
    "/",
    "/home",
    "/apiarios/crear",
    "/apiarios/consultar",
    "/colmenas/crear",
    "/colmenas/consultar",
    "/revisaciones/tempyhum",
    "/revisaciones/signal",
    "/revisaciones/historico",
    "/clima/charts",
    "/clima/historico",
    "/alerta/home",
    "/alertas",
    "/alertas/ciudad",
    "/alertas/apiarios",
    "/profile"
  ];
  

  /**
   * Este componente "BeekeeperRoute" gestiona las rutas del apicultro.
   * 
   * La lógica es así: primero verifico si estoy logueado y soy administrador,
   * en tal caso, no tendría permisos para acceder a las rutas del apicultor, por
   * lo redirijo al usuario administrador a /admin/home o a /admin/error_404.
   * 
   * Si pasa este if quedan dos opciones, que esté logueado y sea apicultor o que no
   * esté logueado. Si es el primer caso, diractamente redirijo al path, porque se que es un
   * path que le pertence al apicultor. Si es el segundo caso, el usuario no está logueado, por
   * lo que lo redirijo a /login.
   */

  return (
    <Route
      {...rest}
      render={props =>
        //token ? (
        rest.loggedIn && user.role === "admin" ? (
          <Redirect
            to={{
              pathname: "/admin/error_404", // /admin/home
              state: { from: props.location }
            }}
          />
        ) : rest.loggedIn ? (
          <div>
            <Header />
            <Menu />
            <Component {...props} />
            <Footer />
            {/* <MenuDerecho /> */}
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

// return (
//     <Route
//       {...rest}
//       render={props =>
//         //token ? (
//         rest.loggedIn ? (
//             <div>
//             <Header/>
//             <Menu/>
//           <Component {...props} />
//           <Footer/>
//             <MenuDerecho/>
//             </div>
//         ) :
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: props.location }
//             }}
//           />
//       }
//     />
//   );

/*const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  };
};*/
// export default connect(mapStateToProps)(BeekeeperRoute);
// export default BeekeeperRoute;

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  };
};
export default connect(mapStateToProps)(BeekeeperRoute);
