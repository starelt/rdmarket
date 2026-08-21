"use client"

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (res?.error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f2f2f2]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#111] mb-2">Bienvenido a RDMarket</h1>
          <p className="text-gray-500">Inicia sesión para comprar y vender</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-bold">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff4747] focus:ring-1 focus:ring-[#ff4747] transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-bold">Contraseña</label>
            <input 
              name="password"
              type="password"
              required 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff4747] focus:ring-1 focus:ring-[#ff4747] transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#ff4747] hover:bg-[#e62e2e] disabled:opacity-50 text-white font-bold rounded-xl shadow-md transform transition hover:-translate-y-1"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">O continúa con</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <button 
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="text-center text-gray-500 mt-8 text-sm">
          ¿No tienes una cuenta? <Link href="/register" className="text-[#ff4747] hover:text-[#e62e2e] font-bold">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
}
