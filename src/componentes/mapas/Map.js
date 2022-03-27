import React from 'react';
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
} from 'react-google-maps';

const Map = (props) => {
    return (
        <GoogleMap
            defaultZoom={9} 
            defaultCenter={{ lat: -43.3, lng: -65.3 }}
            
        >
            
        </GoogleMap> 
    );
};

export default withScriptjs(
    withGoogleMap(
        Map
    )
)