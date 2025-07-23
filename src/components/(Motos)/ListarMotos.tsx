"use client";

import { useApp } from "@/context/AppContext";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import CachedIcon from "@mui/icons-material/Cached";
import { ptBR } from "@mui/x-data-grid/locales";
import { useEffect } from "react";

export default function ListarMotos() {
  const {
    clientes,
    carregando,
    motos,
    carregarMotos,
    carregarClientes,
    deletarRegistro,
    usuario,
  } = useApp();

  useEffect(() => {
    if (!clientes || clientes.length === 0) carregarClientes();
    if (!motos || motos.length === 0) carregarMotos();
  }, []);

  const colunas: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
    { field: "ano", headerName: "Ano", flex: 1 },
    { field: "placa", headerName: "Placa", flex: 1 },
    { field: "cor", headerName: "Cor", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box component={Grid} container>
          {/* <Grid size={usuario?.tipo === "admin" ? 6 : 12}>
            <Button variant="contained" onClick={() => handleRowClick(params)}>
              ver
            </Button>
          </Grid> */}
          {usuario?.tipo === "admin" ? (
            <Grid size={6}>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  handleDelete(String(params.id), params.row.placa)
                }
              >
                Excluir
              </Button>
            </Grid>
          ) : (
            ""
          )}
        </Box>
      ),
    },
  ];

  const linhas = motos?.map((moto) => ({
    id: moto.id,
    cliente: clientes?.find((c) => c.id === moto.cliente_id)?.nome ?? "",
    marca: moto.marca,
    modelo: moto.modelo,
    ano: moto.ano,
    placa: moto.placa,
    cor: moto.cor,
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  const handleDelete = async (id: string, nome: string) => {
    const confirmado = confirm(`Tem certeza que deseja excluir ${nome}?`);
    if (!confirmado) return;
    try {
      await deletarRegistro("motos", id);
      alert("Excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir");
      console.log("error :>> ", error);
    }
  };

  if (carregando) return <div>Carregando Motos...</div>;

  return (
    <Paper elevation={3} className="m-4" sx={{}}>
      <Typography variant="h4" component="h1" className="p-4 text-center">
        Motos
        <CachedIcon
          className="ms-2"
          onClick={carregarMotos}
          style={{ cursor: "pointer" }}
        />
      </Typography>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={linhas}
        columns={colunas}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        showToolbar
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
