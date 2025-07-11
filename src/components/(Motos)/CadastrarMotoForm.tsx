"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  TextField,
  Menu,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  MenuItem,
} from "@mui/material";

export default function CadastrarMotoForm() {
  const {
    clientes,
    marcas,
    modelos,
    carregarMarcas,
    carregarModelosPorMarca,
    empresa,
  } = useApp();

  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [marcaNomeSelecionada, setMarcaNomeSelecionada] = useState("");
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [modeloAnosSelecinados, setModeloAnosSelecionados] = useState("");
  const [ano, setAno] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [clienteId, setClienteId] = useState(""); // se for usado para vincular a cliente
  const [clienteNome, setClienteNome] = useState(""); // se for usado para vincular a cliente
  const [anos, setAnos] = useState([]);

  const anosTrim = modeloAnosSelecinados.split("a");
  const I = Number(anosTrim[0].trim());
  const N = Number(anosTrim[1].trim());

  const anosOpcao = Array.from({ length: N - I + 1 }, (_, i) => I + i);

  console.log("anosParte :>> ", I, N);
  console.log("anosOpcao :>> ", anosOpcao);
  useEffect(() => {
    carregarMarcas(); // só carrega as marcas uma vez
  }, []);

  useEffect(() => {
    if (marcaSelecionada) {
      carregarModelosPorMarca(marcaSelecionada); // carrega modelos da marca escolhida
    }
  }, [marcaSelecionada]);
  console.log("marcas :>> ", marcas);
  console.log("modelos :>> ", modelos);
  console.log("marcaSelecionada :>> ", marcaSelecionada);
  console.log("modeloSelecionado :>> ", modeloSelecionado);
  console.log("modeloAnosSelecionados :>> ", modeloAnosSelecinados);

  const handleMarcaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;

    const marca = marcas?.find((m) => m.id === id);
    if (!marca) return;

    setMarcaSelecionada(marca.id); // Para buscar os modelos
    setMarcaNomeSelecionada(marca.brand); // Para salvar no banco ou exibir
  };
  const handleModeloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;

    const modelo = modelos?.find((m) => m.id === id);
    if (!modelo) return;

    setModeloSelecionado(modelo.id); // Para buscar os modelos
    setModeloAnosSelecionados(modelo.years); // Para salvar no banco ou exibir
  };
  const handleClienteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;

    const cliente = clientes?.find((m) => m.id === id);
    if (!cliente) return;

    setClienteId(cliente.id); // Para buscar os modelos
    setClienteNome(cliente.nome); // Para salvar no banco ou exibir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa) return alert("Empresa não identificada");

    // Salvar no Supabase ou outro backend aqui
    alert(
      `Nova moto: ${marcaNomeSelecionada} - ${modeloSelecionado} (${ano}) Placa: ${placa} do Cliente ${clienteNome}`
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Moto
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              select
              fullWidth
              label="Marca"
              value={marcaSelecionada}
              onChange={handleMarcaChange}
              required
            >
              {marcas?.map((marca) => (
                <MenuItem key={marca.id} value={marca.id}>
                  {marca.brand}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={2}>
            <TextField
              select
              fullWidth
              label="Modelo"
              value={modeloSelecionado}
              onChange={handleModeloChange}
              required
              disabled={!modelos || modelos.length === 0}
            >
              {modelos?.map((modelo) => (
                <MenuItem key={modelo.id} value={modelo.id}>
                  {modelo.model}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={4}>
            <TextField
              select
              fullWidth
              label="Cliente"
              value={clienteId}
              onChange={handleClienteChange}
              required
              disabled={!clientes || clientes.length === 0}
            >
              {clientes?.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              required
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              required
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
