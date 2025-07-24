"use client";

import ResponsiveAppBar from "@/components/AppBar";
import CartaoDeUsuarioHome from "@/components/CartaoDeUsuarioHome";
import { useApp } from "@/context/AppContext";
import { Box, Container, Grid, Paper, styled } from "@mui/material";
import { useReducer } from "react";
import ListarClientes2 from "@/components/(Clientes)/ListarClientes2";
import MenuOS from "@/components/(ordemDeServico)/MenuOS";
import ListarOS from "@/components/(ordemDeServico)/ListarOS";
import ListarMotos from "@/components/(Motos)/ListarMotos";
import MenuCliente from "@/components/(Clientes)/MenuClientes";
import CadastrarClientesForm from "@/components/(Clientes)/CadastrarClientesForm";
import MenuMotos from "@/components/(Motos)/MenuMotos";
import Dashb from "@/components/(Dashboard)/Dashboard";
import CadastrarMotoForm from "@/components/(Motos)/CadastrarMotoForm";
import MenuEstoque from "@/components/(Estoque)/MenuEstoque";
import ListarEstoque from "@/components/(Estoque)/ListarEstoque";
import Footer from "@/components/Footer";

// 🎨 Estilo base do Paper
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: "center",
  padding: theme.spacing(2),
}));

// 🔠 Tipos de opções
type OpcaoPrincipal =
  | "home"
  | "clientes"
  | "motos"
  | "ordemsServico"
  | "estoque";
type SubOpcao = "listar" | "nova";

// 📦 Estado do reducer
type EstadoMenus = {
  opcao: OpcaoPrincipal;
  submenus: {
    clientes: SubOpcao;
    motos: SubOpcao;
    ordemsServico: SubOpcao;
    estoque: SubOpcao;
  };
};

// 🎬 Ações do reducer
type AcaoMenus =
  | { type: "SET_OPCAO"; payload: OpcaoPrincipal }
  | {
      type: "SET_SUBMENU";
      payload: { menu: keyof EstadoMenus["submenus"]; valor: SubOpcao };
    };

// 🧱 Estado inicial
const estadoInicial: EstadoMenus = {
  opcao: "home",
  submenus: {
    clientes: "listar",
    motos: "listar",
    ordemsServico: "listar",
    estoque: "listar",
  },
};

// 🔁 Reducer principal
function menuReducer(state: EstadoMenus, action: AcaoMenus): EstadoMenus {
  switch (action.type) {
    case "SET_OPCAO":
      return { ...state, opcao: action.payload };
    case "SET_SUBMENU":
      return {
        ...state,
        submenus: {
          ...state.submenus,
          [action.payload.menu]: action.payload.valor,
        },
      };
    default:
      return state;
  }
}

export default function Dashboard() {
  const [state, dispatch] = useReducer(menuReducer, estadoInicial);
  const { carregando } = useApp();
  const { opcao, submenus } = state;

  const isListar =
    opcao !== "home" &&
    ["clientes", "motos", "ordemsServico", "estoque"].includes(opcao) &&
    submenus[opcao as keyof typeof submenus] === "listar";

  if (carregando) return <div>Carregando dados...</div>;

  // 🧭 Ações
  const handleSetOpcao = (valorOpcao: OpcaoPrincipal) => {
    dispatch({ type: "SET_OPCAO", payload: valorOpcao });
  };

  const handleSetSubmenu = (
    menu: keyof EstadoMenus["submenus"],
    valor: SubOpcao
  ) => {
    dispatch({ type: "SET_SUBMENU", payload: { menu, valor } });
  };
  console.log("opcao :>> ", opcao);
  return (
    <>
      <ResponsiveAppBar handleSetOpcao={handleSetOpcao} />

      <Box
        component={Container}
        sx={{ flexGrow: 1, padding: 2, maxWidth: "98dvw !important" }}
      >
        <Grid container spacing={3}>
          {/* Lateral esquerda */}
          <Grid size={2}>
            <Item>
              {opcao === "home" && <div>Bem-vindo ao Dashboard</div>}
              {opcao === "clientes" && (
                <MenuCliente
                  ClienteMenuSelected={(op) => handleSetSubmenu("clientes", op)}
                />
              )}
              {opcao === "motos" && (
                <MenuMotos
                  MotosMenuSelected={(op) => handleSetSubmenu("motos", op)}
                />
              )}
              {opcao === "ordemsServico" && (
                <MenuOS
                  OsMenuSelected={(op) => handleSetSubmenu("ordemsServico", op)}
                />
              )}
              {opcao === "estoque" && (
                <MenuEstoque
                  EstoqueMenuSelected={(op) => handleSetSubmenu("estoque", op)}
                />
              )}
            </Item>
          </Grid>

          {/* Conteúdo central */}
          <Grid size={isListar ? 10 : 8}>
            <Item>
              {opcao === "home" && <Dashb handleSetOpcao={handleSetOpcao} />}

              {opcao === "clientes" && submenus.clientes === "listar" && (
                <ListarClientes2 />
              )}
              {opcao === "clientes" && submenus.clientes === "nova" && (
                <CadastrarClientesForm />
              )}

              {opcao === "motos" && submenus.motos === "listar" && (
                <ListarMotos />
              )}
              {opcao === "motos" && submenus.motos === "nova" && (
                <CadastrarMotoForm />
              )}

              {opcao === "ordemsServico" &&
                submenus.ordemsServico === "listar" && <ListarOS />}
              {opcao === "ordemsServico" &&
                submenus.ordemsServico === "nova" && (
                  <div>Nova Ordem de Serviço</div>
                )}

              {opcao === "estoque" && submenus.estoque === "listar" && (
                <ListarEstoque />
              )}
              {opcao === "estoque" && submenus.estoque === "nova" && (
                <div>Estoque Nova</div>
              )}
            </Item>
          </Grid>

          {/* Lateral direita */}
          {!isListar && (
            <Grid size={2}>
              <Item>
                <CartaoDeUsuarioHome />
              </Item>
            </Grid>
          )}
        </Grid>
      </Box>
      <Footer sx={{ my: 4 }} />
    </>
  );
}
