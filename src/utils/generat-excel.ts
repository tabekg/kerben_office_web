import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], fileName: string) => {

  const sheetData = [
    ["Квитанции", "", "", "", "", "Снятия", "", ""],
    ["Дата", "Номер", "Сумма", "Остаток", "", "Дата", "Сумма", "Комментарий"],
  ];

  data.forEach((item) => {
    const { Дата, Номер, Сумма, Остаток, transactions } = item;
    
    if (transactions.length > 0) {
      transactions.forEach((t:any, index:number) => {
        sheetData.push([
          index === 0 ? Дата : "", 
          index === 0 ? Номер : "", 
          index === 0 ? Сумма : "", 
          index === 0 ? Остаток : "", 
          "",
          t.Дата, 
          t.Сумма,
          t.Комментарий,
        ]);
      });
    } else {
      sheetData.push([Дата, Номер, Сумма, Остаток, "", "", "", ""]);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Лист1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(excelBlob, `${fileName}.xlsx`);
};





