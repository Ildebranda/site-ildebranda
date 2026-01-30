"use client";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Título Estilizado (Como na imagem) */}
        <img
          src="/contact.png"
          alt="Luana Góes Collage"
          className="w-full h-full object-contain drop-shadow-xl"
        />

        {/* Texto Informativo */}
        <div className="space-y-4 text-sm md:text-base text-zinc-600 font-light leading-relaxed">
          <p className="opacity-70 italic">
            Para encomendas, colaborações e oportunidades, você pode me enviar
            uma mensagem em <br />
            luanagoesmontes@gmail.com ou me encontrar nas redes sociais abaixo
          </p>
        </div>

        {/* Formulário Minimalista para Netlify */}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          className="grid grid-cols-1 gap-6 text-left mt-12"
        >
          {/* Campo oculto necessário para o Netlify no Next.js */}
          <input type="hidden" name="form-name" value="contact" />

          <div className="group border-b border-zinc-200 py-2 focus-within:border-blue-600 transition">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400">
              Nome
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-transparent outline-none py-1 text-zinc-800 placeholder-zinc-300"
              placeholder="Nome"
            />
          </div>

          <div className="group border-b border-zinc-200 py-2 focus-within:border-blue-600 transition">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-transparent outline-none py-1 text-zinc-800 placeholder-zinc-300"
              placeholder="email@email.com"
            />
          </div>

          <div className="group border-b border-zinc-200 py-2 focus-within:border-blue-600 transition">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400">
              Mensagem
            </label>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full bg-transparent outline-none py-1 text-zinc-800 placeholder-zinc-300 resize-none"
              placeholder="Mensagem..."
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-8 py-3 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all self-start"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}
