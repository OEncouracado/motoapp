import React from "react";
import { Button, Stack, Typography } from "@mui/material";

export default function MenuMotos({
  MotosMenuSelected,
}: {
  MotosMenuSelected: (action: string) => void;
}) {
  const menuItems = [
    {
      label: "Listar Motos",
      action: "listar",
    },
    {
      label: "Nova Moto",
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
            className=""
            key={idx}
            variant="contained"
            fullWidth
            onClick={() => MotosMenuSelected(item.action)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
}
