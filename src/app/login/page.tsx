"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/context/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-100">
      <div className="p-6 rounded shadow-md w-full max-w-sm rounded" style={{ backgroundColor: "#1a1a1a"}}>
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded">
          Entrar
        </button>
      </div>
    </div>
  )
}
