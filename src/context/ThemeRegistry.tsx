// src/components/ThemeRegistry.tsx
"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { lightTheme, darkTheme } from "@/themes";

export function ThemeRegistry({ children }: { children: ReactNode }) {
  const { themeMode } = useApp();

  const theme = useMemo(
    () => (themeMode === "dark" ? darkTheme : lightTheme),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
