"use client";

import { useApp } from "@/context/AppContext";
import { Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import CachedIcon from "@mui/icons-material/Cached";
import { ptBR } from "@mui/x-data-grid/locales";

export default function ListarMotos() {
  const { clientes, carregando, motos, carregarSessao } = useApp();

  const colunas: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
    { field: "ano", headerName: "Ano", flex: 1 },
    { field: "placa", headerName: "Placa", flex: 1 },
    { field: "cor", headerName: "Cor", flex: 1 },
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

  if (carregando) return <div>Carregando Motos...</div>;

  return (
    <Paper className="m-4" sx={{ backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" component="h1" className="p-4 text-center">
        Motos
        <CachedIcon
          className="ms-2"
          onClick={carregarSessao}
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
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
