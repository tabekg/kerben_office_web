export type TMultiLanguageValue = {ru: string; en: string; cn: string}

export interface ITransaction {
  id: number
  date: string
  sum: number
  comment?: string
}

export interface IInvoice {
  id: number
  date?: string
  number: string
  sum: number
  comm: number
  total: number
  left: number
  transactions: ITransaction[]
}
