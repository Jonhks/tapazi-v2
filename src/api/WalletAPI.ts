import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export interface WalletTransaction {
  wallet_in: number;
  wallet_out: number;
  date: string;
  time: string;
  origin: string;
  portfolio_name: string;
  tournament_name: string;
  sport_hex_color: string;
}

export interface WalletTotals {
  sum_in: number;
  sum_out: number;
  sum_in_minus_out: number;
}

/** GET /participants/:participantId/wallet-transactions
 *  La API devuelve el array directamente (no envuelto en objeto).
 */
export const getWalletTransactions = async (
  participantId: string,
): Promise<WalletTransaction[]> => {
  try {
    const { data } = await apiEnv(
      `/participants/${participantId}/wallet-transactions`,
    );
    // El servidor devuelve el array directo o { transactions: [...] }
    if (Array.isArray(data)) return data;
    return data.transactions ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

/** GET /participants/:participantId/wallet-totals
 *  Respuesta: { totals: [{ sum_in, sum_out, sum_in_minus_out }] }
 */
export const getWalletTotals = async (
  participantId: string,
): Promise<WalletTotals> => {
  const fallback: WalletTotals = { sum_in: 0, sum_out: 0, sum_in_minus_out: 0 };
  try {
    const { data } = await apiEnv(
      `/participants/${participantId}/wallet-totals`,
    );
    return data.totals?.[0] ?? fallback;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return fallback;
  }
};

/** GET /participants/:participantId/wallet-remaining
 *  Respuesta: { wallet_remaining: 50.0 }
 */
export const getWalletRemaining = async (
  participantId: string,
): Promise<number> => {
  try {
    const { data } = await apiEnv(
      `/participants/${participantId}/wallet-remaining`,
    );
    return data.wallet_remaining ?? 0;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return 0;
  }
};
