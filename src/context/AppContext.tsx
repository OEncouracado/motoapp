// src/contexts/AppContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "./supabase";

// ---------- Tipos ----------
type Usuario = {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  tipo?: "admin" | "funcionario";
};

type Empresa = {
  id: string;
  nome: string;
  cnpj?: string;
  logo: string;
};

type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  criado_em?: string;
  endereco?: string;
};

type NovoCliente = {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  endereco?: string;
};

type Moto = {
  id: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
  chassi?: string;
};

type OrdemServico = {
  id: string;
  numero: number;
  empresa_id: string;
  cliente_id: string;
  moto_id: string;
  status: "aberta" | "em_andamento" | "concluida" | "cancelada";
  data_abertura: string;
  data_entrega_previsao?: string;
  data_conclusao?: string;
  observacoes?: string;
  total?: number;
  criado_em?: string;
};

export type Produto = {
  id: string;
  empresa_id: string;
  nome: string;
  codigo: string;
  quantidade: number;
  valor_compra: number;
  valor_venda: number;
  criado_em?: string;
  descricao?: string;
  unidade?: string;
  categoria?: string;
  estoque_minimo?: number;
  ultima_atualizacao?: string;
};

type MarcaFipe = {
  id: string;
  brand: string;
};

type ModeloFipe = {
  id: string;
  model: string;
  years: string;
};

type NovaMoto = {
  cliente_id: string;
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
  chassi: string;
  imagem?: string;
};
type Tabela = "clientes" | "motos" | "ordens_servico" | "produtos"; // adicione outras se quiser
// ---------- Contexto ----------
type AppContextType = {
  usuario: Usuario | null;
  empresa: Empresa | null;
  carregando: boolean;
  isLoggedIn: () => boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  carregarSessao: () => Promise<void>;
  themeMode: "light" | "dark";
  toggleTheme: () => void;
  marcas?: MarcaFipe[];
  modelos?: ModeloFipe[];
  carregarMarcas: () => Promise<void>;
  carregarModelosPorMarca: (marcaId: string) => Promise<void>;
  deletarRegistro: <T = any>(tabela: Tabela, id: string) => Promise<T | null>;
  editarRegistro: <T = any>(
    tabela: string,
    id: string | number,
    dados: Partial<T>,
    campoId?: string
  ) => Promise<T>;
  buscarRegistroPorId: <T = any>(
    tabela: string,
    id: string | number,
    campoId?: string
  ) => Promise<T>;

  // Totais
  totalClientes: number;
  totalMotos: number;
  totalOrdensServico: number;
  totalProdutos: number;
  totalRelatorios: number;
  carregarTotais: () => Promise<void>;

  // Dados completos sob demanda
  clientes?: Cliente[];
  motos?: Moto[];
  ordemsServico?: OrdemServico[];
  produtos?: Produto[];
  carregarClientes: () => Promise<void>;
  carregarMotos: () => Promise<void>;
  carregarOrdensServico: () => Promise<void>;
  carregarProdutos: () => Promise<void>;

  //Cadastros
  cadastrarMoto: (novaMoto: NovaMoto) => Promise<void>;
  cadastrarCliente: (novoCliente: NovoCliente) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);
const tokenIVTXT = process.env.NEXT_PUBLIC_INVERTEXTO_TOKEN;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [ordemsServico, setOrdemsServico] = useState<OrdemServico[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [totalClientes, setTotalClientes] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [totalOrdensServico, setTotalOrdensServico] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalRelatorios, setTotalRelatorios] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [marcas, setMarcas] = useState<MarcaFipe[]>([]);
  const [modelos, setModelos] = useState<ModeloFipe[]>([]);

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("themeMode", newTheme);
  };

  const contarRegistros = async (
    tabela: string,
    empresaId: string
  ): Promise<number> => {
    const { count, error } = await supabase
      .from(tabela)
      .select("*", { count: "exact", head: true })
      .eq("empresa_id", empresaId);
    if (error) return 0;
    return count || 0;
  };

  const carregarTotais = async () => {
    if (!empresa) return;
    const [c, m, o, p, r] = await Promise.all([
      contarRegistros("clientes", empresa.id),
      contarRegistros("motos", empresa.id),
      contarRegistros("ordens_servico", empresa.id),
      contarRegistros("produtos", empresa.id),
      contarRegistros("relatorios", empresa.id),
    ]);
    setTotalClientes(c);
    setTotalMotos(m);
    setTotalOrdensServico(o);
    setTotalProdutos(p);
    setTotalRelatorios(r);
    console.log("Totais  :>> ", c, m, o, p, r);
  };

  const carregarClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome, email, telefone, cpf, criado_em, endereco")
      .eq("empresa_id", empresa?.id);
    if (!error) setClientes(data ?? []);
  };

  const carregarMotos = async () => {
    const { data, error } = await supabase
      .from("motos")
      .select("id, cliente_id, marca, modelo, ano, placa, cor, chassi")
      .eq("empresa_id", empresa?.id);
    if (!error) setMotos(data ?? []);
  };

  const carregarOrdensServico = async () => {
    const { data, error } = await supabase
      .from("ordens_servico")
      .select(
        "id, numero, empresa_id, cliente_id, moto_id, status, data_abertura, data_entrega_previsao, data_conclusao, observacoes, total, criado_em"
      )
      .eq("empresa_id", empresa?.id);
    if (!error) setOrdemsServico(data ?? []);
  };

  const carregarProdutos = async () => {
    const { data, error } = await supabase
      .from("produtos")
      .select(
        "id, empresa_id, nome, codigo, quantidade, valor_compra, valor_venda, criado_em, descricao, unidade, categoria, estoque_minimo, ultima_atualizacao"
      )
      .eq("empresa_id", empresa?.id);
    if (!error) setProdutos(data ?? []);
  };

  const carregarMarcas = async () => {
    try {
      const res = await fetch(
        `https://api.invertexto.com/v1/fipe/brands/2?token=${tokenIVTXT}`
      );
      const data: MarcaFipe[] = await res.json();
      setMarcas(data);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    }
  };

  const carregarModelosPorMarca = async (marcaId: string) => {
    try {
      const res = await fetch(
        `https://api.invertexto.com/v1/fipe/models/${marcaId}?token=${tokenIVTXT}`
      );
      const data: ModeloFipe[] = await res.json();
      setModelos(data);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
    }
  };

  const logIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    window.location.href = "/auth/callback";
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/callback";
  };

  const isLoggedIn = () => !!usuario;

  const carregarSessao = async () => {
    setCarregando(true);
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData.user) throw new Error("Usuário não autenticado");

      const usuarioId = userData.user.id;
      setUsuario({ id: usuarioId, email: userData.user.email ?? "" });

      const { data: usuarioSistema } = await supabase
        .from("usuarios")
        .select("empresa_id, nome, sobrenome, tipo")
        .eq("id", usuarioId)
        .single();

      if (!usuarioSistema) throw new Error("Usuário não encontrado");

      const { data: empresaData } = await supabase
        .from("empresas")
        .select("id, nome, cnpj, logo")
        .eq("id", usuarioSistema.empresa_id)
        .single();

      if (!empresaData) throw new Error("Empresa não encontrada");

      setUsuario({
        id: usuarioId,
        email: userData.user.email ?? "",
        nome: usuarioSistema.nome,
        sobrenome: usuarioSistema.sobrenome,
        tipo: usuarioSistema.tipo,
      });
      setEmpresa(empresaData);

      await carregarTotais();
    } catch (err) {
      console.error("Erro ao carregar sessão:", err);
      setUsuario(null);
      setEmpresa(null);
    } finally {
      setCarregando(false);
    }
  };
  //---------- CADASTRAR CLIENTE ----------
  const cadastrarCliente = async (novoCliente: NovoCliente) => {
    if (!empresa) return;

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        ...novoCliente,
        empresa_id: empresa.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    // Atualiza o estado de clientes local
    setClientes((prev) => [...(prev ?? []), data]);
  };

  //---------- CADASTRAR MOTO ----------
  const cadastrarMoto = async (novaMoto: NovaMoto) => {
    if (!empresa) return;

    const { data, error } = await supabase
      .from("motos")
      .insert([{ ...novaMoto, empresa_id: empresa.id }]) // importante: precisa ser um array
      .select()
      .single();

    if (error) throw new Error(error.message);

    setMotos((prev) => [...(prev ?? []), data]);
  };

  useEffect(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved === "light" || saved === "dark") setThemeMode(saved);
  }, []);

  const editarRegistro = async <T = any,>(
    tabela: string,
    id: string | number,
    dados: Partial<T>,
    campoId: string = "id"
  ): Promise<T> => {
    const { data, error } = await supabase
      .from(tabela)
      .update(dados)
      .eq(campoId, id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao editar ${tabela}: ${error.message}`);

    return data;
  };

  const buscarRegistroPorId = async <T = any,>(
    tabela: string,
    id: string | number,
    campoId: string = "id"
  ): Promise<T> => {
    const { data, error } = await supabase
      .from(tabela)
      .select("*")
      .eq(campoId, id)
      .single();

    if (error) throw new Error(`Erro ao buscar ${tabela}: ${error.message}`);
    return data;
  };

  const deletarRegistro = async <T = any,>(
    tabela: string,
    id: string
  ): Promise<T | null> => {
    const { data, error } = await supabase
      .from(tabela)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Atualiza o estado local, se necessário
    switch (tabela) {
      case "clientes":
        setClientes((prev) => prev?.filter((item) => item.id !== id) ?? []);
        break;
      case "motos":
        setMotos((prev) => prev?.filter((item) => item.id !== id) ?? []);
        break;
      case "ordens_servico":
        setOrdemsServico(
          (prev) => prev?.filter((item) => item.id !== id) ?? []
        );
        break;
      case "produtos":
        setProdutos((prev) => prev?.filter((item) => item.id !== id) ?? []);
        break;
      // Adicione mais conforme necessário
    }

    return data;
  };

  useEffect(() => {
    carregarSessao();
  }, []);

  return (
    <AppContext.Provider
      value={{
        usuario,
        empresa,
        carregando,
        logIn,
        logOut,
        isLoggedIn,
        carregarSessao,
        themeMode,
        toggleTheme,
        marcas,
        modelos,
        carregarMarcas,
        carregarModelosPorMarca,
        totalClientes,
        totalMotos,
        totalOrdensServico,
        totalProdutos,
        totalRelatorios,
        carregarTotais,
        clientes,
        motos,
        ordemsServico,
        produtos,
        carregarClientes,
        carregarMotos,
        carregarOrdensServico,
        carregarProdutos,
        cadastrarMoto,
        cadastrarCliente,
        deletarRegistro,
        editarRegistro,
        buscarRegistroPorId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }
  return context;
};
