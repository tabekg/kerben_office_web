import {IPoint} from './point'
import {IDriver} from './user'

export enum EShipmentStatus {
  pending = 'PENDING',
  on_way = 'ON_WAY',
  completed = 'COMPLETED',
}

export enum EShipmentHistoryStatus {
  created = 'CREATED',
  on_way = 'ON_WAY',
  overload = 'OVERLOAD',
  changed_driver = 'CHANGED_DRIVER',
  completed = 'COMPLETED',
}

export interface IShipment {
  id: number
  title: string

  from_point_id?: number
  to_point_id?: number

  type?: string
  is_archived?: boolean

  location_lat?: number
  location_lng?: number
  location_updated_at?: Date

  date: Date
  status: EShipmentStatus
  uuid: string

  cmr_path?: string
  last_history_id?: number

  from_point?: IPoint
  to_point?: IPoint

  last_history?: IShipmentHistory
  histories?: IShipmentHistory[]

  is_online: boolean
}

export interface IShipmentHistory {
  id: number

  shipment_id?: number
  user_id?: number
  driver_id?: number

  truck_number?: string
  driver_phone_number?: string
  driver_full_name?: string

  uuid?: string
  status: EShipmentHistoryStatus

  shipment?: IShipment
  //   user
  driver?: IDriver
}

export interface IShipmentInfo {
  color: string
  isOnline: boolean
  label: string
  icon: string
}
