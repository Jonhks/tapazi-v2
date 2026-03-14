import { isAxiosError } from "axios";
import { apiEnv } from "./axios";

/**
 * Wrapper genérico para llamadas GET a la API.
 * - Centraliza el Content-Type header
 * - Burbujea errores hacia React Query (throw) para que isError funcione
 * - Retorna directamente el `data` de la respuesta
 */
export async function apiGet<T = unknown>(url: string): Promise<T> {
  try {
    const { data } = await apiEnv.get<T>(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error ?? "API error");
    }
    throw new Error("Network error");
  }
}

/**
 * Wrapper genérico para llamadas POST a la API.
 */
export async function apiPost<T = unknown, B = unknown>(
  url: string,
  body: B,
): Promise<T> {
  try {
    const { data } = await apiEnv.post<T>(url, body, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error ?? "API error");
    }
    throw new Error("Network error");
  }
}

/**
 * Wrapper genérico para llamadas PUT a la API.
 */
export async function apiPut<T = unknown, B = unknown>(
  url: string,
  body: B,
): Promise<T> {
  try {
    const { data } = await apiEnv.put<T>(url, body, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error ?? "API error");
    }
    throw new Error("Network error");
  }
}

/**
 * Wrapper genérico para llamadas DELETE a la API.
 */
export async function apiDelete<T = unknown>(url: string): Promise<T> {
  try {
    const { data } = await apiEnv.delete<T>(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error ?? "API error");
    }
    throw new Error("Network error");
  }
}
