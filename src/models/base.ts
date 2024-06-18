export default class BaseModel {
  id?: number
  created_at?: Date
  updated_at?: Date

  constructor(props: {id: number; created_at?: Date; updated_at?: Date}) {
    this.id = props.id
    this.created_at = props.created_at
    this.updated_at = props.updated_at
  }
}
