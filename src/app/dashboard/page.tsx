"use client"

import { supabase } from "@/context/supabase";

export default function Dashboard() {
    const logOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao sair:", error.message);
        } else {
            window.location.href = "/login"; // Redireciona para a página inicial após logout
        }
    };
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
                <h2>Bem-vindo!</h2>
                <p>Este é um dashboard simples para teste.</p>
                <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                    <div style={{ background: "#1a1a1a", padding: "1rem", borderRadius: "8px" }}>
                        <h3>Usuários</h3>
                        <p>10</p>
                    </div>
                    <div style={{ background: "#1a1a1a", padding: "1rem", borderRadius: "8px" }}>
                        <h3>Pedidos</h3>
                        <p>5</p>
                    </div>
                    <div style={{ background: "#1a1a1a", padding: "1rem", borderRadius: "8px" }}>
                        <h3>Status</h3>
                        <p>Ativo</p>
                    </div>
                </div>
            </section>
        </div>
    );
}