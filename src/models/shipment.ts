import {EShipmentStatus, IShipment, IShipmentInfo} from '../types/shipment'

export const getShipmentInfo = (item: IShipment & IShipmentInfo) => {
  const resp: IShipmentInfo = {color: 'black', isOnline: false}

  if (item.status == EShipmentStatus.pending) {
    resp['color'] = 'yellow'
  } else if (item.status == EShipmentStatus.completed) {
    resp['color'] = 'green'
  } else if (item.status == EShipmentStatus.on_way) {
    resp['color'] = 'blue'
  }

  return resp
}
