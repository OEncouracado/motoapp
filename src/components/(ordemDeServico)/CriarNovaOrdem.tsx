import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import CachedIcon from "@mui/icons-material/Cached";
import ClearIcon from "@mui/icons-material/Clear";

type Item = {
  produto_id: string;
  quantidade: number;
  valor_unitario: number;
  unidade?: string;
  tipo?: "catalogo" | "manual";
  nome_manual?: string;
};

export default function CriarNovaOrdem() {
  const {
    empresa,
    clientes,
    motos,
    produtos,
    cadastrarRegistro,
    carregarClientes,
    carregarMotos,
    carregarProdutos,
  } = useApp();
  const reload = async () => {
    if (!clientes || clientes.length === 0) carregarClientes();
    if (!motos || motos.length === 0) carregarMotos();
    if (!produtos || produtos.length === 0) carregarProdutos();
  };
  const [clienteId, setClienteId] = useState("");
  const [motoId, setMotoId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<
    { produto_id: string; quantidade: number; valor_unitario: number }[]
  >([]);

  const [motosFiltradas, setMotosFiltradas] = useState([]);
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
      {
        produto_id: "",
        quantidade: 1,
        valor_unitario: 0,
        tipo: "catalogo", // padrão
        unidade: "Un",
        nome_manual: "",
      },
    ]);
  };
  const handleRemoverItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const handleAlterarItem = (index: number, campo: string, valor: any) => {
    const novos = [...itens];
    novos[index] = {
      ...novos[index],
      [campo]:
        campo === "quantidade" || campo === "valor_unitario"
          ? Number(valor)
          : valor,
    };

    // Se for produto_id, atualiza valor e unidade
    if (campo === "produto_id") {
      novos[index].tipo = valor === "manual" ? "manual" : "catalogo";

      if (valor === "manual") {
        novos[index].valor_unitario = 0;
        novos[index].unidade = "Un";
      } else {
        const produtoSelecionado = produtos.find((p) => p.id === valor);
        novos[index].valor_unitario = produtoSelecionado?.valor_venda || 0;
        novos[index].unidade = produtoSelecionado?.unidade || "Un";
      }
    }

    setItens(novos);
  };

  const handleSalvar = async () => {
    if (!empresa) return alert("Empresa não encontrada");

    try {
      // 1. Cadastrar ordem de serviço
      const novaOS = await cadastrarRegistro("ordens_servico", {
        cliente_id: clienteId,
        moto_id: motoId,
        observacoes,
        empresa_id: empresa.id,
        status: "aberta",
        data_abertura: new Date().toISOString(),
      });

      // 2. Cadastrar os itens
      for (const item of itens) {
        await cadastrarRegistro("itens_ordem_servico", {
          ordem_servico_id: novaOS.id,
          produto_id: item.produto_id === "manual" ? null : item.produto_id,
          nome_manual: item.tipo === "manual" ? item.nome_manual : null,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          empresa_id: empresa.id,
        });
      }

      alert("Ordem de Serviço criada com sucesso!");
      // ✅ Limpar o formulário
      setClienteId("");
      setMotoId("");
      setObservacoes("");
      setItens([]);
      setMotosFiltradas([]);
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
              <Grid size={item.tipo === "manual" ? 3 : 6}>
                <TextField
                  select
                  label="Produto"
                  value={item.produto_id}
                  onChange={(e) =>
                    handleAlterarItem(index, "produto_id", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="manual">Produto Manual</MenuItem>
                  {produtos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Nome Manual */}
              {item.tipo === "manual" && (
                <Grid size={3}>
                  <TextField
                    type="text"
                    label="Nome do Produto Manual"
                    value={item.nome_manual}
                    onChange={(e) =>
                      handleAlterarItem(index, "nome_manual", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
              )}

              <Grid size={1}>
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

              <Grid size={1}>
                <TextField
                  type="text"
                  label="Un"
                  value={item.unidade}
                  inputProps={{
                    readOnly: item.tipo === "manual" ? false : true,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid size={2}>
                <TextField
                  type="number"
                  label="Valor"
                  value={item.valor_unitario}
                  onChange={(e) =>
                    handleAlterarItem(index, "valor_unitario", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={1}>
                <TextField
                  type="number"
                  label="Total"
                  value={item.quantidade * item.valor_unitario}
                  inputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid
                container
                sx={{ justifyContent: "center", alignItems: "center" }}
                size={1}
              >
                <IconButton
                  title="Remover Item"
                  onClick={() => handleRemoverItem(index)}
                  color="error"
                >
                  <ClearIcon />
                </IconButton>
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
