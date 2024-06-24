import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api'
import {useCallback, useEffect, useState} from 'react'
import {IShipment} from '../types/shipment'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const center = {lat: 40.52, lng: 72.79}

function MapComponent({
  items,
  onPress,
}: {
  onPress: (item: IShipment) => void
  items: IShipment[]
}) {
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_wByvMEPAAivPvpY2jXFdD8GyEAlEqJU',
  })

  const [map, setMap] = useState<google.maps.Map | undefined>()

  const onLoad = useCallback(
    function callback(m: google.maps.Map) {
      setMap(m)
    },
    [map, setMap]
  )

  useEffect(() => {
    let timeoutId = -1

    if (map && isLoaded) {
      timeoutId = setTimeout(() => {
        const bounds = new window.google.maps.LatLngBounds(
          items.length > 0
            ? {lat: items[0].location_lat!, lng: items[0].location_lng!}
            : center
        )
        map.fitBounds(bounds)
        map.setZoom(10)
      }, 1000)
    }

    return () => {
      if (timeoutId > -1) {
        clearTimeout(timeoutId)
      }
    }
  }, [map, isLoaded])

  const onUnmount = useCallback(function callback() {
    setMap(undefined)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {items.map((g) => (
        <Marker
          onClick={() => onPress(g)}
          key={g.id}
          position={{lat: g.location_lat!, lng: g.location_lng!}}
          icon={{
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: g.is_online ? '#1B5E20' : '#B71C1C',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 0,
          }}
          label={{
            className: `marker-class ${
              g.is_online ? 'is-online' : 'is-offline'
            }`,
            text: g.last_history?.truck_number?.trim().split('/')[0] ?? g.title,
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
