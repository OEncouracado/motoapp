"use client";

import { useApp } from "@/context/AppContext";
import { Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import CachedIcon from "@mui/icons-material/Cached";

export default function ListarClientes2() {
  const { clientes, carregando, motos, carregarSessao } = useApp();
  console.log("motos :>> ", motos);
  const colunas: GridColDef[] = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "telefone", headerName: "Telefone", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "criado_em", headerName: "Cliente desde:", type: "date", flex: 1 },
    {
      field: "motos",
      headerName: "Motos",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={() => alert(`Listar motos do cliente: ${params.row.nome}`)}
          >
            Ver Motos
          </button>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => alert(`Editar cliente: ${params.row.nome}`)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger me-2"
            onClick={() => alert(`Excluir cliente: ${params.row.nome}`)}
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  const linhas = clientes?.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    cpf: cliente.cpf,
    criado_em: new Date(cliente.criado_em!),
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  if (carregando) return <div>Carregando clientes...</div>;

  return (
    <Paper elevation={3} className="m-4" sx={{}}>
      <Typography variant="h4" component="h1" className="p-4 text-center">
        Clientes
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
