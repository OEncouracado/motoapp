"use client";

import { useApp } from "@/context/AppContext";
import { Paper, Skeleton, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import CachedIcon from "@mui/icons-material/Cached";
import { ptBR } from "@mui/x-data-grid/locales";
import { useEffect, useState } from "react";
import FichaOrdemServicoModal from "./FichaOSModal";

export default function ListarOS() {
  const {
    clientes,
    carregando,
    motos,
    ordemsServico,
    carregarOrdensServico,
    carregarClientes,
    carregarMotos,
    buscarItensComProdutos,
  } = useApp();

  const [modalAberta, setModalAberta] = useState(false);
  const [osSelecionadaId, setOsSelecionadaId] = useState<string | null>(null);
  const [totaisOrdens, setTotaisOrdens] = useState<Record<string, number>>({});
  const [reloading, setReloading] = useState<boolean>(false);

  const reload = async () => {
    if (!clientes || clientes.length === 0) carregarClientes();
    if (!motos || motos.length === 0) carregarMotos();
    if (!ordemsServico || ordemsServico.length === 0) carregarOrdensServico();
  };
  const calcularTotais = async () => {
    if (!ordemsServico || ordemsServico.length === 0) return;

    const novosTotais: Record<string, number> = {};

    for (const os of ordemsServico) {
      const itensLista = await buscarItensComProdutos(os.id);
      const total = itensLista.reduce((soma, item) => {
        const quantidade = item.quantidade ?? 0;
        const valor = item.produtos.valor_venda ?? 0;
        return soma + quantidade * valor;
      }, 0);

      novosTotais[os.id] = total;
    }

    setTotaisOrdens(novosTotais);
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    calcularTotais();
  }, [ordemsServico]);

  const handleAbrirModal = (id: string) => {
    setOsSelecionadaId(id);
    setModalAberta(true);
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const recarregar = async () => {
    setReloading(true);
    calcularTotais();
    reload();
    await delay(500); // aguarda 500ms
    setReloading(false);
  };

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
            onClick={() => handleAbrirModal(params.row.id)}
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
    status: os.status.replace("_", " "),
    data_abertura: os.data_abertura ? new Date(os.data_abertura) : null,
    data_entrega_previsao: os.data_entrega_previsao
      ? new Date(os.data_entrega_previsao)
      : null,
    data_conclusao: os.data_conclusao ? new Date(os.data_conclusao) : null,
    observacoes: os.observacoes ?? "",
    total: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totaisOrdens[os.id] ?? 0),
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  if (carregando) return <div>Carregando Ordens de Serviço...</div>;

  return (
    <>
      <Paper elevation={3} className="m-4" sx={{}}>
        <Typography variant="h4" component="h1" className="p-4 text-center">
          Ordens de Serviço
          <CachedIcon
            className="ms-2"
            onClick={recarregar}
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
          loading={reloading} // <- Aqui ativa o modo de loading
        />
      </Paper>
      <FichaOrdemServicoModal
        aberto={modalAberta}
        onFechar={() => setModalAberta(false)}
        ordemServicoId={osSelecionadaId}
      />
    </>
  );
}
