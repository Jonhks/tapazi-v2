import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "@/shared/components/Table/TableBase";
import EmptyState from "@/shared/components/EmptyState/EmptyState";
import {
  getWalletTransactions,
  getWalletTotals,
  getWalletRemaining,
  type WalletTransaction,
  type WalletTotals,
} from "@/api/WalletAPI";
import { sportThemes, SportKey } from "@/shared/theme/colors";

export interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  participantId: string;
  participantName: string;
  sportKey?: SportKey;
}

const fallbackTournamentColor = (name: string): string => {
  if (!name?.trim()) return "#ffffff";
  const t = name.toLowerCase();
  if (t.includes("women") || t.includes("female")) return "#b060f0";
  if (t.includes("epl")) return "#9c6ff5";
  if (t.includes("world cup") || t.includes("worldcup")) return "#00bcd4";
  if (t.includes("men") || t.includes("male") || t.includes("ncaa"))
    return "#dc903b";
  return "#ffffff";
};

export default function WalletModal({
  open,
  onClose,
  participantId,
  participantName,
  sportKey = "ncaaMale",
}: WalletModalProps) {
  const theme = sportThemes[sportKey];

  // staleTime: 0 → siempre refetch al abrir el modal para mostrar saldo actualizado
  const queryOpts = {
    enabled: open && !!participantId,
    retry: 1,
    staleTime: 0,
  };

  const { data: transactions = [], isLoading: loadingTx } = useQuery<
    WalletTransaction[]
  >({
    queryKey: ["wallet-transactions", participantId],
    queryFn: () => getWalletTransactions(participantId),
    ...queryOpts,
  });

  const { data: totals, isLoading: loadingTotals } = useQuery<WalletTotals>({
    queryKey: ["wallet-totals", participantId],
    queryFn: () => getWalletTotals(participantId),
    ...queryOpts,
  });

  const { data: remaining = 0, isLoading: loadingRemaining } = useQuery<number>(
    {
      queryKey: ["wallet-remaining", participantId],
      queryFn: () => getWalletRemaining(participantId),
      ...queryOpts,
    },
  );

  const isLoading = loadingTx || loadingTotals || loadingRemaining;

  const cancelStyle = (canceled: boolean): React.CSSProperties =>
    canceled
      ? { color: "#b4b0b0", textDecoration: "line-through", opacity: 0.6 }
      : {};

  const columns = useMemo<ColumnDef<WalletTransaction>[]>(
    () => [
      {
        header: "IN",
        accessorKey: "wallet_in",
        cell: ({ getValue, row }) => {
          const val = getValue<number>();
          const canceled = row.original.canceled;
          if (!val) return null;
          return (
            <span
              style={{
                color: canceled ? "#888" : theme.positive,
                fontWeight: 700,
                ...cancelStyle(canceled),
              }}
            >
              $ {val.toLocaleString()}
            </span>
          );
        },
      },
      {
        header: "OUT",
        accessorKey: "wallet_out",
        cell: ({ getValue, row }) => {
          const val = getValue<number>();
          const canceled = row.original.canceled;
          if (!val) return null;
          return (
            <span
              style={{
                color: canceled ? "#888" : theme.negative,
                fontWeight: 700,
                ...cancelStyle(canceled),
              }}
            >
              $ {val.toLocaleString()}
            </span>
          );
        },
      },
      {
        header: "DATE",
        accessorKey: "date",
        cell: ({ getValue, row }) => (
          <span style={cancelStyle(row.original.canceled)}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        header: "TIME",
        accessorKey: "time",
        cell: ({ getValue, row }) => (
          <span style={cancelStyle(row.original.canceled)}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        header: "PORTFOLIO",
        accessorKey: "portfolio_name",
        cell: ({ getValue, row }) => (
          <span style={cancelStyle(row.original.canceled)}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        header: "TOURNAMENT",
        accessorKey: "tournament_name",
        cell: ({ row }) => {
          const name = row.original.tournament_name;
          const canceled = row.original.canceled;
          const color = canceled
            ? "#888"
            : row.original.sport_hex_color?.trim()
              ? row.original.sport_hex_color
              : fallbackTournamentColor(name);
          return (
            <span style={{ color, fontWeight: 700, ...cancelStyle(canceled) }}>
              {name ?? ""}
            </span>
          );
        },
      },
    ],
    [theme],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0a0a0a",
          border: `2px solid ${theme.accent}`,
          borderRadius: "8px",
          color: "#fff",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <MonetizationOnIcon sx={{ color: theme.accent, fontSize: 32 }} />
            MY WALLET
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.accent,
              fontWeight: 700,
              mt: 1,
              letterSpacing: 2,
            }}
          >
            {participantName.toUpperCase()}
          </Typography>

          {/* Totals row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "#aaa", letterSpacing: 1 }}
              >
                TOTAL IN
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.positive, fontWeight: 800 }}
              >
                $ {(totals?.sum_in ?? 0).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "#aaa", letterSpacing: 1 }}
              >
                TOTAL OUT
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.negative, fontWeight: 800 }}
              >
                $ {(totals?.sum_out ?? 0).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "#aaa", letterSpacing: 1 }}
              >
                BALANCE
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.accent, fontWeight: 800 }}
              >
                $ {remaining.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress sx={{ color: theme.accent }} />
          </Box>
        )}

        {/* Empty state — fuera del contenedor de tabla */}
        {!isLoading && transactions.length === 0 && (
          <EmptyState
            icon={MonetizationOnIcon}
            title="No transactions"
            subtitle="When you have transactions in your wallet, they will appear here."
            accentColor={theme.accent}
          />
        )}

        {/* Tabla — solo se monta cuando hay datos */}
        {!isLoading && transactions.length > 0 && (
          <Box
            sx={{
              border: `1px solid ${theme.accent}33`,
              borderRadius: "4px",
              maxHeight: "420px",
            }}
          >
            <TableBase
              data={transactions}
              columns={columns}
              maxHeight="380px"
              theme={theme}
              invertColorColumns={true}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
