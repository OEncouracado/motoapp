"use client";

import { useApp } from "@/context/AppContext";
import { Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import CachedIcon from "@mui/icons-material/Cached";
import { ptBR } from "@mui/x-data-grid/locales";

export default function ListarOS() {
  const { clientes, carregando, motos, ordemsServico, carregarSessao } =
    useApp();

  const colunas: GridColDef[] = [
    { field: "num", headerName: "Ordem Nº", flex: 1 },
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "moto", headerName: "Moto", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
    { field: "data_abertura", type: "date", headerName: "Abertura", flex: 1 },
    {
      field: "data_entrega_previsao",
      headerName: "Previsão:",
      type: "date",
      flex: 1,
    },
    {
      field: "data_conclusao",
      headerName: "Conclusão:",
      type: "date",
      flex: 1,
    },
    { field: "observacoes", headerName: "Observações:", flex: 1 },
    { field: "total", headerName: "Total:", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => alert(`Editar OS: ${params.row.cliente}`)}
          >
            Ver OS
          </button>
        </div>
      ),
    },
  ];

  const linhas = ordemsServico?.map((os) => ({
    id: os.id,
    num: os.numero ?? 0, // Adiciona o número da ordem se existir
    cliente: clientes?.find((c) => c.id === os.cliente_id)?.nome ?? "",
    moto: motos?.find((m) => m.id === os.moto_id)?.modelo ?? "",
    status: os.status,
    data_abertura: os.data_abertura ? new Date(os.data_abertura) : null,
    data_entrega_previsao: os.data_entrega_previsao
      ? new Date(os.data_entrega_previsao)
      : null,
    data_conclusao: os.data_conclusao ? new Date(os.data_conclusao) : null,
    observacoes: os.observacoes ?? "",
    total: os.total ?? 0,
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  if (carregando) return <div>Carregando Ordens de Serviço...</div>;

  return (
    <Paper className="m-4" sx={{ backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" component="h1" className="p-4 text-center">
        Ordens de Serviço
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
