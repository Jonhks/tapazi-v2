import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Router from "./router.tsx";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import PWABadge from "./PWABadge.tsx";
import { UpdateCheckProvider } from "./context/UpdateCheck.tsx";
import { ChunkErrorBoundary } from "./shared/components/ErrorBoundary/ChunkErrorBoundary.tsx";
import {
  setupChunkErrorReload,
  clearChunkReloadFlag,
} from "./utils/chunkErrorReload.ts";

setupChunkErrorReload();
// si seguimos vivos varios segundos después de montar, la app está estable
// (haya habido un reload por chunk viejo o no) — se libera el "un solo
// intento" para que un futuro incidente en esta misma pestaña también se
// pueda recuperar solo.
setTimeout(clearChunkReloadFlag, 5000);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UpdateCheckProvider>
      <PWABadge />
      <ChunkErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router />
          {/* <ReactQueryDevtools /> */}
          <ToastContainer
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
          />
        </QueryClientProvider>
      </ChunkErrorBoundary>
    </UpdateCheckProvider>
  </StrictMode>,
);
