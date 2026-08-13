import { useRef } from "react";

/**
 * Mantiene un ref siempre apuntando al valor más reciente.
 * Permite que los timelines llamen callbacks frescos (ej. `onComplete`)
 * sin tener que reconstruirse cuando el padre re-renderiza con un closure nuevo.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
