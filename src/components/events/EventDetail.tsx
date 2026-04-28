"use client";
import { useState } from "react";
import { WebhookEvent, ReplayLog } from "@/types";
import { replayEvent } from "@/lib/api";
import { Copy, RotateCcw, Check } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

type Tab = "body" | "headers" | "replay";

export function EventDetail({ event }: { event: WebhookEvent }) {
  const [tab, setTab] = useState<Tab>("body");
  const [targetUrl, setTargetUrl] = useState("");
  const [replayLogs, setReplayLogs] = useState<ReplayLog[]>([]);
  const [replaying, setReplaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReplay = async () => {
    if (!targetUrl) return toast.error("Enter a target URL");
    setReplaying(true);
    try {
      const log = await replayEvent(event.id, targetUrl);
      setReplayLogs((prev) => [log, ...prev]);
      toast.success(`Replayed → ${log.status_code}`);
    } catch {
      toast.error("Replay failed");
    } finally {
      setReplaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-text-secondary">EVENT ID</p>
            <p className="font-mono text-sm text-text-primary">{event.id}</p>
          </div>
          <button onClick={() => handleCopy(event.id)} className="p-1.5 rounded hover:bg-elevated transition-colors text-text-secondary hover:text-text-primary">
            {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
          <span>{format(new Date(event.received_at), "MMM d, yyyy HH:mm:ss")}</span>
          <span>from {event.source_ip}</span>
        </div>
      </div>

      <div className="flex border-b border-border flex-shrink-0">
        {(["body", "headers", "replay"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors ${tab === t ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === "body" && (
          <pre className="font-mono text-xs text-text-secondary whitespace-pre-wrap break-all">
            {event.body ? JSON.stringify(event.body, null, 2) : event.raw_body || "No body"}
          </pre>
        )}

        {tab === "headers" && (
          <div className="space-y-1">
            {Object.entries(event.headers).map(([k, v]) => (
              <div key={k} className="flex gap-3 text-xs py-1 border-b border-border/50">
                <span className="font-mono text-accent min-w-[180px] flex-shrink-0">{k}</span>
                <span className="font-mono text-text-secondary break-all">{v}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "replay" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Target URL</label>
              <div className="flex gap-2">
                <input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="flex-1 bg-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent" />
                <button onClick={handleReplay} disabled={replaying}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
                  <RotateCcw size={14} className={replaying ? "animate-spin" : ""} />
                  Replay
                </button>
              </div>
            </div>
            {replayLogs.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-2">Delivery Log</p>
                <div className="space-y-2">
                  {replayLogs.map((log) => (
                    <div key={log.id} className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono ${log.success ? "border-teal/20 bg-teal/5" : "border-red-400/20 bg-red-400/5"}`}>
                      <span className={log.success ? "text-teal" : "text-red-400"}>{log.success ? "✓" : "✗"} {log.status_code || "ERR"}</span>
                      <span className="text-text-muted truncate mx-3">{log.target_url}</span>
                      <span className="text-text-secondary">{log.response_time_ms}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}