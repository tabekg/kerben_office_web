import {EShipmentStatus, IShipment, IShipmentInfo} from '../types/shipment'
import BaseModel from './base'

class ShipmentModel extends BaseModel {}

export const getShipmentInfo = (item: IShipment) => {
  const resp: IShipmentInfo = {color: 'black', isOnline: false}

  if (item.status == EShipmentStatus.pending) {
    resp['color'] = 'yellow'
  }

  return resp
}
