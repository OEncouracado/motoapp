"use client";

import { useState } from "react";
import { TextField, Button, Paper, Stack, Typography } from "@mui/material";
import { useApp } from "@/context/AppContext";

export default function CadastrarClientesForm() {
  const { cadastrarCliente } = useApp();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastrarCliente({ nome, email, telefone, cpf, endereco });
      alert("Cliente cadastrado com sucesso!");
      // Limpa o formulário
      setNome("");
      setEmail("");
      setTelefone("");
      setCpf("");
      setEndereco("");
    } catch (err: any) {
      alert("Erro ao cadastrar cliente: " + err.message);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Novo Cliente
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <TextField
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <TextField
            label="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Cadastrar
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
