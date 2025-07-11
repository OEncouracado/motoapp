// src/theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      mono: string;
      destaque?: string;
    };
  }

  interface ThemeOptions {
    customColors?: {
      mono?: string;
      destaque?: string;
    };
  }
}
