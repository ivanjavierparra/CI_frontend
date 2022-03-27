import React, { Component } from 'react'
import { Link } from "react-router-dom";
import cookie from 'js-cookie';
import { connect } from 'react-redux';
//import avatar from '../../../images/user2-160x160.jpg';

class AdminHeader extends Component {

  

  constructor(props) {  
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();
    

    this.state = {
        data: {},
        avatar : this.props.user.avatar,
        
    }

    // Methods
  }

    handleLogout = (e) => {
        e.preventDefault();
        console.log("logout");
        cookie.remove("token");
        
        this.props.logout();
    }

    onClickNotifications = (e) => {
      e.preventDefault()
    }

    render() {
        console.log("avatar", this.state.avatar, process);

        return (
           <div>
                <header className="main-header">
                    {/* Logo */}
                    <Link to="/">
                    <span className="logo" style={{backgroundColor:"#008d4c"}}>
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini"><b>B</b>H</span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg"><b>Bee</b>Hive</span>
                    </span>
                    </Link>
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top" style={{backgroundColor:"#00a65a"}}>
                        {/* Sidebar toggle button*/}
                        <a href="fake_url" className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                {/* Messages: style can be found in dropdown.less*/}
                                {/* <li className="dropdown messages-menu">
                                    <a href="fake_url" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="fa fa-envelope-o" />
                                        <span className="label label-success">4</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="header">You have 4 messages</li>
                                        <li>
                                            <ul className="menu">
                                                <li>
                                                    <a href="fake_url">
                                                      <div className="pull-left">
                                                          <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
                                                      </div>
                                                      <h4>
                                                          Support Team
                                                          <small><i className="fa fa-clock-o" /> 5 mins</small>
                                                      </h4>
                                                      <p>Why not buy a new awesome theme?</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <div className="pull-left">
                                                          <img src="dist/img/user3-128x128.jpg" className="img-circle" alt="User" />
                                                      </div>
                                                      <h4>
                                                          AdminLTE Design Team
                                                          <small><i className="fa fa-clock-o" /> 2 hours</small>
                                                      </h4>
                                                      <p>Why not buy a new awesome theme?</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                        <div className="pull-left">
                                                            <img src="dist/img/user4-128x128.jpg" className="img-circle" alt="User" />
                                                        </div>
                                                        <h4>
                                                            Developers
                                                            <small><i className="fa fa-clock-o" /> Today</small>
                                                        </h4>
                                                        <p>Why not buy a new awesome theme?</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                        <div className="pull-left">
                                                            <img src="dist/img/user3-128x128.jpg" className="img-circle" alt="User" />
                                                        </div>
                                                        <h4>
                                                            Sales Department
                                                            <small><i className="fa fa-clock-o" /> Yesterday</small>
                                                        </h4>
                                                        <p>Why not buy a new awesome theme?</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <div className="pull-left">
                                                          <img src="dist/img/user4-128x128.jpg" className="img-circle" alt="User" />
                                                      </div>
                                                      <h4>
                                                          Reviewers
                                                          <small><i className="fa fa-clock-o" /> 2 days</small>
                                                      </h4>
                                                      <p>Why not buy a new awesome theme?</p>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="footer"><a href="fake_url">See All Messages</a></li>
                                    </ul>
                                </li> */}
                                {/* Notifications: style can be found in dropdown.less */}
                                <li className="dropdown notifications-menu">
                                    <a href="fake_url" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="fa fa-tags" />
                                        <span className="label label-warning">10</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="header"><i className="fa fa-user text-green" /> Bienvenido!</li>
                                        {/* <li className="header">You have 10 notifications</li> */}
                                        {/* Falta implementar 
                                        <li>
                                            <ul className="menu">
                                                <li>
                                                    <a href="fake_url">
                                                      <i className="fa fa-users text-aqua" /> 5 new members joined today
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <i className="fa fa-warning text-yellow" /> Very long description here that may not fit into the
                                                      page and may cause design problems
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <i className="fa fa-users text-red" /> 5 new members joined
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <i className="fa fa-shopping-cart text-green" /> 25 sales made
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="fake_url">
                                                      <i className="fa fa-user text-red" /> You changed your username
                                                    </a>
                                                </li>
                                            </ul>
                                        </li> */}
                                        {/* <li className="footer"><a href="fake_url">View all</a></li> */}
                                        <li className="footer"><a href="#!" onClick={this.onClickNotifications}><i className="fa fa-forumbee text-green" />BeeHive</a></li>
                                      </ul>
                                </li>
                                {/* Tasks: style can be found in dropdown.less */}
                                {/* <li className="dropdown tasks-menu">
                                    <a href="fake_url" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="fa fa-flag-o" />
                                        <span className="label label-danger">9</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="header">You have 9 tasks</li>
                                        <li>
                                            <ul className="menu">
                                                <li>
                                                  <a href="fake_url">
                                                    <h3>
                                                      Design some buttons
                                                      <small className="pull-right">20%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                      <div className="progress-bar progress-bar-aqua" style={{width: '20%'}} role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                                        <span className="sr-only">20% Complete</span>
                                                      </div>
                                                    </div>
                                                  </a>
                                                </li>
                                                <li>
                                                  <a href="fake_url">
                                                    <h3>
                                                      Create a nice theme
                                                      <small className="pull-right">40%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                      <div className="progress-bar progress-bar-green" style={{width: '40%'}} role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                                        <span className="sr-only">40% Complete</span>
                                                      </div>
                                                    </div>
                                                  </a>
                                                </li>
                                                <li>
                                                  <a href="fake_url">
                                                    <h3>
                                                      Some task I need to do
                                                      <small className="pull-right">60%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                      <div className="progress-bar progress-bar-red" style={{width: '60%'}} role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                                        <span className="sr-only">60% Complete</span>
                                                      </div>
                                                    </div>
                                                  </a>
                                                </li>
                                                <li>
                                                  <a href="fake_url">
                                                    <h3>
                                                      Make beautiful transitions
                                                      <small className="pull-right">80%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                      <div className="progress-bar progress-bar-yellow" style={{width: '80%'}} role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                                        <span className="sr-only">80% Complete</span>
                                                      </div>
                                                    </div>
                                                  </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="footer">
                                          <a href="fake_url">View all tasks</a>
                                        </li>
                                    </ul>
                                </li> */}
                                {/* User Account: style can be found in dropdown.less */}
                                <li className="dropdown user user-menu">
                                    <a href="fake_url" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src={"http://localhost:8000/api/public/img/" + this.props.user.avatar} className="user-image" alt="User" />
                                        <span className="hidden-xs">{this.props.user.name + " " + this.props.user.lastname}</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        {/* User image */}
                                        <li className="user-header" style={{backgroundColor:"#00a65a"}} >
                                            <img src={"http://localhost:8000/api/public/img/" + this.props.user.avatar} className="img-circle" alt="User" />
                                            <p>
                                              {this.props.user.name + " " + this.props.user.lastname}
                                              <small>Miembro desde {this.props.user.created_at.split(' ')[0].split("-")[2] + "-" + this.props.user.created_at.split(' ')[0].split("-")[1] + "-" + this.props.user.created_at.split(' ')[0].split("-")[0] }</small>
                                            </p>
                                        </li>
                                        {/* Menu Body */}
                                        {/* <li className="user-body">
                                            <div className="row">
                                                <div className="col-xs-4 text-center">
                                                  <a href="fake_url">Followers</a>
                                                </div>
                                                <div className="col-xs-4 text-center">
                                                  <a href="fake_url">Sales</a>
                                                </div>
                                                <div className="col-xs-4 text-center">
                                                  <a href="fake_url">Friends</a>
                                                </div>
                                            </div>
                                        </li> */}
                                        {/* Menu Footer*/}
                                        <li className="user-footer">
                                            <div className="pull-left">
                                              <Link to="/admin/profile"><button className="btn btn-default btn-flat">Perfil</button></Link>
                                            </div>
                                            <div className="pull-right">
                                               <Link to="/logout" onClick={this.handleLogout}> <button className="btn btn-default btn-flat">Salir</button> </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                {/* Control Sidebar Toggle Button */}
                                <li>
                                  {/* <a href="fake_url" data-toggle="control-sidebar"><i className="fa fa-gears" /></a> */}
                                </li>
                              </ul>
                        </div>
                    </nav>
                </header>
            </div>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         loggedIn: state.auth.loggedIn
//     };
// };


// Acá le digo a REDUX que cierre la sesión.
const mapDispatchToProps = dispatch => {
  return {
      logout: () => dispatch({type:'SET_LOGOUT'})
  };
};

// Acá obtengo de REDUX el usuario actual, el cual se puede acceder desde props: por ejemplo, this.props.user.name
const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(AdminHeader)
//export default connect(null,mapDispatchToProps)(AdminHeader)
