import React, { Component } from 'react'

export default class TabTimeline extends Component {
    render() {
        return (
            
        <ul className="timeline timeline-inverse"> {/* The timeline */}
            {/* timeline time label */}
            <li className="time-label">
              <span className="bg-red">10 Feb. 2014</span>
            </li>
            {/* /.timeline-label */}
            {/* timeline item */}
            <li>
              <i className="fa fa-envelope bg-blue" />
              <div className="timeline-item">
                <span className="time">
                  <i className="fa fa-clock-o" /> 12:05
                </span>
                <h3 className="timeline-header">
                  <a href="#">Support Team</a> sent you an email
                </h3>
                <div className="timeline-body">
                  Etsy doostang zoodles disqus groupon greplin oooj
                  voxy zoodles, weebly ning heekya handango imeem
                  plugg dopplr jibjab, movity jajah plickers sifteo
                  edmodo ifttt zimbra. Babblely odeo kaboodle quora
                  plaxo ideeli hulu weebly balihoo...
                </div>
                <div className="timeline-footer">
                  <a className="btn btn-primary btn-xs">
                    Read more
                  </a>
                  <a className="btn btn-danger btn-xs">Delete</a>
                </div>
              </div>
            </li>
            {/* END timeline item */}
            {/* timeline item */}
            <li>
              <i className="fa fa-user bg-aqua" />
              <div className="timeline-item">
                <span className="time">
                  <i className="fa fa-clock-o" /> 5 mins ago
                </span>
                <h3 className="timeline-header no-border">
                  <a href="#">Sarah Young</a> accepted your friend
                  request
                </h3>
              </div>
            </li>
            {/* END timeline item */}
            {/* timeline item */}
            <li>
              <i className="fa fa-comments bg-yellow" />
              <div className="timeline-item">
                <span className="time">
                  <i className="fa fa-clock-o" /> 27 mins ago
                </span>
                <h3 className="timeline-header">
                  <a href="#">Jay White</a> commented on your post
                </h3>
                <div className="timeline-body">
                  Take me to your leader! Switzerland is small and
                  neutral! We are more like Germany, ambitious and
                  misunderstood!
                </div>
                <div className="timeline-footer">
                  <a className="btn btn-warning btn-flat btn-xs">
                    View comment
                  </a>
                </div>
              </div>
            </li>
            {/* END timeline item */}
            {/* timeline time label */}
            <li className="time-label">
              <span className="bg-green">3 Jan. 2014</span>
            </li>
            {/* /.timeline-label */}
            {/* timeline item */}
            <li>
              <i className="fa fa-camera bg-purple" />
              <div className="timeline-item">
                <span className="time">
                  <i className="fa fa-clock-o" /> 2 days ago
                </span>
                <h3 className="timeline-header">
                  <a href="#">Mina Lee</a> uploaded new photos
                </h3>
                <div className="timeline-body">
                  <img
                    src="http://placehold.it/150x100"
                    alt="..."
                    className="margin"
                  />
                  <img
                    src="http://placehold.it/150x100"
                    alt="..."
                    className="margin"
                  />
                  <img
                    src="http://placehold.it/150x100"
                    alt="..."
                    className="margin"
                  />
                  <img
                    src="http://placehold.it/150x100"
                    alt="..."
                    className="margin"
                  />
                </div>
              </div>
            </li>
            {/* END timeline item */}
            <li>
              <i className="fa fa-clock-o bg-gray" />
            </li>
          </ul>
        )
    }
}
