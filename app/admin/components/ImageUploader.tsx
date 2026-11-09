"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { mediaUrl } from "../../lib/media";

type Item = { key: string; id?: string; preview: string; error?: string };

type Props = {
  name: string;
  initial?: string[];
  multiple?: boolean;
  /** Ex.: "/fundo.png" — mostrado quando não há imagem escolhida */
  fallback?: string;
};

const FULL = 2400; // lado maior da imagem grande
const THUMB = 800; // lado maior da miniatura

async function resize(file: File, max: number, quality: number) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // fundo branco para PNGs transparentes
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob>((ok, fail) =>
    canvas.toBlob((b) => (b ? ok(b) : fail(new Error("conversão falhou"))), "image/jpeg", quality)
  );
  return { blob, w, h };
}

async function upload(file: File): Promise<string> {
  let full, thumb;
  try {
    full = await resize(file, FULL, 0.86);
    thumb = await resize(file, THUMB, 0.8);
  } catch {
    throw new Error("Formato não suportado. Use JPG ou PNG.");
  }
  const body = new FormData();
  body.append("file", new File([full.blob], "imagem.jpg", { type: "image/jpeg" }));
  body.append("thumb", new File([thumb.blob], "mini.jpg", { type: "image/jpeg" }));
  body.append("width", String(full.w));
  body.append("height", String(full.h));
  body.append("filename", file.name);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) throw new Error(data.error ?? "Falhou o envio. Tente de novo.");
  return data.id as string;
}

/**
 * Escolher/arrastar fotografias. Cada uma é reduzida no próprio browser
 * (fotos de telemóvel chegam a 10 MB) e enviada logo. A ordem define a capa.
 */
export default function ImageUploader({ name, initial = [], multiple = false, fallback }: Props) {
  const [items, setItems] = useState<Item[]>(() =>
    initial.map((id) => ({ key: id, id, preview: mediaUrl(id, "thumb") }))
  );
  const [dragOver, setDragOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const uploading = items.some((i) => !i.id && !i.error);

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!list.length) return;
    const chosen = multiple ? list : list.slice(0, 1);
    const fresh: Item[] = chosen.map((f) => ({
      key: `${f.name}-${f.size}-${Math.random()}`,
      preview: URL.createObjectURL(f),
    }));
    setItems((prev) => (multiple ? [...prev, ...fresh] : fresh));

    await Promise.all(
      chosen.map(async (file, i) => {
        const key = fresh[i].key;
        try {
          const id = await upload(file);
          setItems((prev) => prev.map((it) => (it.key === key ? { ...it, id } : it)));
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Erro";
          setItems((prev) => prev.map((it) => (it.key === key ? { ...it, error: msg } : it)));
        }
      })
    );
  }

  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));
  const move = (index: number, d: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const j = index + d;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const showDrop = multiple || items.length === 0;

  return (
    <div>
      {items.filter((i) => i.id).map((i) => (
        <input key={i.key} type="hidden" name={name} value={i.id} />
      ))}
      {/* impede gravar enquanto há imagens a carregar */}
      {uploading && <span hidden data-uploading />}

      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <figure
            key={item.key}
            className={`relative w-36 rounded-lg overflow-hidden border bg-white ${
              item.error ? "border-red-300" : "border-paper-3"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.preview} alt="" className="w-full h-32 object-cover" />
            {!item.id && !item.error && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-ultra">
                <Loader2 className="animate-spin" size={26} />
              </div>
            )}
            {item.error && (
              <p className="absolute inset-x-0 top-0 bg-red-50/95 text-red-700 text-xs p-2">{item.error}</p>
            )}
            {multiple && index === 0 && item.id && (
              <span className="absolute top-1.5 left-1.5 bg-ultra text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                Capa
              </span>
            )}
            <figcaption className="flex items-center justify-between px-1.5 py-1 border-t border-paper-3">
              {multiple ? (
                <span className="flex">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                    className="p-1.5 text-ink-soft hover:text-ultra disabled:opacity-25" aria-label="Mover para a esquerda">
                    <ArrowLeft size={16} />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}
                    className="p-1.5 text-ink-soft hover:text-ultra disabled:opacity-25" aria-label="Mover para a direita">
                    <ArrowRight size={16} />
                  </button>
                </span>
              ) : (
                <span />
              )}
              <button type="button" onClick={() => remove(item.key)}
                className="p-1.5 text-ink-soft hover:text-red-600" aria-label="Remover imagem">
                <Trash2 size={16} />
              </button>
            </figcaption>
          </figure>
        ))}

        {!multiple && items.length === 0 && fallback && (
          <figure className="relative w-36 rounded-lg overflow-hidden border border-dashed border-paper-3 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fallback} alt="" className="w-full h-32 object-cover opacity-70" />
            <figcaption className="text-[11px] text-ink-mute px-2 py-1.5 border-t border-paper-3">
              Imagem atual (original)
            </figcaption>
          </figure>
        )}

        {showDrop && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`w-36 h-[10.6rem] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-sm text-center px-3 transition-colors ${
              dragOver ? "border-ultra bg-ultra/5 text-ultra" : "border-paper-3 text-ink-soft hover:border-ultra hover:text-ultra"
            }`}
          >
            <ImagePlus size={28} strokeWidth={1.5} />
            {multiple ? "Adicionar fotografias" : items.length ? "Trocar" : "Escolher fotografia"}
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {uploading && <p className="mt-2 text-sm text-ultra">A carregar imagens… aguarde antes de gravar.</p>}
    </div>
  );
}
