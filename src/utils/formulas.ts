export const extractWeekNumber = (str: string): string | null => {
  const parts = str.split("_"); // Divide la cadena en partes
  const weekPart = parts.find((part) => part.startsWith("week")); // Busca la parte que contiene "week"
  return weekPart ? weekPart.replace("week", "") : null; // Elimina "week" y devuelve el número
};
