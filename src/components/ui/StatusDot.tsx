export function StatusDot({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${connected ? "bg-teal animate-pulse shadow-[0_0_6px_#00D4AA]" : "bg-text-muted"}`} />
      <span className="text-xs font-mono text-text-secondary">
        {connected ? "LIVE" : "RECONNECTING..."}
      </span>
    </div>
  );
}