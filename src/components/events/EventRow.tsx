import { WebhookEvent } from "@/types";
import { formatDistanceToNow } from "date-fns";

const SIG_COLORS = {
  valid: "text-teal bg-teal/10 border-teal/20",
  invalid: "text-red-400 bg-red-400/10 border-red-400/20",
  unverified: "text-text-muted bg-text-muted/10 border-text-muted/20",
};

const METHOD_COLORS: Record<string, string> = {
  POST: "text-accent", GET: "text-teal", PUT: "text-yellow-400",
  PATCH: "text-orange-400", DELETE: "text-red-400",
};

export function EventRow({ event, selected, onClick, isNew }: {
  event: WebhookEvent; selected: boolean; onClick: () => void; isNew: boolean;
}) {
  return (
    <div onClick={onClick}
      className={`px-4 py-3 cursor-pointer border-b border-border transition-colors animate-slide-in ${selected ? "bg-accent/10 border-l-2 border-l-accent" : "hover:bg-elevated"} ${isNew ? "ring-1 ring-inset ring-teal/30" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs font-mono font-semibold ${METHOD_COLORS[event.method] ?? "text-text-secondary"}`}>{event.method}</span>
          <span className="text-sm text-text-primary truncate font-mono">{event.id.slice(0, 8)}...</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${SIG_COLORS[event.signature_status]}`}>{event.signature_status}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-text-muted">{event.source_ip}</span>
        <span className="text-xs text-text-muted">{formatDistanceToNow(new Date(event.received_at), { addSuffix: true })}</span>
      </div>
    </div>
  );
}