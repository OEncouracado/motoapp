"use client"

import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { supabase } from "@/context/supabase"

export default function CadastrarClientesForm() {
  const { empresa } = useApp()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!empresa) {
      alert("Nenhuma empresa selecionada")
      return
    }

    const { error } = await supabase
      .from("clientes")
      .insert([{ nome, email, telefone, empresa_id: empresa.id }])

    if (error) {
      alert("Erro ao cadastrar cliente: " + error.message)
    } else {
      alert("Cliente cadastrado com sucesso!")
      setNome("")
      setEmail("")
      setTelefone("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="tel"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Cadastrar Cliente
      </button>
    </form>
  )
}