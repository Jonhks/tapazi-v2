import { Box, Typography, SxProps, Theme } from "@mui/material";
import { ElementType } from "react";

export interface EmptyStateProps {
  /** Texto principal destacado */
  title?: string;
  /** Texto secundario / descripción */
  subtitle?: string;
  /** Color del ícono y del título (acepta cualquier CSS color) */
  accentColor?: string;
  /** Color del subtítulo */
  subtitleColor?: string;
  /** Componente de ícono MUI (e.g. MonetizationOnIcon). Si se omite se muestra un SVG genérico */
  icon?: ElementType;
  /** Tamaño del ícono en px. Default 64 */
  iconSize?: number;
  /** sx extra para el contenedor raíz */
  sx?: SxProps<Theme>;
}

/**
 * EmptyState — componente genérico para pantallas / secciones sin datos.
 *
 * Uso mínimo:
 * ```tsx
 * <EmptyState title="Sin transacciones" accentColor={theme.accent} />
 * ```
 *
 * Con ícono MUI:
 * ```tsx
 * import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
 * <EmptyState
 *   icon={MonetizationOnIcon}
 *   title="Sin transacciones"
 *   subtitle="Aún no hay movimientos en tu wallet."
 *   accentColor="#00e2f6"
 * />
 * ```
 */
export default function EmptyState({
  title = "Sin datos",
  subtitle,
  accentColor = "#888",
  subtitleColor = "#aaaaaa",
  icon: Icon,
  iconSize = 64,
  sx,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 6,
        px: 2,
        textAlign: "center",
        ...sx,
      }}
    >
      {/* Ícono */}
      {Icon ? (
        <Icon sx={{ fontSize: iconSize, color: accentColor, opacity: 0.55 }} />
      ) : (
        <DefaultEmptyIcon size={iconSize} color={accentColor} />
      )}

      {/* Título */}
      <Typography
        variant="h6"
        sx={{
          color: accentColor,
          fontWeight: 700,
          letterSpacing: 1,
          opacity: 0.9,
        }}
      >
        {title}
      </Typography>

      {/* Subtítulo */}
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: subtitleColor,
            maxWidth: 320,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

/* SVG por defecto: una bandeja vacía */
function DefaultEmptyIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity={0.55}
    >
      <rect
        x="8"
        y="28"
        width="48"
        height="26"
        rx="4"
        stroke={color}
        strokeWidth="2.5"
      />
      <path
        d="M8 36h10l4-8h20l4 8h10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="24"
        y1="44"
        x2="40"
        y2="44"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="10"
        x2="32"
        y2="22"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="14"
        x2="24"
        y2="22"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="14"
        x2="40"
        y2="22"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
