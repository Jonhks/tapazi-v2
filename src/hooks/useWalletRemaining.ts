import { useQuery } from "@tanstack/react-query";
import { getWalletRemaining } from "@/api/WalletAPI";

/**
 * Devuelve el saldo disponible del wallet del participante.
 * La query solo se activa si `participantId` es un valor truthy.
 *
 * Uso:
 * ```ts
 * const { remaining, isLoading } = useWalletRemaining(user.id);
 * ```
 */
export function useWalletRemaining(participantId: string | number | undefined) {
  const id = participantId ? String(participantId) : "";

  const { data: remaining = 0, isLoading } = useQuery<number>({
    queryKey: ["wallet-remaining", id],
    queryFn: () => getWalletRemaining(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 min — el saldo no cambia tan seguido
  });

  return { remaining, isLoading };
}
