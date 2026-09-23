import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  isChunkLoadError,
  reloadOnceForChunkError,
  hasAttemptedChunkReload,
} from "@/utils/chunkErrorReload";
import { Sentry } from "@/lib/sentry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Atrapa cualquier error no manejado durante el render.
 *
 * Caso 1 — error de chunk (import() dinámico fallido, típico de una pestaña
 * vieja después de un deploy): dispara una recarga automática (una sola vez
 * por sesión) y muestra una pantalla transitoria de "Updating…" mientras
 * eso pasa.
 *
 * Caso 2 — cualquier otro error, o un error de chunk que YA gastó su único
 * auto-reload y sigue fallando: se muestra una pantalla de error real, con
 * el mensaje del error y un botón para recargar a mano. Antes esto dejaba
 * la pantalla completamente en blanco/negro sin ningún mensaje ni forma de
 * salir — este es justo el caso que se reportó como "todo negro".
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error?.message) && reloadOnceForChunkError()) {
      // auto-reload recién disparado — la página está a punto de navegar,
      // no hace falta loguear esto como un error real.
      return;
    }
    console.error(error, info);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isChunkError = isChunkLoadError(this.state.error?.message);

    // Recién detectado y todavía no se gastó el auto-reload de esta sesión
    // → pantalla transitoria, la recarga ya está en camino.
    if (isChunkError && !hasAttemptedChunkReload()) {
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

    // Cualquier otro caso: error real (o un error de chunk que ya se
    // intentó recargar solo y sigue fallando) — pantalla con el mensaje y
    // un botón para recargar a mano, nunca una pantalla vacía sin salida.
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          minHeight: "100vh",
          padding: 24,
          background: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</div>
        <div
          style={{
            fontSize: 14,
            color: "#ccc",
            maxWidth: 480,
            wordBreak: "break-word",
          }}
        >
          {this.state.error?.name}: {this.state.error?.message || "Unknown error"}
        </div>
        {this.state.error?.stack && (
          <details style={{ maxWidth: 560, width: "100%" }}>
            <summary style={{ cursor: "pointer", color: "#888", fontSize: 12 }}>
              Technical details
            </summary>
            <pre
              style={{
                fontSize: 11,
                color: "#888",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 200,
                overflowY: "scroll",
                marginTop: 8,
              }}
            >
              {this.state.error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={this.handleReload}
          style={{
            marginTop: 8,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 700,
            color: "#000",
            background: "#D4AF37",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
