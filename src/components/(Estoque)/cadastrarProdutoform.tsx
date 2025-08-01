import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { parseString } from "xml2js";
import { createClient } from "@supabase/supabase-js";
import { useApp } from "@/context/AppContext";

interface ProdutoNFe {
  nome: string;
  codigo: string;
  quantidade: number;
  valor_unitario: number;
  unidade: string;
  valor_venda?: number;
}

export default function ProductForm() {
  const { cadastrarRegistro } = useApp();

  const [modoEntrada, setModoEntrada] = useState<"xml" | "manual">("xml");
  const [produtos, setProdutos] = useState<ProdutoNFe[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleModoChange = (
    _: React.MouseEvent<HTMLElement>,
    novoModo: "xml" | "manual" | null
  ) => {
    if (novoModo) setModoEntrada(novoModo);
  };

  const handleXmlUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlData = e.target?.result as string;

      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Erro ao processar XML", err);
          return;
        }

        try {
          const dets = result.nfeProc.NFe.infNFe.det;
          const itens = Array.isArray(dets) ? dets : [dets];

          const produtosExtraidos: ProdutoNFe[] = itens.map((item: any) => ({
            codigo: item.prod.cProd,
            nome: item.prod.xProd,
            quantidade: parseFloat(item.prod.qCom),
            valor_unitario: parseFloat(item.prod.vUnCom),
            unidade: item.prod.uCom,
          }));

          setProdutos(produtosExtraidos);
        } catch (error) {
          console.error("Erro ao extrair produtos:", error);
        }
      });
    };

    reader.readAsText(file);
  };

  const handleChangeProduto = (
    index: number,
    campo: keyof ProdutoNFe,
    valor: string
  ) => {
    const novos = [...produtos];
    if (
      campo === "quantidade" ||
      campo === "valor_unitario" ||
      campo === "valor_venda"
    ) {
      novos[index][campo] = parseFloat(valor);
    } else {
      novos[index][campo] = valor;
    }
    setProdutos(novos);
  };

  const adicionarProdutoManual = () => {
    setProdutos((prev) => [
      ...prev,
      {
        nome: "",
        codigo: "",
        quantidade: 1,
        valor_unitario: 0,
        unidade: "",
        valor_venda: 0,
      },
    ]);
  };

  const limparProdutos = () => {
    setProdutos([]);
    setErro(null);
    setSucesso(false);
  };

  const validarProdutos = () => {
    for (const p of produtos) {
      if (
        !p.nome ||
        !p.codigo ||
        !p.unidade ||
        p.quantidade <= 0 ||
        p.valor_unitario < 0
      ) {
        return false;
      }
    }
    return true;
  };

  const salvarProdutos = async () => {
    setErro(null);
    setSucesso(false);

    if (!validarProdutos()) {
      setErro("Preencha corretamente todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      Promise.all(
        produtos.map((p) =>
          cadastrarRegistro("produtos", {
            nome: p.nome,
            codigo: p.codigo,
            unidade: p.unidade,
            quantidade: p.quantidade,
            valor_compra: p.valor_unitario,
            valor_venda: p.valor_venda ?? p.valor_unitario,
            criado_em: new Date().toISOString(),
            empresa_id: "ID_DA_EMPRESA", // você pode puxar isso do contexto
          })
        )
      );

      setSucesso(true);
      limparProdutos();
    } catch (err: any) {
      console.error(err);
      setErro("Erro ao salvar produtos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Entrada de Produtos
      </Typography>

      <ToggleButtonGroup
        value={modoEntrada}
        exclusive
        onChange={handleModoChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="xml">Importar XML</ToggleButton>
        <ToggleButton value="manual">Entrada Manual</ToggleButton>
      </ToggleButtonGroup>

      {modoEntrada === "xml" && (
        <Button variant="contained" component="label">
          Selecionar Arquivo XML
          <input hidden type="file" accept=".xml" onChange={handleXmlUpload} />
        </Button>
      )}

      {modoEntrada === "manual" && (
        <Button variant="outlined" onClick={adicionarProdutoManual}>
          Adicionar Produto Manualmente
        </Button>
      )}

      {produtos.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Produtos
          </Typography>

          {produtos.map((produto, i) => (
            <Paper key={i} sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={produto.nome}
                    onChange={(e) =>
                      handleChangeProduto(i, "nome", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Código"
                    value={produto.codigo}
                    onChange={(e) =>
                      handleChangeProduto(i, "codigo", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Qtd"
                    value={produto.quantidade}
                    onChange={(e) =>
                      handleChangeProduto(i, "quantidade", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    fullWidth
                    label="Un"
                    value={produto.unidade}
                    onChange={(e) =>
                      handleChangeProduto(i, "unidade", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Valor Unit."
                    value={produto.valor_unitario}
                    onChange={(e) =>
                      handleChangeProduto(i, "valor_unitario", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Valor Venda"
                    value={produto.valor_venda ?? produto.valor_unitario}
                    onChange={(e) =>
                      handleChangeProduto(i, "valor_venda", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={limparProdutos}
              disabled={loading}
            >
              Limpar Produtos
            </Button>
            <Button
              variant="contained"
              onClick={salvarProdutos}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Produtos"}
            </Button>
          </Box>
        </Box>
      )}

      {erro && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro}
        </Alert>
      )}
      {sucesso && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Produtos salvos com sucesso!
        </Alert>
      )}
    </Container>
  );
}
