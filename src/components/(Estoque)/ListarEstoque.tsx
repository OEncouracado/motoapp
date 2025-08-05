"use client";

import { useApp } from "@/context/AppContext";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import {
  GridColDef,
  DataGrid,
  GridRowParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect, useState } from "react";
import ProdutoModal from "./ProdutoModal";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ListarEstoque() {
  const { produtos, carregarProdutos, carregando, usuario } = useApp();
  useEffect(() => {
    if (!produtos || produtos.length === 0) carregarProdutos();
  }, []);

  const [produtoSelecionado, setprodutoSelecionado] = useState<
    string | number | null
  >(null);

  const [modalAberta, setModalAberta] = useState(false);
  console.log("produtoSelecionado :>> ", produtoSelecionado);
  const handleRowClick = (params: GridRowParams) => {
    setprodutoSelecionado(params.id); // dados do produto
    setModalAberta(true);
  };
  const handleFecharModal = () => {
    setprodutoSelecionado(null);
    setModalAberta(false);
  };

  const colunas: GridColDef[] = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "codigo", headerName: "Código", flex: 1 },
    { field: "quantidade", headerName: "Em estoque", flex: 1 },
    { field: "valor_venda", headerName: "Preço", flex: 1 },
    { field: "descricao", headerName: "Descrição", flex: 1 },
    { field: "unidade", headerName: "Un", flex: 1 },
    { field: "ultima_atualizacao", headerName: "Última Entrada", flex: 1 },
    { field: "categoria", headerName: "Categoria", flex: 1 },
    {
      field: "criado_em",
      headerName: "Data de Cadastro:",
      type: "date",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box component={Grid} spacing={2} container>
          <Grid
            component={Button}
            size={usuario?.tipo === "admin" ? 6 : 12}
            onClick={() => handleRowClick(params as unknown as GridRowParams)}
          >
            <VisibilityIcon />
          </Grid>
          {usuario?.tipo === "admin" ? (
            <Grid
              component={Button}
              color="#F44336"
              onClick={() =>
                confirm(
                  `Tem certeza? 
Excluir produto: ${params.row.nome}`
                )
              }
              size={6}
            >
              <DeleteIcon />
            </Grid>
          ) : (
            ""
          )}
        </Box>
      ),
    },
  ];
  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  const linhas = produtos?.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    codigo: produto.codigo,
    quantidade: produto.quantidade,
    valor_venda: formatarPreco(produto.valor_venda),
    descricao: produto.descricao ?? "-",
    unidade: produto.unidade ?? "-",
    categoria: produto.categoria ?? "-",
    ultima_atualizacao: produto.ultima_atualizacao
      ? new Date(produto.ultima_atualizacao)
      : null,
    criado_em: produto.criado_em ? new Date(produto.criado_em) : null,
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  if (carregando) return <div>Carregando produtos...</div>;

  return (
    <>
      <Paper elevation={3} className="m-4" sx={{}}>
        <Typography variant="h4" component="h1" className="p-4 text-center">
          Estoque
          <CachedIcon
            className="ms-2"
            onClick={carregarProdutos}
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
          showToolbar
        />
      </Paper>
      <ProdutoModal
        aberto={modalAberta}
        onFechar={handleFecharModal}
        produtoId={produtoSelecionado}
      />
    </>
  );
}
