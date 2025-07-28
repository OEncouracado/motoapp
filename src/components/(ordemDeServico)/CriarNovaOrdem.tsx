import { Box, Grid, TextField, Typography } from "@mui/material";

export default function CriarNovaOrdem() {
  return (
    <>
      <Typography variant="h5">Cadastrar Nova Ordem de Serviço</Typography>
      <Box component="form">
        <Grid spacing={2} size={12} container>
          <Grid component={TextField} label="" />
        </Grid>
      </Box>
    </>
  );
}
