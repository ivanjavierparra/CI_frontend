import React, { Component } from 'react'
import { Link } from "react-router-dom";
import cookie from 'js-cookie';
import { connect } from 'react-redux';
import avatar from '../../images/user2-160x160.jpg';
class Header extends Component {

  constructor(props) {  
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
        data : {},
        avatar : this.props.user.avatar,
        notificaciones : [],
        total : 0,
    }

    // Methods
  }

    handleLogout = (e) => {
        e.preventDefault();
        console.log("logout");
        cookie.remove("token");
        
        this.props.logout();
    }


    componentDidMount () {

      this._isMounted = true;
      
      this.buscarNotificaciones();
        
    }


    buscarNotificaciones() {

      var url = 'https://backendcolmenainteligente.herokuapp.com/api/notificaciones/dashboard';     
      fetch(url, {
          method: 'GET',  
          headers:{
              'Content-Type': 'application/json',
              'Authorization': "Bearer " + cookie.get("token"),
          },
          signal: this.abortController.signal,
      })
      .then(response => response.json())
      .then(data => {

          /* Si alguien modificó el token que está en las cookies
            entonces Laravel me responderá que el token es inválido,
            por lo que cerraré automáticamente la sesión
            */
          if ( typeof data.status !== 'undefined' ) {
            console.log("Modificaste el token....", data.status);
            cookie.remove("token");
            this.abortController.abort();
            this.props.logout();
            return;
          }

          console.log(data);

          this.setState(
              {
                  notificaciones : data['notificaciones'],
                  total : data['total'],
              },
              function() { 
                this.crearNotificaciones(data['notificaciones']);
              }
          ); 
          
          
          
      })
      .catch(function(error) {
          if (error.name === "AbortError") return;
          console.log("Request apiarios failed", error);
          //alert("Ha ocurrido un error al tratar de buscar apiarios: " + error);
      });
  }


  crearNotificaciones(notificaciones) {

    //li-notificacion-0 icon-notificacion-0 txt-notificacion-0

    for( var i = 0; i < notificaciones.length; i++ ) {

      document.getElementById("li-notificacion-" + i).style.display = "block";
      document.getElementById("icon-notificacion-" + i).className = notificaciones[i]['class'] + " " + notificaciones[i]['icono'];
      document.getElementById("txt-notificacion-" + i).innerText = notificaciones[i]['texto'];

    }

  }


    render() {
        return (
           <div>
                <header className="main-header">
                    {/* Logo */}
                    <Link to="/">
                    <span className="logo">
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini"><b>B</b>H</span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg"><b>Bee</b>Hive</span>
                    </span>
                    </Link>
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top">
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
                                        <i className="fa fa-bell-o" />
                                        {this.state.total == 0 ?
                                        ""
                                        :  this.state.total > 99 ?
                                        <span className="label label-warning">+99</span>
                                        :
                                        <span className="label label-warning">{this.state.total}</span>
                                        }
                                    </a>
                                    <ul className="dropdown-menu">
                                        {this.state.total != 0 ?
                                        <li className="header"><strong>{"Usted tiene " +  this.state.total + " notificaciones"}</strong></li>
                                        :
                                        <li className="header"><p>{"Usted no tiene nuevas notificaciones"}</p></li>
                                        }
                                        <li>
                                            {/* inner menu: contains the actual data */}
                                            <ul className="menu">
                                                <li id="li-notificacion-0" style={{display:'none'}}> 
                                                    <Link to="/notificaciones">
                                                      <i id="icon-notificacion-0" className="fa fa-users text-aqua" /> <span id="txt-notificacion-0"></span>
                                                    </Link>
                                                </li>
                                                <li id="li-notificacion-1" style={{display:'none'}}>
                                                    <Link to="/notificaciones">
                                                      <i id="icon-notificacion-1" className="fa fa-users text-aqua" /> <span id="txt-notificacion-1"></span>
                                                    </Link>
                                                </li>
                                                <li id="li-notificacion-2" style={{display:'none'}}>
                                                    <Link to="/notificaciones">
                                                      <i id="icon-notificacion-2" className="fa fa-users text-aqua" /> <span id="txt-notificacion-2"></span>
                                                    </Link>
                                                </li>
                                                <li id="li-notificacion-3" style={{display:'none'}}>
                                                    <Link to="/notificaciones">
                                                      <i id="icon-notificacion-3" className="fa fa-users text-aqua" /> <span id="txt-notificacion-3"></span>
                                                    </Link>
                                                </li>
                                                <li id="li-notificacion-4" style={{display:'none'}}>
                                                    <Link to="/notificaciones">
                                                      <i id="icon-notificacion-4" className="fa fa-users text-aqua" /> <span id="txt-notificacion-4"></span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="footer"><Link to="/notificaciones"><strong>Ver todas</strong></Link></li>
                                        {/* <li className="footer"><a href="fake_url">View all</a></li> */}
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
                                        <img src={"https://backendcolmenainteligente.herokuapp.com/api/public/img/" + this.props.user.avatar} className="user-image" alt="User" />
                                        <span className="hidden-xs">{this.props.user.name + " " + this.props.user.lastname}</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        {/* User image */}
                                        <li className="user-header">
                                            <img src={"https://backendcolmenainteligente.herokuapp.com/api/public/img/" + this.props.user.avatar} className="img-circle" alt="User" />
                                            <p>
                                              {this.props.user.name + " " + this.props.user.lastname}
                                              <small>Miembro desde el {this.props.user.created_at.split(' ')[0].split("-")[2] + "-" + this.props.user.created_at.split(' ')[0].split("-")[1] + "-" + this.props.user.created_at.split(' ')[0].split("-")[0] }</small>
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
                                            <Link to="/profile"><button className="btn btn-default btn-flat">Perfil</button></Link>
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

// Acá obtengo de REDUX el usuario actual.
const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(Header)
// export default connect(null,mapDispatchToProps)(Header)
