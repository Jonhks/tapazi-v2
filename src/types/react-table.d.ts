import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- la firma debe calzar con la interfaz original para el "declaration merging"
  interface ColumnMeta<TData, TValue> {
    /** Alineación de header/celda en las tablas hand-rolled (default: "center"). */
    align?: "left" | "center";
    /** Oculta la columna visualmente (usado como spacer en WorldCup). */
    hidden?: boolean;
  }
}
