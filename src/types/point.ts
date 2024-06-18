import {TMultiLanguageValue} from '.'

export interface IPoint {
  id: number
  title: TMultiLanguageValue
  location_lat?: number
  location_lng?: number
  type?: number
}
