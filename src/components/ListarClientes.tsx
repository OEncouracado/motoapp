"use client"

import { useApp } from "@/context/AppContext";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";


export default function ListarClientes() {
  const { clientes, carregando } = useApp();

  if (carregando) return <div>Carregando clientes...</div>;

  return (
    <TableContainer component={Paper} className="m-4">
        <h2 style={{textAlign: "center"}}>Lista de Clientes</h2>
        <Table   aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>E-mail</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
  );
}