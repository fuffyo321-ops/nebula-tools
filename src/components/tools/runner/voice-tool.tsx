"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mic, Play, Pause, Download } from "lucide-react";

const VOICES = [
  { value: "nova",    label: "Nova — Female, warm & natural" },
  { value: "alloy",  label: "Alloy — Neutral, clear" },
  { value: "echo",   label: "Echo — Male, precise" },
  { value: "fable",  label: "Fable — Male, British" },
  { value: "onyx",   label: "Onyx — Male, deep & authoritative" },
  { value: "shimmer", label: "Shimmer — Female, soft" },
];

export function VoiceTool({ toolId }: { toolId: string }) {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<"alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer">("nova");
  const [speed, setSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) { toast.error("Please enter some text"); return; }
    if (text.length > 4000) { toast.error("Text must be under 4000 characters"); return; }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setPlaying(false);
    setLoading(true);

    try {
      const res = await fetch("/api/tools/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed, toolId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error ?? "Generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function handlePlayPause() {
    if (!audioRef.current || !audioUrl) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `vox-synth-${Date.now()}.mp3`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm">
        Convert any text to natural-sounding speech. Choose from 6 AI voices and adjust playback speed.
      </p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Text to Convert</Label>
            <span className={`text-xs ${text.length > 3800 ? "text-red-400" : "text-slate-500"}`}>
              {text.length} / 4000
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            rows={6}
            maxLength={4000}
            className="w-full rounded-xl border border-border bg-[#111127] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Voice</Label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value as typeof voice)}
              className="w-full h-10 rounded-xl border border-border bg-[#111127] px-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
            >
              {VOICES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Speed</Label>
              <span className="text-xs text-slate-400">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="4.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-2 appearance-none rounded-full bg-[#111127] border border-border cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>0.25x</span>
              <span>1x Normal</span>
              <span>4x</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full font-orbitron tracking-wider shadow-lg shadow-violet-500/25 gap-2" disabled={loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating speech...</>
            : <><Mic className="w-4 h-4" /> Generate Speech</>}
        </Button>
      </form>

      {audioUrl && (
        <div className="rounded-2xl border border-border bg-[#0d0d1a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs text-slate-500 font-medium">AUDIO OUTPUT</span>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download MP3
            </button>
          </div>
          <div className="p-5">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors flex items-center justify-center flex-shrink-0"
              >
                {playing
                  ? <Pause className="w-5 h-5 text-white" />
                  : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <div className="flex-1">
                <p className="text-sm text-white font-medium mb-1">
                  {VOICES.find((v) => v.value === voice)?.label.split("—")[0].trim()} Voice
                </p>
                <p className="text-xs text-slate-500">{speed.toFixed(2)}x speed · MP3 audio</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
