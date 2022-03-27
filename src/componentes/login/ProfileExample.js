import React, { Component } from "react";
import axios from "axios";
import cookie from 'js-cookie';
import { connect } from "react-redux";

class ProfileExample extends Component {

  constructor(props) {
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
      name: this.props.name,
      lastname : !this.props.lastname ? "" : this.props.lastname,
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
    };

    axios
      .post("https://backendcolmenainteligente.herokuapp.com/api/auth/update", data)

      .then(res => {

          console.log(res.data);

          //this.props.updateUser
      })

      .catch(e => this.setState({ errors: e.response.data }));

    
  };

  render() {

    const error = this.state.errors;

    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>User Profile</h1>
            <ol className="breadcrumb">
              <li>
                <a href="#">
                  <i className="fa fa-dashboard" /> Home
                </a>
              </li>
              <li>
                <a href="#">Examples</a>
              </li>
              <li className="active">User profile</li>
            </ol>
          </section>

          <section className="content">
            
          <div className="register-box">
          <div className="register-logo">
            <a href="../../index2.html">
              <b>Admin</b>LTE
            </a>
          </div>
          <div className="register-box-body">
            <p className="login-box-msg">Register a new membership</p>
            <form onSubmit={this.handleForm}>
              { error.error ? <p style={{color:"red"}}>{ error.error}</p> : "" }
              <div className="form-group has-feedback">
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="First name"
                />
                <span className="glyphicon glyphicon-user form-control-feedback" />
              </div>
              <div className="form-group has-feedback">
                <input
                  type="text"
                  name="lastname"
                  value={this.state.lastname}
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="Last name"
                />
                <span className="glyphicon glyphicon-user form-control-feedback" />
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
                      I agree to the <a href="#">terms</a>
                    </label>
                  </div>
                </div>
                {/* /.col */}
                <div className="col-xs-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-flat"
                  >
                    Update
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
            <a href="login.html" className="text-center">
              I already have a membership
            </a>
          </div>
          {/* /.form-box */}
        </div>

            
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      name: state.auth.user.name,
      lastname : state.auth.user.lastname
  };
}
export default connect(mapStateToProps, null)(ProfileExample);