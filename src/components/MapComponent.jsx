import {compose, withProps} from 'recompose'

import {
  GoogleMap,
  InfoBox,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api'
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
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {markers.map((g) => (
        <Marker position={{lat: g.lat, lng: g.lng}} label={g.label} />
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
