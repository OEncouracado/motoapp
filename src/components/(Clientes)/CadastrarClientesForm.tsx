"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useApp } from "@/context/AppContext";

export default function CadastrarClientesForm() {
  const { cadastrarCliente, buscarPorCEP, endereco } = useApp();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  // const [endereco, setEndereco] = useState("");
  const [enderecoCEP, setEnderecoCEP] = useState("");

  useEffect(() => {
    if (enderecoCEP) {
      const buscar = async () => {
        await buscarPorCEP(enderecoCEP);
        console.log("Endereço :>> ", endereco);
      };
      buscar();
    }
  }, [enderecoCEP]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cadastrarCliente({
        nome,
        email,
        telefone,
        cpf,
        endereco: enderecoCEP,
      });
      alert("Cliente cadastrado com sucesso!");
      // Limpa o formulário
      setNome("");
      setEmail("");
      setTelefone("");
      setCpf("");
      // setEndereco("");
      setEnderecoCEP("");
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
          {/* <TextField
            label="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          /> */}
          <TextField
            label="CEP"
            type="number"
            value={enderecoCEP}
            onChange={(e) => setEnderecoCEP(e.target.value)}
          />
          <Box>
            <TextField
              className="me-1"
              label="Logradouro"
              value={endereco?.logradouro || ""}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Numero"
              value={endereco?.unidade || ""}
              // slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              className="mx-1"
              label="Complemento"
              value={endereco?.complemento || ""}
              // slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Bairro"
              value={endereco?.bairro || ""}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              className="ms-1"
              label="UF"
              value={endereco?.uf || ""}
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>
          <Button variant="contained" type="submit">
            Cadastrar
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
