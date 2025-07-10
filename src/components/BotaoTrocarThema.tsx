import { useApp } from "@/context/AppContext";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function BotaoTrocarTema() {
  const { themeMode, toggleTheme } = useApp();
  console.log("themeMode :>> ", themeMode);
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
