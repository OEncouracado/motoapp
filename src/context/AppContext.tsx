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

type MarcaFipe = {
  id: string;
  brand: string;
};

type ModeloFipe = {
  id: string;
  model: string;
  years: string;
};

type AppContextType = {
  usuario: Usuario | null;
  empresa: Empresa | null;
  clientes?: Cliente[];
  motos?: Moto[];
  ordemsServico?: OrdemServico[];
  carregando: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  isLoggedIn: () => boolean;
  carregarSessao: () => Promise<void>;
  themeMode: "light" | "dark";
  toggleTheme: () => void;
  marcas?: MarcaFipe[];
  modelos?: ModeloFipe[];
  carregarMarcas: () => Promise<void>;
  carregarModelosPorMarca: (marcaId: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

const tokenIVTXT = process.env.NEXT_PUBLIC_INVERTEXTO_TOKEN;

export const AppProvider = ({ children }: AppProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [ordemsServico, setOrdemsServico] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [marcas, setMarcas] = useState<MarcaFipe[]>([]);
  const [modelos, setModelos] = useState<ModeloFipe[]>([]);

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("themeMode", newTheme);
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

  useEffect(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved === "light" || saved === "dark") {
      setThemeMode(saved);
    }
  }, []);

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

      const { data: clienteData } = await supabase
        .from("clientes")
        .select("id, nome, email, telefone, cpf, criado_em, endereco")
        .eq("empresa_id", usuarioSistema.empresa_id);

      const clienteIds = clienteData?.map((c) => c.id) || [];

      const { data: motoData } = await supabase
        .from("motos")
        .select("id, cliente_id, marca, modelo, ano, placa, cor, chassi")
        .in("cliente_id", clienteIds);

      const { data: osData } = await supabase
        .from("ordens_servico")
        .select(
          "id, numero, empresa_id, cliente_id, moto_id, status, data_abertura, data_entrega_previsao, data_conclusao, observacoes, total, criado_em"
        )
        .eq("empresa_id", usuarioSistema.empresa_id);

      setUsuario({
        id: usuarioId,
        email: userData.user.email ?? "",
        nome: usuarioSistema.nome,
        sobrenome: usuarioSistema.sobrenome,
        tipo: usuarioSistema.tipo,
      });

      setEmpresa(empresaData);
      setClientes(clienteData ?? []);
      setMotos(motoData ?? []);
      setOrdemsServico(osData ?? []);
    } catch (err) {
      console.error("Erro ao carregar sessão:", err);
      setUsuario(null);
      setEmpresa(null);
      setClientes([]);
      setMotos([]);
      setOrdemsServico([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarSessao();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        usuario,
        empresa,
        clientes,
        motos,
        ordemsServico,
        carregando,
        logIn,
        logOut,
        carregarSessao,
        themeMode,
        toggleTheme,
        marcas,
        modelos,
        carregarMarcas,
        carregarModelosPorMarca,
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
