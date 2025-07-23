import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ProdutoModal({ aberto, onFechar, produtoId }) {
  const { buscarRegistroPorId, editarRegistro, carregarProdutos } = useApp();
  const [form, setForm] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      if (!produtoId) return;
      const p = await buscarRegistroPorId("produtos", produtoId);
      setForm(p);
      setModoEdicao(false);
    };

    carregar();
  }, [produtoId]);

  const handleEditar = () => setModoEdicao(true);

  const handleCancelar = () => setModoEdicao(false);

  const handleSalvar = async () => {
    await editarRegistro("produtos", form.id, form);
    await carregarProdutos();
    setModoEdicao(false);
    onFechar();
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!form) return null;

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="md">
      <DialogTitle>
        {modoEdicao ? "Editar Produto" : `Visualizando: ${form.nome}`}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="Nome"
              name="nome"
              value={form.nome || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Código"
              name="codigo"
              value={form.codigo || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Quantidade"
              name="quantidade"
              type="number"
              value={form.quantidade || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Valor de Venda"
              name="valor_venda"
              type="number"
              value={form.valor_venda || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Descrição"
              name="descricao"
              value={form.descricao || ""}
              onChange={handleChange}
              fullWidth
              multiline
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Unidade"
              name="unidade"
              value={form.unidade || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Categoria"
              name="categoria"
              value={form.categoria || ""}
              onChange={handleChange}
              fullWidth
              slotProps={{ input: { readOnly: !modoEdicao } }}
              variant={modoEdicao ? "filled" : "outlined"}
              //   disabled={!modoEdicao}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {modoEdicao ? (
          <>
            <Button onClick={handleCancelar}>Cancelar</Button>
            <Button onClick={handleSalvar} variant="contained" color="primary">
              Salvar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onFechar}>Fechar</Button>
            <Button onClick={handleEditar} variant="contained">
              Editar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
