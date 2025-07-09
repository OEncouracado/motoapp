"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/context/supabase";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";

export default function CadastrarClientesForm() {
  const { empresa } = useApp();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresa) {
      alert("Nenhuma empresa selecionada");
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .insert([{ nome, email, telefone, empresa_id: empresa.id }]);

    if (error) {
      alert("Erro ao cadastrar cliente: " + error.message);
    } else {
      alert("Cliente cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setTelefone("");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Paper component="form" onSubmit={handleSubmit} className="p-2">
        <Typography variant="h5" gutterBottom>
          Cadastrar Cliente
        </Typography>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Telefone"
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="CPF"
          type="text"
          value={cpf} // Placeholder for CPF, can be implemented later
          onChange={(e) => setCpf(e.target.value)}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Cadastrar Cliente
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={() => {
            setNome("");
            setEmail("");
            setTelefone("");
            setCpf("");
          }}
          sx={{ mt: 2, ml: 2 }}
        >
          Limpar Campos
        </Button>
      </Paper>
    </Box>
  );
}
