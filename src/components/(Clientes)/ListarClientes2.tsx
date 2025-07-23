"use client";

import { useApp } from "@/context/AppContext";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect, useState } from "react";
import FichaClienteModal from "./FichaClienteModal";

export default function ListarClientes2() {
  const { clientes, carregando, carregarClientes, usuario, deletarRegistro } =
    useApp();
  useEffect(() => {
    if (!clientes || clientes.length === 0) carregarClientes();
  }, []);
  const [clienteSelecionado, setClienteSelecionado] = useState();
  const [modalAberta, setModalAberta] = useState(false);

  const handleRowClick = (params) => {
    setClienteSelecionado(params.row); // dados do cliente
    setModalAberta(true);
  };

  const handleDelete = async (id: string, nome: string) => {
    const confirmado = confirm(`Tem certeza que deseja excluir ${nome}?`);
    if (!confirmado) return;
    try {
      await deletarRegistro("clientes", id);
      alert("Excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir");
      console.log("error :>> ", error);
    }
  };

  const colunas: GridColDef[] = [
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "telefone", headerName: "Telefone", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "endereco", headerName: "Endereço", flex: 1 },
    { field: "criado_em", headerName: "Cliente desde:", type: "date", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box component={Grid} container>
          <Grid size={usuario?.tipo === "admin" ? 6 : 12}>
            <Button variant="contained" onClick={() => handleRowClick(params)}>
              ver
            </Button>
          </Grid>
          {usuario?.tipo === "admin" ? (
            <Grid size={6}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(String(params.id), params.row.nome)}
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

  const linhas = clientes?.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
    cpf: cliente.cpf,
    criado_em: new Date(cliente.criado_em!),
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  if (carregando) return <div>Carregando clientes...</div>;

  return (
    <>
      <Paper elevation={3} className="m-4" sx={{}}>
        <Typography variant="h4" component="h1" className="p-4 text-center">
          Clientes
          <CachedIcon
            className="ms-2"
            onClick={carregarClientes}
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
      <FichaClienteModal
        aberto={modalAberta}
        onFechar={() => setModalAberta(false)}
        cliente={clienteSelecionado}
      />
    </>
  );
}
