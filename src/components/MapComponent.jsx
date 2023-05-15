import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api'
import {useCallback, useState} from 'react'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const center = {lat: 40.5283, lng: 72.7985}

function MapComponent({markers}) {
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_wByvMEPAAivPvpY2jXFdD8GyEAlEqJU',
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      markers.length > 0
        ? {lat: markers[0].location_lat, lng: markers[0].location_lng}
        : center
    )
    map.fitBounds(bounds)
    map.setZoom(5)

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        markers.length > 0
          ? {lat: markers[0].location_lat, lng: markers[0].location_lng}
          : center
      }
      onLoad={onLoad}
      onUnmount={onUnmount}
      onZoomChanged={console.log}
    >
      {markers.map((g) => (
        <Marker
          key={g.id}
          position={{lat: g.location_lat, lng: g.location_lng}}
          icon={{
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: g.isOnline ? '#1B5E20' : '#B71C1C',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 0,
          }}
          label={{
            className: `marker-class ${
              g.isOnline ? 'is-online' : 'is-offline'
            }`,
            text: g.title,
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  )

  // return (
  //   <>
  //     <GoogleMap defaultZoom={6} defaultCenter={{lat: 40.5283, lng: 72.7985}}>
  //       {props.markers.map((g, i) => {
  //         return (
  //           <MarkerWithLabel
  //             key={i}
  //             position={{
  //               lat: g.lat,
  //               lng: g.lng,
  //             }}
  //             // labelAnchor={new google.maps.Point(0, 0)}
  //             labelStyle={{
  //               backgroundColor: 'yellow',
  //               fontSize: '32px',
  //               padding: '16px',
  //             }}
  //           />
  //         )
  //       })}
  //     </GoogleMap>
  //   </>
  // )
}

export default MapComponent
