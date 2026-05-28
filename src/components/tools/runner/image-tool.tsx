"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Sparkles, Download, ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

const STYLES = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "sketch", label: "Sketch" },
  { value: "3d-render", label: "3D Render" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "fantasy", label: "Fantasy Art" },
];

const SIZES = [
  { value: "1024x1024", label: "Square (1024×1024)" },
  { value: "1792x1024", label: "Landscape (1792×1024)" },
  { value: "1024x1792", label: "Portrait (1024×1792)" },
];

const PIXEL_CONFIGS: Record<string, { description: string }> = {
  "pixel-forge": { description: "AI photo editing and enhancement — describe what you want to create or transform." },
  "astra-art":   { description: "Text-to-image generation — describe your vision in detail for best results." },
};

export function ImageTool({ slug, toolId }: { slug: string; toolId: string }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [size, setSize] = useState<"1024x1024" | "1792x1024" | "1024x1792">("1024x1024");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const config = PIXEL_CONFIGS[slug] ?? PIXEL_CONFIGS["astra-art"];

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }

    setLoading(true);
    setImageUrl(null);
    try {
      const res = await fetch("/api/tools/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, size, toolId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error ?? "Generation failed");
      }
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm">{config.description}</p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Prompt</Label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate in detail... e.g. 'A futuristic cityscape at sunset with flying cars and neon lights'"
            rows={4}
            className="w-full rounded-xl border border-border bg-[#111127] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Art Style</Label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full h-10 rounded-xl border border-border bg-[#111127] px-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
            >
              {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Size</Label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as typeof size)}
              className="w-full h-10 rounded-xl border border-border bg-[#111127] px-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
            >
              {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full font-orbitron tracking-wider shadow-lg shadow-violet-500/25 gap-2" disabled={loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating image...</>
            : <><Sparkles className="w-4 h-4" /> Generate Image</>}
        </Button>
      </form>

      {(loading || imageUrl) && (
        <div className="rounded-2xl border border-border bg-[#0d0d1a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs text-slate-500 font-medium">OUTPUT</span>
            {imageUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            )}
          </div>
          <div className="p-5 flex items-center justify-center min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-violet-400/50" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating your image with DALL-E 3...
                </div>
                <p className="text-xs text-slate-600">This usually takes 10-20 seconds</p>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated image"
                className="max-w-full rounded-xl border border-border"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
