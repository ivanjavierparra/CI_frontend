import React, { Component } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { connect } from "react-redux";
import Error from "./Error";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    // Methods
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.abortController.abort();
  }

  handleInput = e => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleForm = e => {
    e.preventDefault();
    document.getElementById("spinner-login").style.display = "block";

    const data = { email: this.state.email, password: this.state.password };

    axios
      .post("http://localhost:8000/api/auth/login", data)

      .then(res => {
        console.log(res);

        cookie.set("token", res.data.access_token);
        cookie.set("user", res.data.users);
        this.props.setLogin(res.data.users);       

        //this.props.history.push("/profile");
        this.props.history.push("/login");
      })

      .catch(e => this.setState({ errors: e.response.data.errors }));

    /*var url = new URL("http://localhost:8000/api/auth/login");
        fetch(url, {
            method: 'POST', 
            headers:{
                'Content-Type': 'application/json'
            },
            signal: this.abortController.signal,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            
            //  Muestro por consola todos los datos que vinieron del servidor
            console.log(data); 

            this.setState({ 
                errors : data,
            });
        })
        .catch(function(error) {
            if (error.name === "AbortError") return;
            console.log("Request failed: get apiarios por ciudad", error);
            alert("Ha ocurrido un error: " + error);
        }); */

    //this.props.history.push("/profile");
  };

  render() {
    return (
      <div
        className="content-wrapper"
        style={{
          height: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <div className="login-box">
          <div className="login-logo">
            <a href="../../index2.html">
              <b>Bee</b>HIVE
            </a>
          </div>
          {/* /.login-logo */}
          <div className="login-box-body" > {/* style={{backgroundColor:"#ecf0f5"}} */}
            <p className="login-box-msg">Iniciar Sesión</p>
            <form onSubmit={this.handleForm}>
              <Error
                error={
                  this.state.errors["result"] ? this.state.errors["result"] : null
                }
              />
              <div className="form-group has-feedback">
                <input
                  type="email"
                  name="email"
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Email"
                />
                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                <Error
                  error={
                    this.state.errors["email"]
                      ? this.state.errors["email"]
                      : null
                  }
                />
              </div>
              <div className="form-group has-feedback">
                <input
                  type="password"
                  name="password"
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Contraseña"
                />
                <span className="glyphicon glyphicon-lock form-control-feedback" />
                <Error
                  error={
                    this.state.errors["password"]
                      ? this.state.errors["password"]
                      : null
                  }
                />
              </div>
              <div className="row">
                <div className="col-xs-8">
                  <div className="checkbox icheck">
                    <label>
                      <div
                        className="icheckbox_square-blue"
                        aria-checked="false"
                        aria-disabled="false"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            position: "absolute",
                            top: "-20%",
                            left: "-20%",
                            display: "block",
                            width: "140%",
                            height: "140%",
                            margin: 0,
                            padding: 0,
                            background: "rgb(255, 255, 255)",
                            border: 0,
                            opacity: 0
                          }}
                        />
                        <ins
                          className="iCheck-helper"
                          style={{
                            position: "absolute",
                            top: "-20%",
                            left: "-20%",
                            display: "block",
                            width: "140%",
                            height: "140%",
                            margin: 0,
                            padding: 0,
                            background: "rgb(255, 255, 255)",
                            border: 0,
                            opacity: 0
                          }}
                        />
                      </div>{" "}
                      
                    </label>
                  </div>
                </div>
                {/* /.col */}
                <div className="col-xs-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-flat"
                  >
                    Entrar
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
            {/* /.social-auth-links */}
            {/* <a href="#">¿Olvidaste tu contraseña?</a> */}
            {/* <br /> */}
            <Link to="/register">
              Registrarme
            </Link>
          </div>
          {/* /.login-box-body */}
          {/* spinner */}
          <div id={'spinner-login'} style={{display:'none'}}>
            <br />
              <center> <i className="fa fa-spinner fa-pulse fa-2x fa-fw" /> </center>
            <br />
          </div>
          {/* ./spinner */}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLogin: user => dispatch({ type: "SET_LOGIN", payload: user })
  };
};
export default connect(null, mapDispatchToProps)(Login);
