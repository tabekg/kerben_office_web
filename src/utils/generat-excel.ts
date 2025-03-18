import ExcelJS from 'exceljs'
import {saveAs} from 'file-saver'
import {formatDateDDMMYYYY, parseDate} from './parsers'
import {IInvoice} from '../types'

const LLC = {
  '0.4': 'ОсОО "Аль Нур"',
  Каратай: 'ОсОО "Кербен Авто Транс"',
  Достук: 'ОсОО "Аль Нур"',
  Терминал: 'ОсОО "Кербен Авто Транс"',
}

export const exportToExcel = async (
  data: IInvoice[],
  fileName: string,
  date: {
    start: Date | null
    end: Date | null
  },
  title: string
) => {
  const workbook = new ExcelJS.Workbook()

  const worksheet = workbook.addWorksheet('Лист1')

  worksheet.columns = [
    {width: 7},
    {width: 33},
    {width: 15},
    {width: 15},
    {width: 15},
    {width: 15},
  ]

  const date_ = `с ${formatDateDDMMYYYY(date.start!)}г по ${formatDateDDMMYYYY(
    date.end!
  )}г`

  worksheet.mergeCells('A1:F5')
  worksheet.mergeCells('C6:D6')
  worksheet.mergeCells('E6:F6')
  worksheet.getCell('A1').value =
    '𝗔𝗞𝗧\nсверки взаиморасчетов между ' +
    // @ts-ignore
    LLC[title] +
    ' и Государственное предприятие\n"Таможенная инфраструктура" при Государственной таможенной службе\nпри Министерстве финансов Кыргызской Республике валюта сверки KGS (ЭНП)\n' +
    date_
  worksheet.getCell('A1').alignment = {horizontal: 'center', vertical: 'middle'}
  worksheet.getCell('A2').font = {size: 10}

  worksheet.getCell('A6').value = '№'
  worksheet.getCell('B6').value = 'Записи №квитанции'
  worksheet.getCell('B6').font = {bold: true}
  // @ts-ignore
  worksheet.getCell('C6').value = LLC[title]
  worksheet.getCell('E6').value = 'ГПТИ'

  worksheet.addRow(['', '', 'ДТ', 'КТ', 'ДТ', 'КТ'])

  let numb = 0

  data.forEach((item) => {
    numb++

    worksheet.addRow([
      numb,
      `№${item.number} от ${formatDateDDMMYYYY(parseDate(item.date!)!)}`,
      item.sum,
      '',
      '',
      item.sum,
    ])

    item.transactions.forEach((transaction) => {
      numb++

      worksheet.addRow([
        numb,
        `${formatDateDDMMYYYY(parseDate(transaction.date)!)}: №${item.number}`,
        '',
        transaction.sum,
        transaction.sum,
        '',
      ])
    })
  })

  const itogoOboroty = data.reduce((a, b) => b.sum + a, 0)
  const itogoOboroty2 = data
    .flatMap((g) => g.transactions.map((o) => o.sum))
    .reduce((a, b) => b + a, 0)

  worksheet.addRow([])

  worksheet
    .addRow([
      '',
      'Итого обороты:',
      itogoOboroty,
      itogoOboroty2,
      itogoOboroty2,
      itogoOboroty,
    ])
    .getCell(2).font = {bold: true}

  worksheet
    .addRow([
      '',
      'Сальдо конечное:',
      itogoOboroty - itogoOboroty2,
      '',
      '',
      itogoOboroty - itogoOboroty2,
    ])
    .getCell(2).font = {bold: true}

  let row = worksheet.addRow([
    `Задолженность Государственное предприятие\n"Таможенная инфраструктура" при Государственной таможенной службе\nпри Министерстве финансов Кыргызской Республике перед ${
      // @ts-ignore
      LLC[title]
    } на ${formatDateDDMMYYYY(new Date())}\nсоставляет ${
      itogoOboroty - itogoOboroty2
    } сом.`,
  ])
  worksheet.mergeCells(`A${row.number}:F${row.number}`)
  row.height = 65
  worksheet.getCell(`A${row.number}`).alignment = {
    wrapText: true,
    vertical: 'middle',
  }

  worksheet.addRow([])

  row = worksheet.addRow([
    '',
    // @ts-ignore
    LLC[title] + '\nГлавный бухгалтер: ________',
    '',
    'ГПТИ\nГлавный бухгалтер: ________',
    '',
    '',
  ])
  worksheet.mergeCells(`B${row.number}:C${row.number}`)
  worksheet.mergeCells(`D${row.number}:E${row.number}`)
  row.height = 45
  worksheet.getCell(`A${row.number}`).alignment = {
    wrapText: true,
    vertical: 'top',
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const excelBlob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })
  saveAs(excelBlob, `${fileName}.xlsx`)
}
