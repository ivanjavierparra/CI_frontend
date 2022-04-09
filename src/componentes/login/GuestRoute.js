import { Route, Redirect } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import cookie from "js-cookie";
import GuestHeader from "./GuestHeader";
import GuestMenu from "./GuestMenu";
import Footer from "../base/Footer";


const GuestRoute = ({ component: Component, ...rest }) => {
  
  const token = cookie.get("token");
  const guest_routes = [
      '/login',
      '/register',
  ];
  
  var user = cookie.get('user');
  if ( user ) user = JSON.parse(user);
  
  console.log("log", rest.path);

  /**
   * La lógica es así, si no estoy logueado, voy a la ruta que me vino
   * por parámetro {/login o /register}.
   * Si estoy logueado y soy apicultor, redirijo el path a /home
   * Si estoy logueado y soy administrador, redirijo a /admin/home
   */
  return (
    <Route
      {...rest}
      render={props =>
        //!token ? (
        !rest.loggedIn ? (
            <div>
                {/* <GuestHeader/>
                <GuestMenu /> */}
          <Component {...props} />
          {/* <Footer /> */}
          </div>
        ) : user.role === "beekeeper" ? (
          <Redirect
            to={{
              pathname: "/home", // Si soy apicultor voy a /home
              state: { from: props.location }
            }}
          />
        ) : (
            <Redirect
            to={{
              pathname: "/admin/home", // Si soy administrador a /admin/home
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

//export default GuestRoute;
const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  };
};
export default connect(mapStateToProps)(GuestRoute);
