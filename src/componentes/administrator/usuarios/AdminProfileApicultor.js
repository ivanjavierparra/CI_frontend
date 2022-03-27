import React, { Component } from 'react';
import ProfileImage from './ProfileImage';
import AboutMe from './AboutMe';
import TabTimeline from './TabTimeline';
import TabSettings from './TabSettings';
import TabPasswords from './TabPasswords';
import TabProfileImages from './TabProfileImages';
import TabApiarios from './TabApiarios';
import cookie from 'js-cookie';

export default class AdminProfileApicultor extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
          apicultor : this.props.location.state.apicultor,
          apiarios : this.props.location.state.apiarios,
          colmenas : this.props.location.state.colmenas,
        }

        // Methods
        
    }

    componentDidMount () {

        this._isMounted = true;

        console.log("Perfil del apicultor", this.state.apicultor);

    }

    componentWillUnmount() {
      this._isMounted = false;
      this.abortController.abort();
    }

    


    

    

    

    

    render() {
        
        
        return (
            <div>
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
              {/* Content Header (Page header) */}
              <section className="content-header">
                <h1>Perfil de {this.state.apicultor.name + " " + this.state.apicultor.lastname} </h1>
                <ol className="breadcrumb">
                  <li>
                    <a href="#">
                      <i className="fa fa-user" /> Perfil de Usuario
                    </a>
                  </li>
                  <li className="active">Perfil del apicultor </li>
                </ol>
              </section>
    
              <section className="content">
                <div className="row">
                  <div className="col-md-3">
                    {/* Profile Image */}
                    <ProfileImage apicultor={this.state.apicultor} apiarios={this.state.apiarios} colmenas={this.state.colmenas} />

                    {/* About Me Box */}
                    {/* <AboutMe /> */}
                    
                  </div>
                  {/* /.col */}
                  <div className="col-md-9">
                    <div className="nav-tabs-custom">
                      <ul className="nav nav-tabs">
                        {/* <li className="active">
                          <a href="#timeline" data-toggle="tab">
                            Timeline
                          </a>
                        </li> */}
                        <li className="active">
                          <a href="#settings" data-toggle="tab">
                            Datos
                          </a>
                        </li>
                        {/* <li>
                          <a href="#profileimages" data-toggle="tab">
                            Imagen de Perfil
                          </a>
                        </li> */}
                        {/* <li>
                          <a href="#passwords" data-toggle="tab">
                            Contraseña
                          </a>
                        </li> */}
                        <li>
                          <a href="#apiarios_tab" data-toggle="tab">
                            Apiarios
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        {/* <div className="active tab-pane" id="timeline">
                          <TabTimeline />
                        </div> */}
                        {/* /.tab-pane */}
                        <div className="active tab-pane" id="settings">
                          <TabSettings apicultor={this.state.apicultor} />
                        </div>
                        {/* <div className="tab-pane" id="profileimages">
                          <TabProfileImages />
                        </div> */}
                        {/* /.tab-pane */}
                        {/* <div className="tab-pane" id="passwords">
                          <TabPasswords />
                        </div> */}
                        {/* /.tab-pane */}
                        <div className="tab-pane" id="apiarios_tab">
                          <TabApiarios apicultor={this.state.apicultor} />
                        </div>
                        {/* /.tab-pane */}
                      </div>
                      {/* /.tab-content */}
                    </div>
                    {/* /.nav-tabs-custom */}
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </section>
            </div>
          </div>
            
                  

                                      
        )
    }
}