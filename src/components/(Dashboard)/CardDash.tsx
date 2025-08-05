import React from "react";
import type { ReactElement } from "react";
import { useApp } from "@/context/AppContext";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssessmentIcon from "@mui/icons-material/Assessment";

type TipoItem =
  | "clientes"
  | "motos"
  | "ordemsServico"
  | "estoque"
  | "relatorios";

type CardDashProps = {
  tipo: TipoItem;
  titulo?: string;
  onClick?: () => void;
};
const icones: Record<TipoItem, ReactElement> = {
  clientes: <PeopleAltIcon fontSize="large" color="primary" />,
  motos: <TwoWheelerIcon fontSize="large" color="success" />,
  ordemsServico: <BuildCircleIcon fontSize="large" color="warning" />,
  estoque: <Inventory2Icon fontSize="large" color="secondary" />,
  relatorios: <AssessmentIcon fontSize="large" color="info" />,
};

const cores: Record<TipoItem, string> = {
  clientes: "#2196f3",
  motos: "#4caf50",
  ordemsServico: "#ff9800",
  estoque: "#9c27b0",
  relatorios: "#00bcd4",
};

export default function CardDash({ tipo, titulo, onClick }: CardDashProps) {
  const app = useApp();

  // Mapeia os totais correspondentes ao tipo
  const totais: Record<TipoItem, number | undefined> = {
    clientes: app.totalClientes,
    motos: app.totalMotos,
    ordemsServico: app.totalOrdensServico,
    estoque: app.totalProdutos,
    relatorios: 0, // pode ser ajustado depois
  };

  const total = totais[tipo] ?? 0;
  const tituloCard = titulo || tipo.charAt(0).toUpperCase() + tipo.slice(1);

  return (
    <Grid
      component={Button}
      onClick={onClick}
      sx={{ textTransform: "none" }}
      size={4}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
          transition: "0.3s",
          borderColor: cores[tipo],
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            {icones[tipo]}
            <Typography component="h2" variant="h6">
              {tituloCard}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="h4">{total}</Typography>
            <Chip size="small" label="Atualizado" color="default" />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
