import React, { Fragment, Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import logo from '../../images/bee_icon.png';

class GuestMenu extends Component {
 
      constructor(props) {
        super(props);
        
        // Creo mis estados.
        this.state = { 
            
        };
      }
  
      
      render() {
        return (
            <div>
                  {/* Left side column. contains the logo and sidebar */}
                  <aside className="main-sidebar">
                    {/* sidebar: style can be found in sidebar.less */}
                    <section className="sidebar">
                      {/* Sidebar user panel */}
                      <div className="user-panel">
                        <div className="pull-left image">
                          <img src={logo} className="img-circle" alt="User" />
                          {/* <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" /> */}
                        </div>
                        <div className="pull-left info">
                          {/* <p>Juan Emanuel Pérez</p> */}
                            <p>{this.props.user.name + " " + this.props.user.lastname}</p>
                           <a href="fake_url"><i className="fa fa-circle text-success" /> Apicultor</a>
                            {/* <a> <i> Monitoreo de Colmenas </i></a> */}
                        </div>
                      </div>  
                      {/* search form  */}
                      {/* <form action="#" method="get" className="sidebar-form">
                        <div className="input-group">
                          <input type="text" name="q" className="form-control" placeholder="Buscar..." />
                          <span className="input-group-btn">
                            <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search" />
                            </button>
                          </span>
                        </div>
                      </form> */}
                      {/* /.search form */}
                      {/* sidebar menu: : style can be found in sidebar.less */}
                      </section>
                    {/* /.sidebar */}
                  </aside>
</div>

        )
    }
}


// Acá obtengo de REDUX el usuario actual.
const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};


export default connect(mapStateToProps,null)(GuestMenu)
