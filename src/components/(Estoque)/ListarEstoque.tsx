"use client";

import { useApp } from "@/context/AppContext";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect } from "react";

export default function ListarEstoque() {
  const { produtos, carregarProdutos, carregando, usuario } = useApp();
  useEffect(() => {
    if (!produtos || produtos.length === 0) carregarProdutos();
  }, []);

  // const [produtoSelecionado, setprodutoSelecionado] = useState();
  // const [modalAberta, setModalAberta] = useState(false);

  // const handleRowClick = (params) => {
  //   setprodutoSelecionado(params.row); // dados do produto
  //   setModalAberta(true);
  // };

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
                  confirm(
                    `Tem certeza? 
Excluir produto: ${params.row.nome}`
                  )
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
      {/* <FichaProdutoModal
        aberto={modalAberta}
        onFechar={() => setModalAberta(false)}
        produto={produtoSelecionado}
      /> */}
    </>
  );
}
