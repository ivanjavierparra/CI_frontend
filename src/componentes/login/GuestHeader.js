import React, { Component } from 'react'
import { Link } from "react-router-dom";
import cookie from 'js-cookie';
import { connect } from 'react-redux';
import avatar from '../../images/user2-160x160.jpg';
class GuestHeader extends Component {

  constructor(props) {  
    super(props);

    this._isMounted = false;
    this.abortController = new window.AbortController();

    this.state = {
        data : {},
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
                                <li className="dropdown user user-menu">
                                    <a href="fake_url" className="dropdown-toggle" data-toggle="dropdown">
                                        <span className="hidden-xs"><i className="fa fa-gears" /></span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        {/* User image */}
                                        <li className="user-header">
                                            <img src={`../dist/img/${this.state.avatar}`} className="img-circle" alt="User" />
                                            <p>
                                              {this.props.user.name + " " + this.props.user.lastname}
                                              <small>Miembro desde 14-10-1990</small>
                                            </p>
                                        </li>
                                        {/* Menu Body */}
                                        <li className="user-body">
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
                                            {/* /.row */}
                                        </li>
                                        {/* Menu Footer*/}
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="fake_url" className="btn btn-default btn-flat">Profile</a>
                                            </div>
                                            <div className="pull-right">
                                               <Link to="/logout" onClick={this.handleLogout}> <button className="btn btn-default btn-flat">Sign out</button> </Link>
                                            </div>
                                        </li>
                                    </ul>
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


export default connect(mapStateToProps,mapDispatchToProps)(GuestHeader)
// export default connect(null,mapDispatchToProps)(Header)
