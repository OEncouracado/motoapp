// src/components/FichaOrdemServicoModal.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Divider,
  Stack,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoIcon from "@mui/icons-material/Info";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  ordemServicoId: string | null;
};

export default function FichaOrdemServicoModal({
  aberto,
  onFechar,
  ordemServicoId,
}: Props) {
  const {
    ordemsServico,
    clientes,
    motos,
    carregarOrdensServico,
    carregarClientes,
    carregarMotos,
    buscarItensComProdutos,
  } = useApp();
  const [itensList, setItens] = useState([]);
  const [totaisOrdens, setTotaisOrdens] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!clientes || clientes.length === 0) carregarClientes();
    if (!motos || motos.length === 0) carregarMotos();
    if (!ordemsServico || ordemsServico.length === 0) carregarOrdensServico();
    if (!itensList || itensList.length === 0) carregarItensArray();
  }, []);
  const carregarItensArray = async () => {
    const itensArray = await buscarItensComProdutos(ordemServicoId);
    setItens(itensArray);
  };
  useEffect(() => {
    if (!itensList || itensList.length === 0) carregarItensArray();
    if (ordemServicoId) calcularTotais(); // ← adiciona essa linha aqui
  }, [ordemServicoId, aberto]);

  const os = ordemsServico?.find((os) => os.id === ordemServicoId);
  const cliente = clientes?.find((c) => c.id === os?.cliente_id);
  const moto = motos?.find((m) => m.id === os?.moto_id);

  if (!os || !cliente || !moto) return null;

  const statusColor = {
    aberta: "info",
    em_andamento: "warning",
    concluida: "success",
    cancelada: "error",
  }[os.status];

  const formatarPreco = (quant: number, valor: number) => {
    const total = quant * valor;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total);
  };

  const Reais = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const calcularTotais = async () => {
    if (!ordemServicoId) return;

    const itensLista = await buscarItensComProdutos(ordemServicoId);
    const total = itensLista.reduce((soma, item) => {
      const quantidade = item.quantidade ?? 0;
      const valor = item.valor_unitario ?? item.produtos?.valor_venda ?? 0;
      return soma + quantidade * valor;
    }, 0);

    setTotaisOrdens((prev) => ({
      ...prev,
      [ordemServicoId]: total,
    }));
  };

  const handleOnflechar = () => {
    setItens([]);
    onFechar();
  };

  return (
    <Dialog open={aberto} onClose={handleOnflechar} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <BuildIcon color="primary" />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ordem de Serviço #{os.numero}
        </Typography>
        <Chip
          label={os.status.replace("_", " ")}
          color={statusColor as any}
          size="small"
        />
        <IconButton onClick={handleOnflechar}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Datas */}
          <Typography variant="body2" color="text.secondary">
            Aberta em: {new Date(os.data_abertura).toLocaleDateString("pt-BR")}
            {os.data_entrega_previsao &&
              ` • Entrega prevista: ${new Date(
                os.data_entrega_previsao
              ).toLocaleDateString("pt-BR")}`}
            {os.data_conclusao &&
              ` • Concluída em: ${new Date(
                os.data_conclusao
              ).toLocaleDateString("pt-BR")}`}
          </Typography>

          <Divider />

          {/* Cliente e Moto */}
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box>
                <Typography variant="subtitle2">
                  <PersonIcon fontSize="small" /> Cliente
                </Typography>
                <Typography>{cliente.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cliente.telefone}
                  <br />
                  {cliente.email}
                </Typography>
              </Box>
            </Grid>

            <Grid size={6}>
              <Box>
                <Typography variant="subtitle2">
                  <DirectionsBikeIcon fontSize="small" /> Moto
                </Typography>
                <Typography>
                  {moto.marca} {moto.modelo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placa: {moto.placa}
                  <br />
                  Cor: {moto.cor}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider />
          {/* Itens */}
          <>
            <Typography variant="subtitle2">
              <ListAltIcon fontSize="small" /> Itens
            </Typography>
            <Box sx={{ height: "11rem", overflow: "auto" }}>
              {itensList.length === 0 ? (
                <Typography variant="body2">Nenhum item encontrado.</Typography>
              ) : (
                itensList.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        Produto: {item.produtos.nome}
                      </Typography>
                      <Box sx={{ display: "flex" }}>
                        <Typography
                          sx={{ marginRight: "0.5rem" }}
                          variant="body2"
                          color="text.secondary"
                        >
                          Quantidade: {item.quantidade}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unidade: {Reais(item.produtos.valor_venda)}
                        </Typography>
                      </Box>
                      {/* Adicione outros campos que quiser mostrar */}
                    </Box>
                    <Box
                      textAlign={"center"}
                      margin={"auto"}
                      sx={{ marginLeft: 0, marginRight: 0 }}
                    >
                      <Typography>
                        valor:{" "}
                        {formatarPreco(
                          item.quantidade,
                          item.produtos.valor_venda
                        )}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </>
          <Divider />

          {/* Observações */}
          {os.observacoes && (
            <>
              <Typography variant="subtitle2">
                <InfoIcon fontSize="small" /> Observações
              </Typography>
              <Typography variant="body2">{os.observacoes}</Typography>
              <Divider />
            </>
          )}

          {/* Valor */}
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoneyIcon color="success" />
            <Typography>
              Total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totaisOrdens[ordemServicoId] || 0)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleOnflechar}>Fechar</Button>
        <Button variant="outlined" color="primary">
          Editar OS
        </Button>
      </DialogActions>
    </Dialog>
  );
}
