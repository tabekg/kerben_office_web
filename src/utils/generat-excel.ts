import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'

export const exportToExcel = (
  data: {invoices: any[]; transactions: any[]},
  fileName: string
) => {
  const sheetData = [
    [],
    ['', 'Квитанции', '', '', '', '', 'Снятия', '', ''],
    [
      '',
      'Дата',
      'Номер',
      'Сумма',
      'Остаток',
      '',
      'Дата',
      'Сумма',
      'Комментарий',
    ],
  ]

  const maxLength = Math.max(data.invoices.length, data.transactions.length)

  for (let i = 0; i < maxLength; i++) {
    const invoice = data.invoices[i]
    const transaction = data.transactions[i]

    sheetData.push([
      '',
      invoice?.Дата || null,
      invoice?.Номер || null,
      invoice?.Сумма || null,
      invoice?.Остаток || null,
      '',
      transaction?.date || null,
      transaction?.sum || null,
      transaction?.comment || null,
    ])
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Лист1')

  const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})
  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  saveAs(excelBlob, `${fileName}.xlsx`)
}
