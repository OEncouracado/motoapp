import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useApp } from "@/context/AppContext";

export default function MenuEstoque({
  EstoqueMenuSelected,
}: {
  EstoqueMenuSelected: (action: string) => void;
}) {
  const { usuario } = useApp();
  const menuItems = [
    {
      label: "Estoque",
      action: "listar",
    },
    {
      label: "Entrada",
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
            onClick={() => EstoqueMenuSelected(item.action)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
}
