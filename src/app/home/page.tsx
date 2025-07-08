"use client"

import { useApp } from "@/context/AppContext";

export default function Dashboard() {
    const {logOut , carregando, usuario, empresa} =useApp();
    console.log('empresa :>> ', empresa);
    if (carregando)  return <div>Carregando dados...</div>

    return (
        <div style={{ padding: "2rem" }}>
            <button
                type="button"
                className="btn btn-outline-light"
                style={{ color: "white" }}
                onClick={logOut}
            >
                X
            </button>
            <h1>Dashboard</h1>
            <section>
                <h2>Bem-vindo!, {usuario?.nome} {usuario?.sobrenome}</h2>
                <p>Empresa: {empresa?.nome} - CNPJ: {empresa?.cnpj}</p>
                <p>Este é um dashboard simples para teste.</p>
                
                
                
            </section>
        </div>
    );
}