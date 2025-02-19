import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'
import {formatDateDDMMYYYY, parseDate} from './parsers'
import {IInvoice} from '../types'

export const exportToExcel = (data: IInvoice[], fileName: string) => {
  const sheetData: any[] = [['', '', 'ДТ', 'КТ', 'ДТ', 'КТ']]

  data.forEach((item) => {
    sheetData.push([
      sheetData.length + 1,
      `№${item.number} от ${formatDateDDMMYYYY(parseDate(item.date!)!)}`,
      item.sum,
      '',
      '',
      item.sum,
    ])

    item.transactions.forEach((transaction) => {
      sheetData.push([
        sheetData.length,
        `${formatDateDDMMYYYY(parseDate(transaction.date)!)}: №${item.number}`,
        '',
        transaction.sum,
        transaction.sum,
        '',
      ])
    })
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Лист1')

  const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})
  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  saveAs(excelBlob, `${fileName}.xlsx`)
}
