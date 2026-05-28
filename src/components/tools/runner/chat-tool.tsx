"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Send, Trash2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function streamChat(
  messages: Message[],
  toolId: string,
  onChunk: (t: string) => void,
): Promise<void> {
  const res = await fetch("/api/tools/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, toolId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Generation failed");
  }
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}

export function ChatTool({ toolId }: { toolId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      await streamChat(newMessages, toolId, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">ChatNova</p>
              <p className="text-slate-500 text-sm">Your highly capable AI assistant. Ask me anything.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600/30 border border-violet-500/30 text-white"
                    : "bg-[#0d0d1a] border border-border text-slate-200"
                }`}
              >
                {msg.content || (loading && i === messages.length - 1 ? (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                  </span>
                ) : "")}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border border-border rounded-2xl bg-[#0d0d1a] overflow-hidden">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatNova... (Enter to send, Shift+Enter for new line)"
          rows={3}
          className="w-full px-4 pt-3 pb-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear chat
            </button>
          )}
          <div className="ml-auto">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="sm"
              className="gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
