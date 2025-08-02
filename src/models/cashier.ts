export interface ICategory {
  id: number
  title: string
  sumKgs?: number
  sumUsd?: number
  parent?: ICategory
}
