import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  isChunkLoadError,
  reloadOnceForChunkError,
} from "@/utils/chunkErrorReload";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Atrapa el caso en que React vuelve a lanzar, durante el render, el error
 * de un import() dinámico fallido (chunk de una ruta lazy que un deploy
 * nuevo ya borró) — dispara una recarga automática (una sola vez) en vez de
 * dejar la pantalla en blanco/trabada sin ningún mensaje.
 *
 * Para cualquier OTRO error no relacionado, no muestra nada (mismo
 * resultado visual — pantalla en blanco — que se vería hoy sin este
 * componente), solo que además queda logueado en consola.
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, isChunkError: isChunkLoadError(error?.message) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error?.message)) {
      reloadOnceForChunkError();
      return;
    }
    console.error(error, info);
  }

  render() {
    if (this.state.isChunkError) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#000",
            color: "#D4AF37",
            fontFamily: "sans-serif",
          }}
        >
          Updating…
        </div>
      );
    }
    // error no relacionado: sin fallback propio, mismo resultado visual que
    // sin este boundary (pantalla en blanco), pero ya quedó logueado arriba.
    if (this.state.hasError) return null;

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
