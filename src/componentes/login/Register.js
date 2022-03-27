import React, { Component } from "react";
import axios from "axios";
import cookie from 'js-cookie';
import Error from './Error';
import { Link } from "react-router-dom";
export default class Register extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
      name: "",
      lastname : "",
      email: "",
      password: "",
      password_confirmation: "",
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

    const data = {
      name: this.state.name,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };

    axios
      .post("http://localhost:8000/api/auth/register", data)

      .then(res => {

          console.log(res);

          // Aca podria NO setear las cookies, y dreccionar al login
          cookie.set('token',res.data.access_token);
          cookie.set('user',res.data.users);

          this.props.history.push("/profile");
      })

      .catch(e => this.setState({ errors: e.response.data.errors }));

    
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
          backgroundColor: "white",
        }}
      >
        <div className="register-box">
          <div className="register-logo">
            <a href="../../index2.html">
              <b>Bee</b>HIVE
            </a>
          </div>
          <div className="register-box-body">
            <p className="login-box-msg">Registrar una nueva cuenta</p>
            <form onSubmit={this.handleForm}>
              <div className="form-group has-feedback">
                <input
                  type="text"
                  name="name"
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Nombre"
                />
                <span className="glyphicon glyphicon-user form-control-feedback" />
                <Error
                  error={
                    this.state.errors["name"]
                      ? this.state.errors["name"]
                      : null
                  }
                />
              </div>
              <div className="form-group has-feedback">
                <input
                  type="text"
                  name="lastname"
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Apellido"
                />
                <span className="glyphicon glyphicon-user form-control-feedback" />
                <Error
                  error={
                    this.state.errors["lastname"]
                      ? this.state.errors["lastname"]
                      : null
                  }
                />
              </div>              
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
              <div className="form-group has-feedback">
                <input
                  type="password"
                  name="password_confirmation"
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Repetir contraseña"
                />
                <span className="glyphicon glyphicon-log-in form-control-feedback" />
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
                      {/* I agree to the <a href="#">terms</a> */}
                      <Link to="/login">
              Ya tego una cuenta
            </Link>
                    </label>
                  </div>
                </div>
                {/* /.col */}
                <div className="col-xs-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-flat"
                  >
                    Registrar
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
          </div>
          {/* /.form-box */}
        </div>
      </div>
    );
  }
}
