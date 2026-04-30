import { useMemo } from "react";
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
import { getWallet } from "@/api/WalletAPI";
import { sportThemes, SportKey } from "@/shared/theme/colors";

interface WalletTransaction {
  id: number | string;
  in: number | null;
  out: number | null;
  fecha: string;
  portfolio: string;
  tournament: string | null;
  tournament_color?: string;
}

interface WalletData {
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  participantId: string;
  participantName: string;
  sportKey?: SportKey;
}

const FAKE_WALLET: WalletData = {
  balance: 1023,
  transactions: [
    {
      id: 1,
      in: 1631,
      out: null,
      fecha: "01/01/2026",
      portfolio: "GUERRERO KA 489",
      tournament: null,
    },
    {
      id: 2,
      in: null,
      out: 1631,
      fecha: "03/02/2026",
      portfolio: "GUERRERO KA 489",
      tournament: "WOMEN'S BB TOURNAMENT 25",
    },
    {
      id: 5,
      in: null,
      out: null,
      fecha: "10/02/2026",
      portfolio: "GUERRERO KA 489",
      tournament: null,
    },
    {
      id: 1,
      in: 6731,
      out: null,
      fecha: "14/03/2026",
      portfolio: "GUERRERO KA 489",
      tournament: null,
    },
    {
      id: 6,
      in: null,
      out: 1631,
      fecha: "15/03/2026",
      portfolio: "GUERRERO KA 489",
      tournament: "EPL TOURNAMENT 25",
    },
    {
      id: 12,
      in: 10321,
      out: null,
      fecha: "20/03/2026",
      portfolio: "GUERRERO KA 489",
      tournament: null,
    },
    {
      id: 13,
      in: null,
      out: 631,
      fecha: "24/03/2026",
      portfolio: "GUERRERO KA 489",
      tournament: "MEN's BB TOURNAMENT 25",
    },
    {
      id: 14,
      in: null,
      out: 100,
      fecha: "24/03/2026",
      portfolio: "GUERRERO KA 489",
      tournament: "WORLD CUP TOURNAMENT 25",
    },
    {
      id: "T",
      in: 18683,
      out: 3993,
      fecha: "",
      portfolio: "",
      tournament: null,
    },
  ],
};

const getTournamentColor = (tournament: string | null): string => {
  if (!tournament) return "#ffffff";
  const t = tournament.toLowerCase();
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

  const { data, isLoading } = useQuery<WalletData>({
    queryKey: ["wallet", participantId],
    queryFn: () => getWallet(participantId),
    enabled: open && !!participantId,
    retry: 1,
  });

  const transactions: WalletTransaction[] = data?.transactions?.length
    ? data.transactions
    : FAKE_WALLET.transactions;
  const balance = data?.balance ?? FAKE_WALLET.balance;

  const columns = useMemo<ColumnDef<WalletTransaction>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "IN",
        accessorKey: "in",
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          if (val == null || val === 0) return null;
          return (
            <span style={{ color: theme.positive, fontWeight: 700 }}>
              $ {val.toLocaleString()}
            </span>
          );
        },
      },
      {
        header: "OUT",
        accessorKey: "out",
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          if (val == null || val === 0) return null;
          return (
            <span style={{ color: theme.negative, fontWeight: 700 }}>
              $ {val.toLocaleString()}
            </span>
          );
        },
      },
      {
        header: "FECHA",
        accessorKey: "fecha",
      },
      {
        header: "PORTFOLIO",
        accessorKey: "portfolio",
      },
      {
        header: "TOURNAMENT",
        accessorKey: "tournament",
        cell: ({ row }) => {
          const tournament = row.original.tournament;
          const color =
            row.original.tournament_color ?? getTournamentColor(tournament);
          return (
            <span style={{ color, fontWeight: 700 }}>{tournament ?? ""}</span>
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

          <Typography
            variant="subtitle2"
            sx={{ color: "#fff", fontWeight: 600, mt: 1, letterSpacing: 1 }}
          >
            TOTAL
          </Typography>

          <Typography
            variant="h4"
            sx={{ color: theme.accent, fontWeight: 800 }}
          >
            $ {balance.toLocaleString()}
          </Typography>
        </Box>

        {/* Table */}
        <Box
          sx={{
            border: `1px solid ${theme.accent}33`,
            borderRadius: "4px",
            // overflowX: "scroll",
            // overflowY: "scroll",
            maxHeight: "420px",
          }}
        >
          {isLoading ? (
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
          ) : (
            <TableBase
              data={transactions}
              columns={columns}
              maxHeight="380px"
              theme={theme}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
