import { Grid, Paper, Typography } from "@mui/material";
import CardDash from "./CardDash";

type DashbProps = {
  handleSetOpcao: (
    valor:
      | "home"
      | "clientes"
      | "motos"
      | "ordemsServico"
      | "estoque"
      | "relatorios"
  ) => void;
};

export default function Dashb({ handleSetOpcao }: DashbProps) {
  return (
    <Grid container spacing={2}>
      <Grid component={Paper} elevation={3} className="p-2 pt-3" size={12}>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <CardDash tipo="clientes" onClick={() => handleSetOpcao("clientes")} />
      <CardDash tipo="motos" onClick={() => handleSetOpcao("motos")} />
      <CardDash
        tipo="ordemsServico"
        titulo="Ordens de Serviço"
        onClick={() => handleSetOpcao("ordemsServico")}
      />
      <CardDash tipo="estoque" onClick={() => handleSetOpcao("estoque")} />
      <CardDash
        tipo="relatorios"
        titulo="Relatórios"
        onClick={() => handleSetOpcao("relatorios")}
      />
    </Grid>
  );
}
