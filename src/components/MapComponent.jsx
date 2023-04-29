import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps'
import {compose, withProps} from 'recompose'

const MapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_wByvMEPAAivPvpY2jXFdD8GyEAlEqJU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{height: `100%`}} />,
    containerElement: <div style={{height: `100%`}} />,
    mapElement: <div style={{height: `100%`}} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <>
      <GoogleMap defaultZoom={13} defaultCenter={{lat: 40.5283, lng: 72.7985}}>
        <Marker position={{lat: 40.5283, lng: 72.7985}} />
      </GoogleMap>
    </>
  )
})

export default MapComponent
