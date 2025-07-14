// composables/useExportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExportExcelOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
}

export function useExportToExcel() {
  const { toastError, toastSuccess } = useAppToast();
  const exportToExcel = ({
    data,
    fileName,
    sheetName = "Sheet1",
  }: ExportExcelOptions) => {
    if (!data || data.length === 0) {
      toastError({ title: "لا يوجد بيانات لتصديرها" });
      console.warn("لا يوجد بيانات لتصديرها");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${fileName}.xlsx`);
  };

  return {
    exportToExcel,
  };
}
