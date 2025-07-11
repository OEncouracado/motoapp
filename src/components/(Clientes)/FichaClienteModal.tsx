// src/components/FichaClienteModal.tsx
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
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import { useApp } from "@/context/AppContext";

type Cliente = {
  id: string;
  nome: string;
  cpf?: string;
  email: string;
  telefone: string;
  criado_em?: string;
  endereco?: string;
};

type Props = {
  aberto: boolean;
  onFechar: () => void;
  cliente: Cliente | null;
};

export default function FichaClienteModal({
  aberto,
  onFechar,
  cliente,
}: Props) {
  const { motos, ordemsServico } = useApp();

  const motosDoCliente = motos?.filter(
    (moto) => moto.cliente_id === cliente?.id
  );
  const osDoCliente = ordemsServico
    ?.filter((os) => os.cliente_id === cliente?.id)
    ?.sort(
      (a, b) =>
        new Date(b.data_abertura).getTime() -
        new Date(a.data_abertura).getTime()
    );

  if (!cliente) return null;

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PersonIcon color="primary" />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {cliente.nome}
        </Typography>
        <IconButton color="primary" size="small">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onFechar} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Dados pessoais */}
        <Stack spacing={1} mb={2}>
          {cliente.cpf && (
            <Typography variant="body2">
              <strong>CPF:</strong> {cliente.cpf}
            </Typography>
          )}
          {cliente.endereco && (
            <Typography variant="body2">
              <strong>Endereço:</strong> {cliente.endereco}
            </Typography>
          )}
          {cliente.criado_em && (
            <Typography variant="body2">
              <strong>Criado em:</strong>{" "}
              {new Date(cliente.criado_em).toLocaleDateString("pt-BR")}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Contato */}
        <Stack direction="row" spacing={2} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">{cliente.email}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">{cliente.telefone}</Typography>
          </Box>
        </Stack>

        {/* Motos */}
        <Typography variant="subtitle1" gutterBottom>
          <DirectionsBikeIcon fontSize="small" /> Motos
        </Typography>
        <List dense>
          {motosDoCliente?.length ? (
            motosDoCliente.map((moto, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`${moto.marca} ${moto.modelo}`}
                  secondary={`Placa: ${moto.placa} — Cor: ${moto.cor}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma moto cadastrada para este cliente.
            </Typography>
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Ordens de Serviço */}
        <Typography variant="subtitle1" gutterBottom>
          <AssignmentIcon fontSize="small" /> Ordens de Serviço
        </Typography>
        <List dense>
          {osDoCliente?.length ? (
            osDoCliente.map((os) => (
              <ListItem key={os.id}>
                <ListItemText
                  primary={`#${os.numero} - ${new Date(
                    os.data_abertura
                  ).toLocaleDateString("pt-BR")}`}
                  secondary={`Status: ${os.status}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma ordem de serviço cadastrada para este cliente.
            </Typography>
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onFechar}>Fechar</Button>
        <Button variant="outlined" color="primary">
          Ver ficha completa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
