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

// 🎨 Estilo base do Paper
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1A2027",
  color: "white",
  textAlign: "center",
  padding: theme.spacing(2),
}));

// 🔠 Tipos de opções
type OpcaoPrincipal =
  | "home"
  | "clientes"
  | "motos"
  | "ordens_servico"
  | "estoque";
type SubOpcao = "listar" | "nova";

// 📦 Estado do reducer
type EstadoMenus = {
  opcao: OpcaoPrincipal;
  submenus: {
    clientes: SubOpcao;
    motos: SubOpcao;
    ordens_servico: SubOpcao;
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
    ordens_servico: "listar",
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
  const { carregando, empresa } = useApp();

  const { opcao, submenus } = state;

  const isListar =
    opcao !== "home" &&
    ["clientes", "motos", "ordens_servico"].includes(opcao) &&
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

  return (
    <>
      <ResponsiveAppBar handleSetOpcao={handleSetOpcao} />

      <Box
        component={Container}
        sx={{ flexGrow: 1, padding: 2, maxWidth: "98dvw !important" }}
      >
        <Grid container spacing={3}>
          {/* Lateral esquerda */}
          <Grid item xs={12} size={2}>
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
              {opcao === "ordens_servico" && (
                <MenuOS
                  OsMenuSelected={(op) =>
                    handleSetSubmenu("ordens_servico", op)
                  }
                />
              )}
              {opcao === "estoque" && <div>Estoque</div>}
            </Item>
          </Grid>

          {/* Conteúdo central */}
          <Grid item xs={12} size={isListar ? 10 : 8}>
            <Item>
              {opcao === "home" && <div>Home</div>}

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
                <div>Formulário de Cadastrar Moto</div>
              )}

              {opcao === "ordens_servico" &&
                submenus.ordens_servico === "listar" && <ListarOS />}
              {opcao === "ordens_servico" &&
                submenus.ordens_servico === "nova" && (
                  <div>Nova Ordem de Serviço</div>
                )}

              {opcao === "estoque" && <div>Estoque</div>}
            </Item>
          </Grid>

          {/* Lateral direita */}
          {!isListar && (
            <Grid item xs={12} size={2}>
              <Item>
                <CartaoDeUsuarioHome />
              </Item>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
