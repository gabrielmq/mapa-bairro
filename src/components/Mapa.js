import React, { Component } from 'react';

import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

import './Mapa.css';

function Map(props) {
  const { marcadores, marcadorSelecionado } = props;

  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: -23.56405, lng: -46.688538 }}
      defaultOptions={{ mapTypeControl: false }}
      onClick={props.fecharInfoWindow}
    >
      {marcadores &&
        marcadores.map((marcador, i) => (
          <Marker
            key={i}
            position={{
              lat: marcador['location']['lat'],
              lng: marcador['location']['lng']
            }}
            animation={
              marcadorSelecionado === marcador
                ? window.google.maps.Animation.BOUNCE
                : 0
            }
            onClick={() => props.selecionarMarcador(marcador)}
          >
            {marcadorSelecionado === marcador && (
              <InfoWindow onCloseClick={props.fecharInfoWindow}>
                <div className="info-window">
                  <img
                    id="img-infowindow"
                    src={
                      marcador.bestPhoto.prefix +
                      '300x200' +
                      marcador.bestPhoto.suffix
                    }
                    alt={marcador.name}
                  />
                  <div id="info-container">
                    <h2>{marcador.name}</h2>
                    <p>{marcador.categories[0].name}</p>
                    <p>{marcador.location.formattedAddress[0]}</p>
                    <p>Avaliação: {marcador.rating}</p>
                    <p>{marcador.likes.summary}</p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
    </GoogleMap>
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
          marcadores={this.props.marcadores}
          marcadorSelecionado={this.props.marcadorSelecionado}
          selecionarMarcador={this.props.selecionarMarcador}
          fecharInfoWindow={this.props.fecharInfoWindow}
        />
      </div>
    );
  }
}
