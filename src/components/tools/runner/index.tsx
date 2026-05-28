"use client";

import { TextTool } from "./text-tool";
import { ChatTool } from "./chat-tool";
import { ImageTool } from "./image-tool";
import { VoiceTool } from "./voice-tool";

const TEXT_SLUGS = new Set([
  "nebula-writer",
  "script-craft",
  "flow-mind",
  "rank-pulse",
  "brand-spark",
  "research-bot",
  "data-pulse",
  "code-orbit",
]);

const IMAGE_SLUGS = new Set(["astra-art", "pixel-forge"]);

export function ToolRunner({ slug, toolId }: { slug: string; toolId: string }) {
  if (TEXT_SLUGS.has(slug)) {
    return <TextTool slug={slug} toolId={toolId} />;
  }
  if (IMAGE_SLUGS.has(slug)) {
    return <ImageTool slug={slug} toolId={toolId} />;
  }
  if (slug === "chat-nova") {
    return <ChatTool toolId={toolId} />;
  }
  if (slug === "vox-synth") {
    return <VoiceTool toolId={toolId} />;
  }
  return (
    <div className="text-center py-8 text-slate-500 text-sm">
      This tool is not yet available in the browser.
    </div>
  );
}
