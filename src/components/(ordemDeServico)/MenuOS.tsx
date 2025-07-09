import React from "react";
import { Button, Stack, Typography, Paper } from "@mui/material";

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
    <Paper
      className="bg-dark text-white"
      elevation={3}
      sx={{ p: 4, maxWidth: 400, margin: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Opções
      </Typography>
      <Stack spacing={2}>
        {menuItems.map((item, idx) => (
          <Button
            className="bg-secondary text-white"
            key={idx}
            variant="contained"
            fullWidth
            onClick={() => OsMenuSelected(item.action)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}
