import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import CachedIcon from "@mui/icons-material/Cached";

export default function CriarNovaOrdem() {
  const {
    usuario,
    clientes,
    motos,
    produtos,
    cadastrarRegistro,
    carregarClientes,
    carregarMotos,
  } = useApp();
  const reload = async () => {
    if (!clientes || clientes.length === 0) carregarClientes();
    if (!motos || motos.length === 0) carregarMotos();
  };
  const [clienteId, setClienteId] = useState("");
  const [motoId, setMotoId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<
    { produto_id: string; quantidade: number; valor_unitario: number }[]
  >([]);

  const [motosFiltradas, setMotosFiltradas] = useState([]);
  console.log("motos :>> ", motosFiltradas);
  useEffect(() => {
    reload();
  }, []);
  useEffect(() => {
    const filtradas = motos.filter((m) => m.cliente_id === clienteId);
    setMotoId(""); // reseta a seleção de moto
    setMotosFiltradas(filtradas);
  }, [clienteId, motos]);

  const handleAdicionarItem = () => {
    setItens((prev) => [
      ...prev,
      { produto_id: "", quantidade: 1, valor_unitario: 0 },
    ]);
  };

  const handleAlterarItem = (index: number, campo: string, valor: any) => {
    const novos = [...itens];
    novos[index][campo] =
      campo === "quantidade" || campo === "valor_unitario"
        ? Number(valor)
        : valor;
    setItens(novos);
  };

  const handleSalvar = async () => {
    if (!usuario?.empresa_id) return alert("Empresa não encontrada");

    try {
      // 1. Cadastrar ordem de serviço
      const novaOS = await cadastrarRegistro("ordens_servico", {
        cliente_id: clienteId,
        moto_id: motoId,
        observacoes,
        empresa_id: usuario.empresa_id,
        status: "aberta",
        data_abertura: new Date().toISOString(),
      });

      // 2. Cadastrar os itens
      for (const item of itens) {
        await cadastrarRegistro("itens_ordem_servico", {
          ordem_servico_id: novaOS.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          empresa_id: usuario.empresa_id,
        });
      }

      alert("Ordem de Serviço criada com sucesso!");
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cadastrar Nova Ordem de Serviço
        <CachedIcon
          className="ms-2"
          onClick={reload}
          style={{ cursor: "pointer" }}
        />
      </Typography>

      <Grid container spacing={2}>
        {/* Cliente */}
        <Grid size={12}>
          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            fullWidth
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Moto */}
        <Grid size={12}>
          <TextField
            select
            label="Moto"
            value={motoId}
            onChange={(e) => setMotoId(e.target.value)}
            fullWidth
            disabled={!clienteId}
          >
            {motosFiltradas.map((moto) => (
              <MenuItem key={moto.id} value={moto.id}>
                {moto.marca}-{moto.modelo} - {moto.chassi}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Observações */}
        <Grid size={12}>
          <TextField
            label="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        {/* Itens */}
        <Grid size={12}>
          <Typography variant="subtitle1">Produtos / Itens</Typography>
          {itens.map((item, index) => (
            <Grid container spacing={1} key={index} sx={{ mt: 1 }}>
              <Grid size={6}>
                <TextField
                  select
                  label="Produto"
                  value={item.produto_id}
                  onChange={(e) =>
                    handleAlterarItem(index, "produto_id", e.target.value)
                  }
                  fullWidth
                >
                  {produtos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={3}>
                <TextField
                  type="number"
                  label="Qtd"
                  value={item.quantidade}
                  onChange={(e) =>
                    handleAlterarItem(index, "quantidade", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  type="number"
                  label="Valor"
                  value={item.valor_unitario}
                  onChange={(e) =>
                    handleAlterarItem(index, "valor_unitario", e.target.value)
                  }
                  fullWidth
                >
                  {produtos.map((p) => (
                    <MenuItem key={p.id} value={p.valor_venda}>
                      {p.valor_venda}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          ))}

          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={handleAdicionarItem}
          >
            Adicionar Produto
          </Button>
        </Grid>

        {/* Botão Salvar */}
        <Grid size={12}>
          <Button variant="contained" color="primary" onClick={handleSalvar}>
            Salvar Ordem de Serviço
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
