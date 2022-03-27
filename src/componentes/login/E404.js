import React, { Component } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { connect } from "react-redux";
import Error from "./Error";

export default class E404 extends Component {
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
        <section className="content">
          <div className="error-page">
            <h2 className="headline text-yellow"> 404</h2>
            <div className="error-content" style={{marginTop:50}}>
              <h3>
                <i className="fa fa-warning text-yellow" /> Oops! Página no encontrada.
              </h3>
              <p>
                No hemos podido encontrar la página que estás buscando.
              </p>
              {/* <form className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    name="search"
                    className="form-control"
                    placeholder="Buscar"
                  />
                  <div className="input-group-btn">
                    <button
                      type="button"
                      name="button"
                      className="btn btn-warning btn-flat"
                    >
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </form> */}
            </div>
            {/* /.error-content */}
          </div>
          {/* /.error-page */}
        </section>
      </div>
    );
  }
}


