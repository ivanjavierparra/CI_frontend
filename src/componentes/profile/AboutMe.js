import React, { Component } from 'react'

export default class AboutMe extends Component {
    render() {
        return (
                    <div className="box box-primary">
                      <div className="box-header with-border">
                        <h3 className="box-title">About Me</h3>
                      </div>
                      {/* /.box-header */}
                      <div className="box-body">
                        <strong>
                          <i className="fa fa-book margin-r-5" /> Education
                        </strong>
                        <p className="text-muted">
                          B.S. in Computer Science from the University of Tennessee
                          at Knoxville
                        </p>
                        <hr />
                        <strong>
                          <i className="fa fa-map-marker margin-r-5" /> Location
                        </strong>
                        <p className="text-muted">Malibu, California</p>
                        <hr />
                        <strong>
                          <i className="fa fa-pencil margin-r-5" /> Skills
                        </strong>
                        <p>
                          <span className="label label-danger">UI Design</span>
                          <span className="label label-success">Coding</span>
                          <span className="label label-info">Javascript</span>
                          <span className="label label-warning">PHP</span>
                          <span className="label label-primary">Node.js</span>
                        </p>
                        <hr />
                        <strong>
                          <i className="fa fa-file-text-o margin-r-5" /> Notes
                        </strong>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Etiam fermentum enim neque.
                        </p>
                      </div> {/* /.box-body */}
                      {/* /.box */}
                    </div>
                    
        )
    }
}
