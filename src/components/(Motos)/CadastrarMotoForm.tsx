"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  MenuItem,
  Input,
} from "@mui/material";
import "./index.css";

export default function CadastrarMotoForm() {
  const {
    carregarClientes,
    clientes,
    marcas,
    modelos,
    carregarMarcas,
    carregarModelosPorMarca,
    empresa,
    cadastrarMoto,
  } = useApp();

  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [marcaNomeSelecionada, setMarcaNomeSelecionada] = useState("");
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [modeloAnosSelecinados, setModeloAnosSelecionados] = useState("");
  const [modeloNomeSelecinado, setModeloNomeSelecionado] = useState("");
  const [ano, setAno] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [chassi, setChassi] = useState("");
  const [cliente_id, setClienteId] = useState(""); // se for usado para vincular a cliente
  const [clienteNome, setClienteNome] = useState(""); // se for usado para vincular a cliente
  const [anos, setAnos] = useState<number[]>([]);
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    if (!modeloAnosSelecinados) return;

    const anosTrim = modeloAnosSelecinados.split("a");
    const Start = Number(anosTrim[0].trim());
    let End = Number(anosTrim[1]?.trim());

    if (isNaN(End)) {
      End = new Date().getFullYear();
    }

    if (!isNaN(Start) && Start <= End) {
      const anosOpcao = Array.from(
        { length: End - Start + 1 },
        (_, i) => Start + i
      );
      setAnos(anosOpcao);
    }
  }, [modeloAnosSelecinados]);

  useEffect(() => {
    carregarMarcas(); // só carrega as marcas uma vez
  }, []);

  useEffect(() => {
    if (marcaSelecionada) {
      carregarModelosPorMarca(marcaSelecionada); // carrega modelos da marca escolhida
    }
  }, [marcaSelecionada]);

  useEffect(() => {
    if (!clientes || clientes.length === 0) carregarClientes();
  }, []);

  // console.log("marcas :>> ", marcas);
  // console.log("modelos :>> ", modelos);
  // console.log("marcaSelecionada :>> ", marcaSelecionada);
  // console.log("modeloSelecionado :>> ", modeloSelecionado);
  // console.log("modeloAnosSelecionados :>> ", modeloAnosSelecinados);
  console.log("ano :>> ", ano);
  console.log("anos :>> ", anos);

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
    setModeloNomeSelecionado(modelo.model);
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
    if (!cliente_id) return alert("Selecione um cliente");
    if (!modeloSelecionado) return alert("Selecione um modelo");
    if (!marcaNomeSelecionada) return alert("Selecione uma marca");

    try {
      await cadastrarMoto({
        cliente_id,
        placa,
        cor,
        ano,
        chassi: chassi || "", // caso use optional
        modelo: modeloNomeSelecinado,
        marca: marcaNomeSelecionada,
        imagem: imagem || "", // se estiver usando imagem opcional
      });

      alert("Moto cadastrada com sucesso!");

      // Limpa o formulário
      setMarcaSelecionada("");
      setMarcaNomeSelecionada("");
      setModeloSelecionado("");
      setModeloAnosSelecionados("");
      setAno("");
      setPlaca("");
      setCor("");
      setClienteId("");
      setClienteNome("");
      setAnos([]);
      setChassi("");
      setImagem("");
    } catch (err: any) {
      alert("Erro ao cadastrar moto: " + err.message);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Moto
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container size={12} spacing={2}>
          <Grid
            component={Input}
            type="file"
            sx={{ color: "#000", textAlign: "center" }}
            className="moto"
            container
            size={4}
          />
          <Grid container spacing={2} size={8}>
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
                value={cliente_id}
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
                select
                fullWidth
                label="Ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                required
                disabled={!anos || anos.length === 0}
              >
                {anos?.map((ano) => (
                  <MenuItem key={ano} value={ano}>
                    {ano}
                  </MenuItem>
                ))}
              </TextField>
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
            <Grid size={4}>
              <TextField
                fullWidth
                label="Chassi"
                value={chassi}
                onChange={(e) => setChassi(e.target.value)}
              />
            </Grid>

            <Grid size={12}>
              <Button variant="contained" type="submit">
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
