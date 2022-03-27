import React, { Component } from 'react';
import ProfileImage from './ProfileImage';
import AboutMe from './AboutMe';
import TabTimeline from './TabTimeline';
import TabSettings from './TabSettings';
import TabPasswords from './TabPasswords';
import TabProfileImages from './TabProfileImages';
import cookie from 'js-cookie';

export default class AdminProfile extends Component {

    constructor(props) {  
        super(props);

        this._isMounted = false;
        this.abortController = new window.AbortController();

        this.state = {
            
        }

        // Methods
        
    }

    componentDidMount () {

        this._isMounted = true;

        

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
                <h1>Mi Perfil</h1>
                <ol className="breadcrumb">
                  <li>
                    <a href="#">
                      <i className="fa fa-user" /> Perfil de Usuario
                    </a>
                  </li>
                  <li className="active">Mi Perfil</li>
                </ol>
              </section>
    
              <section className="content">
                <div className="row">
                  <div className="col-md-3">
                    {/* Profile Image */}
                    <ProfileImage />

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
                        <li>
                          <a href="#profileimages" data-toggle="tab">
                            Imagen de Perfil
                          </a>
                        </li>
                        <li>
                          <a href="#passwords" data-toggle="tab">
                            Contraseña
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        {/* <div className="active tab-pane" id="timeline">
                          <TabTimeline />
                        </div> */}
                        {/* /.tab-pane */}
                        <div className="active tab-pane" id="settings">
                          <TabSettings />
                        </div>
                        <div className="tab-pane" id="profileimages">
                          <TabProfileImages />
                        </div>
                        {/* /.tab-pane */}
                        <div className="tab-pane" id="passwords">
                          <TabPasswords />
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
