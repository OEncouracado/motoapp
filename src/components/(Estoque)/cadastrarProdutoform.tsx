import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { parseString } from "xml2js";

interface ProdutoNFe {
  nome: string;
  codigo: string;
  quantidade: number;
  valor_unitario: number;
  unidade: string;
}

export default function ProductForm() {
  const [produtos, setProdutos] = useState<ProdutoNFe[]>([]);

  const handleXmlUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlData = e.target?.result as string;

      parseString(
        xmlData,
        { explicitArray: false },
        (err: object, result: string) => {
          if (err) {
            console.error("Erro ao processar XML", err);
            return;
          }

          try {
            console.log("result :>> ", result);
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
        }
      );
    };

    reader.readAsText(file);
  };

  const handleChangeProduto = (
    index: number,
    campo: keyof ProdutoNFe,
    valor: string
  ) => {
    const novos = [...produtos];
    if (campo === "quantidade" || campo === "valor_unitario") {
      novos[index][campo] = parseFloat(valor);
    } else {
      novos[index][campo] = valor;
    }
    setProdutos(novos);
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Entrada de Produtos via XML NFe
      </Typography>

      <Button variant="contained" component="label">
        Importar XML
        <input hidden type="file" accept=".xml" onChange={handleXmlUpload} />
      </Button>

      {produtos.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Produtos da NFe</Typography>
          {produtos.map((produto, i) => (
            <Paper key={i} sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={produto.nome}
                    onChange={(e) =>
                      handleChangeProduto(i, "nome", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={2}>
                  <TextField
                    fullWidth
                    label="Código"
                    value={produto.codigo}
                    onChange={(e) =>
                      handleChangeProduto(i, "codigo", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={2}>
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
                <Grid size={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Valor Unitário"
                    value={produto.valor_unitario}
                    onChange={(e) =>
                      handleChangeProduto(i, "valor_unitario", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={2}>
                  <TextField
                    fullWidth
                    label="Unidade"
                    value={produto.unidade}
                    onChange={(e) =>
                      handleChangeProduto(i, "unidade", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
