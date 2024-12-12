import {IPoint} from './point'

export interface IContainer {
  id: number
  title: string
  point?: null | IPoint
  from_point?: null | IPoint
  to_point?: null | IPoint
}
