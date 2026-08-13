import type { Table } from "@tanstack/react-table";

const escapeCsvValue = (value: unknown): string => {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export function downloadTableAsCsv<T>(filename: string, table: Table<T>) {
  const columns = table.getVisibleFlatColumns();
  const headers = columns.map((col) => {
    const header = col.columnDef.header;
    return typeof header === "string" ? header : col.id;
  });
  const rows = table
    .getRowModel()
    .rows.map((row) => columns.map((col) => row.getValue(col.id)));

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const BOM = "﻿";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.toLowerCase().endsWith(".csv")
    ? filename
    : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
