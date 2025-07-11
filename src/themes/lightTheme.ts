// src/themes/lightTheme.ts
import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    primary: {
      main: "#1976d2", // azul
    },
    secondary: {
      main: "#9c27b0", // roxo
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#555555",
    },
  },
  customColors: {
    mono: "#757575",
    destaque: "#ff4081",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});
