// src/contexts/AppContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "./supabase"


type Usuario = {
  id: string
  email: string
  nome: string
  sobrenome: string
  tipo?: "admin" | "funcionario"
}

type Empresa = {
  id: string
  nome: string
  cnpj?: string
}

type Cliente = {
  id: string
  nome: string
  email: string
  telefone: string
  cpf?: string
  criado_em?: string
}
type Moto = {
  id: string
  cliente_id: string
  marca: string
  modelo: string
  ano: string
  placa: string
  cor: string
}

type AppContextType = {
  usuario: Usuario | null
  empresa: Empresa | null
  clientes?: Cliente[] // opcional, pode ser carregado em outra parte do app
  motos?: Moto[] // opcional, pode ser carregado em outra parte do app
  carregando: boolean
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  isLoggedIn: () => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [motos, setMotos] = useState<Moto[]>([])
  const [carregando, setCarregando] = useState(true)

  // 🔐 Login
  const logIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert(error.message)
    return
  }

  // ✅ Agora redireciona manualmente para o callback
  window.location.href = "/auth/callback"
}


  // 🚪 Logout
  const logOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/callback"
    // setUsuario(null)
    // setEmpresa(null)
    
  }

  const isLoggedIn = () => !!usuario

  // 🧠 Função para carregar dados do usuário e empresa
const carregarSessao = async () => {
  setCarregando(true)

  const { data: userData, error } = await supabase.auth.getUser()

  if (error || !userData.user) {
    setUsuario(null)
    setEmpresa(null)
    setCarregando(false)
    return
  }

  const user = userData.user
  const usuarioId = user.id
  setUsuario({ id: usuarioId, email: user.email ?? "" })

  // Agora buscamos os dados do sistema (tabela `usuarios`)
  const { data: usuarioSistema, error: erroUsuarioSistema } = await supabase
    .from("usuarios")
    .select("empresa_id, nome, sobrenome, tipo")
    .eq("id", usuarioId)
    .single()

  if (erroUsuarioSistema || !usuarioSistema) {
    console.error("Usuário não encontrado na tabela `usuarios`")
    setEmpresa(null)
    setCarregando(false)
    return
  }

  // Busca os dados da empresa
  const { data: empresaData, error: erroEmpresa } = await supabase
    .from("empresas")
    .select("id, nome, cnpj")
    .eq("id", usuarioSistema.empresa_id)
    .single()

  if (erroEmpresa || !empresaData) {
    console.error("Empresa não encontrada")
    setEmpresa(null)
    setCarregando(false)
    return
  }
  // Busca os dados dos clientes
  const { data: clienteData, error: erroCliente } = await supabase
    .from("clientes")
    .select("id, nome, email, telefone, cpf, criado_em")
    .eq("empresa_id", usuarioSistema.empresa_id)

  if (erroCliente || !clienteData) {
    console.error("Clientes não encontrados")
    setClientes([])
    setCarregando(false)
    return
  }
  // Busca os dados das motos associadas aos clientes
  // Primeiro, pega os IDs dos clientes retornados
  const clienteIds = clienteData.map((cliente: Cliente) => cliente.id)

  // Busca todas as motos cujos cliente_id estejam na lista de clientes
  const { data: motoData, error: erroMoto } = await supabase
    .from("motos")
    .select("id, cliente_id, marca, modelo, ano, placa, cor")
    .in("cliente_id", clienteIds)

  if (erroMoto) {
    console.error("Motos não encontradas")
    // Não retorna, pois clientes podem existir sem motos
  }

  // Atualiza o estado com os dados carregados
  setMotos(motoData || [])

  // Você pode expandir o estado `usuario` com mais dados também:
  setUsuario({
    id: usuarioId,
    email: user.email ?? "",
    nome: usuarioSistema.nome,
    sobrenome: usuarioSistema.sobrenome,
    tipo: usuarioSistema.tipo
  })

  setEmpresa({
    id: empresaData.id,
    nome: empresaData.nome,
    cnpj: empresaData.cnpj
  })

  setClientes(clienteData)

  setCarregando(false)
}


  // Carrega sessão ao iniciar
  useEffect(() => {
    carregarSessao()
  }, [])

  return (
    <AppContext.Provider value={{ isLoggedIn ,usuario, empresa, carregando, logIn, logOut, clientes, motos }}>
      {children}
    </AppContext.Provider>
  )
}

// 🔄 Hook de uso
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider")
  }
  return context
}
