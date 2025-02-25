export const daysLeft = (targetDate: Date) => {
  const currentDate = new Date();
  // Convertir la cadena de fecha futura a un objeto Date
  const futureDate = new Date(targetDate);
  // Calcular la diferencia en milisegundos
  const diffInMilliseconds = futureDate.getTime() - currentDate.getTime();
  // Convertir la diferencia de milisegundos a días
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return diffInDays;
};

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

// Función para calcular el tiempo restante hasta una hora específica en el día actual
export function timeUntil(targetTimeStr: string): TimeRemaining {
  // Fecha y hora actuales
  const currentDate = new Date();

  // Crear una nueva fecha con la hora específica
  const [targetHours, targetMinutes, targetSeconds] = targetTimeStr
    .split(":")
    .map(Number);
  const targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    targetHours,
    targetMinutes,
    targetSeconds
  );

  // Calcular la diferencia en milisegundos
  const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();

  // Convertir la diferencia a horas, minutos y segundos
  const diffInSeconds = Math.max(0, Math.floor(diffInMilliseconds / 1000));
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return { hours, minutes, seconds };
}

// Función para verificar si la fecha y hora actuales han alcanzado o superado una fecha y hora específicas teniendo en cuenta la zona horaria
export function isDateTimeReached(
  targetDateStr: string,
  targetTimeStr: string
): boolean {
  // const timeZone = "UTC";
  // Fecha y hora actuales en la zona horaria especificada
  const currentDate = new Date(new Date());

  // Crear una nueva fecha con la fecha y hora específicas en la zona horaria especificada
  const [targetYear, targetMonth, targetDay] = targetDateStr
    .split("-")
    .map(Number);
  const [targetHours, targetMinutes, targetSeconds] = targetTimeStr
    .split(":")
    .map(Number);
  const targetDate = new Date(
    targetYear,
    targetMonth - 1,
    targetDay,
    targetHours,
    targetMinutes,
    targetSeconds
  );

  // Comparar las fechas
  return targetDate >= currentDate;
}
