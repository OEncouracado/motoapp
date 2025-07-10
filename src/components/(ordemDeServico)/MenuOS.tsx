import React from "react";
import { Button, Stack, Typography } from "@mui/material";

export default function MenuOS({
  OsMenuSelected,
}: {
  OsMenuSelected: (action: string) => void;
}) {
  const menuItems = [
    {
      label: "Listar Ordens",
      action: "listar",
    },
    {
      label: "Nova Ordem",
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
            onClick={() => OsMenuSelected(item.action)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </>
  );
}
