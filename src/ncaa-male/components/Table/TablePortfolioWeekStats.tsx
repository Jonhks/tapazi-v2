import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Box, Typography } from "@mui/material";
import { TableBase, BallSvg } from "./Table";

type TeamStat = {
  id: number;
  name: string;
  crest_url: string;
};

type PortfolioStat = {
  portfolio: string;
  teams: string;
  week_score: number;
};

type TeamWithCrest = {
  name: string;
  crest: string | null;
};

type PortfolioWithCrests = {
  portfolio: string;
  week_score: number;
  teams: TeamWithCrest[];
};

const TeamDisplay = ({ name }: { name: string }) => (
  <Box display="flex" alignItems="center" justifyContent="start" gap={1}>
    <BallSvg />
    <Typography variant="body2" sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
      {name}
    </Typography>
  </Box>
);

export default function TablePortfolioWeekStats({
  statsData,
  teamsData,
  weekLabel,
}: {
  statsData: PortfolioStat[];
  teamsData: TeamStat[];
  weekLabel: string;
}) {
  const teamsMap = useMemo<Record<string, string>>(() => {
    return (
      teamsData?.reduce<Record<string, string>>((acc, team) => {
        acc[team.name] = team.crest_url;
        return acc;
      }, {}) ?? {}
    );
  }, [teamsData]);

  const statsWithCrests = useMemo<PortfolioWithCrests[]>(() => {
    if (!statsData || !teamsMap) return [];
    return statsData.map((item) => {
      const teams: string[] = JSON.parse(item.teams);
      return {
        portfolio: item.portfolio,
        week_score: item.week_score,
        teams: teams.map((teamName) => ({
          name: teamName,
          crest: teamsMap[teamName] ?? null,
        })),
      };
    });
  }, [statsData, teamsMap]);

  const maxTeams = useMemo(
    () => Math.max(...statsWithCrests.map((r) => r.teams.length), 0),
    [statsWithCrests],
  );

  const columns = useMemo<ColumnDef<PortfolioWithCrests>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolio",
        cell: (info) => <span>{info.getValue() as string}</span>,
      },
      ...Array.from({ length: maxTeams }, (_, i): ColumnDef<PortfolioWithCrests> => ({
        header: `Team ${i + 1}`,
        accessorFn: (row) => row.teams?.[i]?.name ?? "",
        id: `team_${i}`,
        cell: (info) => {
          const teamName = info.getValue() as string;
          return teamName ? <TeamDisplay name={teamName} /> : null;
        },
      })),
      {
        header: "W\nSCORE",
        accessorKey: "week_score",
      },
    ],
    [maxTeams],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          color: "white",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "center",
          mb: 2,
        }}
      >
        Portfolios - {weekLabel}
      </Typography>
      <TableBase
        data={statsWithCrests}
        columns={columns}
        defaultSorting={[{ id: "week_score", desc: true }]}
        stickyLastColumn
      />
    </Box>
  );
}
