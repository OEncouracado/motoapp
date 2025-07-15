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

import { useApp } from "@/context/AppContext";

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
  const { ordemsServico, clientes, motos } = useApp();

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

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="sm">
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
        <IconButton onClick={onFechar}>
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
            <Typography variant="h6">
              Total: R$ {os.total?.toFixed(2) || "0,00"}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onFechar}>Fechar</Button>
        <Button variant="outlined" color="primary">
          Editar OS
        </Button>
      </DialogActions>
    </Dialog>
  );
}
