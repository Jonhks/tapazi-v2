import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, CSSProperties } from "react";

interface Position {
  x: number;
  y: number;
}

interface DragOrigin {
  startX: number;
  startY: number;
  origin: Position;
}

/**
 * Arrastre simple basado en Pointer Events (sin dependencias externas).
 * Los `handleProps` van en el elemento que actúa de agarradera (ej. el
 * header de un modal); `position` es el offset a aplicar como
 * `translate(x, y)` sobre el contenido que se mueve.
 */
export function useDraggable() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef<DragOrigin | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      dragOrigin.current = { startX: e.clientX, startY: e.clientY, origin: position };
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [position],
  );

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (!dragOrigin.current) return;
    const { startX, startY, origin } = dragOrigin.current;
    setPosition({
      x: origin.x + (e.clientX - startX),
      y: origin.y + (e.clientY - startY),
    });
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    dragOrigin.current = null;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const reset = useCallback(() => setPosition({ x: 0, y: 0 }), []);

  const handleProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: {
      cursor: isDragging ? "grabbing" : "grab",
      touchAction: "none",
    } as CSSProperties,
  };

  return { position, isDragging, reset, handleProps };
}
