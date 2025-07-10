"use client";

import { useApp } from "@/context/AppContext";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";

function CartaoDeUsuarioHome() {
  const { usuario } = useApp();
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: "5rem",
        height: "5rem",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  return (
    <>
      <Box
        component={Container}
        className="flex flex-col items-center justify-center my-4"
      >
        <Avatar {...stringAvatar(`${usuario?.nome}`)} />

        <Typography variant="h6" className="mt-2">
          {usuario?.nome}
        </Typography>
        <Typography variant="body2" className=" my-2">
          {usuario?.email}
        </Typography>
        <Typography variant="body2" className="">
          {usuario?.tipo}
        </Typography>
        <Button variant="outlined" color="primary" className="mt-5">
          Ver Perfil
        </Button>
      </Box>
    </>
  );
}

export default CartaoDeUsuarioHome;
