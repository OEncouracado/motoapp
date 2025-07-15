import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useApp } from "@/context/AppContext";

export default function MenuCliente({
  ClienteMenuSelected,
}: {
  ClienteMenuSelected: (action: string) => void;
}) {
  const { usuario } = useApp();
  const menuItems = [
    {
      label: "Listar Clientes",
      action: "listar",
    },
    {
      label: "Cadastrar Cliente",
      action: "nova",
    },
  ];

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Opções
      </Typography>
      <Stack spacing={2}>
        {menuItems.map((item, idx) => (
          <Button
            color="primary"
            key={idx}
            variant="contained"
            fullWidth
            disabled={item.action === "nova" && usuario?.tipo === "funcionario"}
            onClick={() => ClienteMenuSelected(item.action)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
}
