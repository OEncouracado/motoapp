"use client";

import ResponsiveAppBar from "@/components/AppBar";
import CartaoDeUsuarioHome from "@/components/CartaoDeUsuarioHome";
import { useApp } from "@/context/AppContext";
import { Box, Container, Grid, Paper, styled } from "@mui/material";
import { use, useEffect, useState } from "react";
import ListarClientes2 from "@/components/(Clientes)/ListarClientes2";
import MenuOS from "@/components/(ordemDeServico)/MenuOS";
import ListarOS from "@/components/(ordemDeServico)/ListarOS";
import ListarMotos from "@/components/(Motos)/ListarMotos";
import MenuCliente from "@/components/(Clientes)/MenuClientes";
import CadastrarClientesForm from "@/components/(Clientes)/CadastrarClientesForm";
import MenuMotos from "@/components/(Motos)/MenuMotos";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1A2027",
  color: "white",
  textAlign: "center",
  padding: theme.spacing(2),
}));

export default function Dashboard() {
  const [opcao, setOpcao] = useState("home");
  const [menuOs, setMenuOs] = useState("listar");
  const [menuCliente, setMenuCliente] = useState("listar");
  const [menuMotos, setMenuMotos] = useState("listar");
  const [isListar, setIsListar] = useState(false);
  const { carregando, empresa } = useApp();

  console.log("empresa :>> ", empresa);

  useEffect(() => {
    const deveListar =
      (menuOs === "listar" ||
        menuCliente === "listar" ||
        menuMotos === "listar") &&
      opcao !== "home";

    if (isListar !== deveListar) {
      setIsListar(deveListar);
    }
  }, [menuOs, menuCliente, menuMotos, opcao]);

  if (carregando) return <div>Carregando dados...</div>;

  const handleSetOpcao = (valorOpcao: string) => {
    setOpcao(valorOpcao);
    console.log("1 Opção selecionada:", opcao);
  };

  const MotosMenuSelected = (valorOpcao: string) => {
    setMenuMotos(valorOpcao);
    console.log("2 Opção selecionada:", menuOs);
  };
  const OsMenuSelected = (valorOpcao: string) => {
    setMenuOs(valorOpcao);
    console.log("2 Opção selecionada:", menuOs);
  };
  const ClienteMenuSelected = (valorOpcao: string) => {
    setMenuCliente(valorOpcao);
    console.log("3 Opção selecionada:", menuOs);
  };
  return (
    <>
      <ResponsiveAppBar handleSetOpcao={handleSetOpcao} />
      <Box
        component={Container}
        sx={{ flexGrow: 1, padding: 2, maxWidth: "98dvw !important" }}
      >
        <Grid container spacing={3}>
          <Grid size={2}>
            <Item>
              {opcao === "home" && <div>Bem-vindo ao Dashboard</div>}
              {opcao === "clientes" && (
                <MenuCliente ClienteMenuSelected={ClienteMenuSelected} />
              )}
              {opcao === "motos" && (
                <MenuMotos MotosMenuSelected={MotosMenuSelected} />
              )}
              {opcao === "ordens_servico" && (
                <MenuOS OsMenuSelected={OsMenuSelected} />
              )}
              {opcao === "estoque" && <div>Estoque</div>}
            </Item>
          </Grid>
          <Grid size={!isListar ? 8 : 10}>
            <Item>
              {opcao === "home" && <div>Home</div>}
              {opcao === "clientes" && menuCliente === "listar" && (
                <ListarClientes2 />
              )}
              {opcao === "clientes" && menuCliente === "nova" && (
                <CadastrarClientesForm />
              )}
              {opcao === "motos" && menuMotos === "listar" && <ListarMotos />}
              {opcao === "motos" && menuMotos === "nova" && (
                <div>Formulário de Cadastrar Moto</div>
              )}
              {opcao === "ordens_servico" && menuOs === "listar" && (
                <ListarOS />
              )}
              {opcao === "ordens_servico" && menuOs === "nova" && (
                <div>Nova Ordens de Serviço</div>
              )}
              {opcao === "estoque" && <div>Estoque</div>}
            </Item>
          </Grid>
          <Grid
            size={!isListar ? 2 : 0}
            sx={{ display: isListar ? "none" : "block" }}
          >
            <Item>
              <CartaoDeUsuarioHome />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
