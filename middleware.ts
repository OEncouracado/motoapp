// middleware.ts

import { supabase } from "@/context/supabase";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"


export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  console.log('supabase :>> ', supabase);
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  console.log("🧠 Sessão no middleware:", session)


  const isAuth = !!session
  const isLoginPage = req.nextUrl.pathname === '/login'

  if (!isAuth && !isLoginPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  console.log("🔒 Middleware executado:", req.nextUrl.pathname)

  if (isAuth && isLoginPage) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/home' // ou outra rota padrão
    return NextResponse.redirect(redirectUrl)
  }

  return res
}
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|auth/callback).*)"], // protege todas as rotas, exceto públicas
}


