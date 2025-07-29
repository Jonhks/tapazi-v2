import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Router from "./router.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import PWABadge from "./PWABadge.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PWABadge />
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
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
  </StrictMode>
);
// comentarios innecesarios
