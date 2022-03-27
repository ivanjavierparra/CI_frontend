import React, { Component } from 'react'

export default class AdminMenuDerecho extends Component {
    render() {
        return (
           <div>
                {/* Control Sidebar */}
                <aside className="control-sidebar control-sidebar-dark" style={{display: 'none'}}>
                    {/* Create the tabs */}
                    <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
                        <li><a href="#control-sidebar-home-tab" data-toggle="tab"><i className="fa fa-home" /></a></li>
                        <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i className="fa fa-gears" /></a></li>
                    </ul>
                    {/* Tab panes */}
                    <div className="tab-content">
                        {/* Home tab content */}
                        <div className="tab-pane" id="control-sidebar-home-tab">
                            <h3 className="control-sidebar-heading">Recent Activity</h3>
                            <ul className="control-sidebar-menu">
                                <li>
                                  <a href="fake_url">
                                    <i className="menu-icon fa fa-birthday-cake bg-red" />
                                    <div className="menu-info">
                                      <h4 className="control-sidebar-subheading">Langdon's Birthday</h4>
                                      <p>Will be 23 on April 24th</p>
                                    </div>
                                  </a>
                                </li>
                                <li>
                                    <a href="fake_url">
                                      <i className="menu-icon fa fa-user bg-yellow" />
                                      <div className="menu-info">
                                        <h4 className="control-sidebar-subheading">Frodo Updated His Profile</h4>
                                        <p>New phone +1(800)555-1234</p>
                                      </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="fake_url">
                                      <i className="menu-icon fa fa-envelope-o bg-light-blue" />
                                      <div className="menu-info">
                                        <h4 className="control-sidebar-subheading">Nora Joined Mailing List</h4>
                                        <p>nora@example.com</p>
                                      </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="fake_url">
                                      <i className="menu-icon fa fa-file-code-o bg-green" />
                                      <div className="menu-info">
                                        <h4 className="control-sidebar-subheading">Cron Job 254 Executed</h4>
                                        <p>Execution time 5 seconds</p>
                                      </div>
                                    </a>
                                </li>
                            </ul>
                            {/* /.control-sidebar-menu */}
                            <h3 className="control-sidebar-heading">Tasks Progress</h3>
                            <ul className="control-sidebar-menu">
                                <li>
                                  <a href="fake_url">
                                    <h4 className="control-sidebar-subheading">
                                      Custom Template Design
                                      <span className="label label-danger pull-right">70%</span>
                                    </h4>
                                    <div className="progress progress-xxs">
                                      <div className="progress-bar progress-bar-danger" style={{width: '70%'}} />
                                    </div>
                                  </a>
                                </li>
                                <li>
                                  <a href="fake_url">
                                    <h4 className="control-sidebar-subheading">
                                      Update Resume
                                      <span className="label label-success pull-right">95%</span>
                                    </h4>
                                    <div className="progress progress-xxs">
                                      <div className="progress-bar progress-bar-success" style={{width: '95%'}} />
                                    </div>
                                  </a>
                                </li>
                                <li>
                                  <a href="fake_url">
                                    <h4 className="control-sidebar-subheading">
                                      Laravel Integration
                                      <span className="label label-warning pull-right">50%</span>
                                    </h4>
                                    <div className="progress progress-xxs">
                                      <div className="progress-bar progress-bar-warning" style={{width: '50%'}} />
                                    </div>
                                  </a>
                                </li>
                                <li>
                                  <a href="fake_url">
                                    <h4 className="control-sidebar-subheading">
                                      Back End Framework
                                      <span className="label label-primary pull-right">68%</span>
                                    </h4>
                                    <div className="progress progress-xxs">
                                      <div className="progress-bar progress-bar-primary" style={{width: '68%'}} />
                                    </div>
                                  </a>
                                </li>
                            </ul>
                            {/* /.control-sidebar-menu */}
                        </div>
                        {/* /.tab-pane */}
                        {/* Stats tab content */}
                        <div className="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
                        {/* /.tab-pane */}
                        {/* Settings tab content */}
                        <div className="tab-pane" id="control-sidebar-settings-tab">
                            <form method="post">
                                <h3 className="control-sidebar-heading">General Settings</h3>
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Report panel usage
                                    <input type="checkbox" className="pull-right" defaultChecked />
                                  </label>
                                  <p>
                                    Some information about this general settings option
                                  </p>
                                </div>
                                {/* /.form-group */}
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Allow mail redirect
                                    <input type="checkbox" className="pull-right" defaultChecked />
                                  </label>
                                  <p>
                                    Other sets of options are available
                                  </p>
                                </div>
                                {/* /.form-group */}
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Expose author name in posts
                                    <input type="checkbox" className="pull-right" defaultChecked />
                                  </label>
                                  <p>
                                    Allow the user to show his name in blog posts
                                  </p>
                                </div>
                                {/* /.form-group */}
                                <h3 className="control-sidebar-heading">Chat Settings</h3>
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Show me as online
                                    <input type="checkbox" className="pull-right" defaultChecked />
                                  </label>
                                </div>
                                {/* /.form-group */}
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Turn off notifications
                                    <input type="checkbox" className="pull-right" />
                                  </label>
                                </div>
                                {/* /.form-group */}
                                <div className="form-group">
                                  <label className="control-sidebar-subheading">
                                    Delete chat history
                                    <a href="fake_url" className="text-red pull-right"><i className="fa fa-trash-o" /></a>
                                  </label>
                                </div>
                                {/* /.form-group */}
                            </form>
                        </div>
                        {/* /.tab-pane */}
                    </div>
                </aside>
                {/* /.control-sidebar */}
                {/* Add the sidebar's background. This div must be placed
              immediately after the control sidebar */}
                <div className="control-sidebar-bg" />
            </div>
        )
    }
}
