import React, { Component } from 'react';

import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';

function Map(props) {
  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: -23.56405, lng: -46.688538 }}
      defaultOptions={{ mapTypeControl: false }}
    />
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default class Mapa extends Component {
  render() {
    return (
      // calc(100vh - 70.50% - 29.50%)
      <div style={{ width: '100wv', height: 'calc(100vh - 70.50% - 29.50%)' }}>
        <WrappedMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
            process.env.REACT_APP_GOOGLE_KEY
          }`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}
