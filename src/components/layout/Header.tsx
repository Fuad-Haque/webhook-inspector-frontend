import { StatusDot } from "@/components/ui/StatusDot";

export function Header({ connected }: { connected: boolean }) {
  return (
    <header className="h-14 border-b border-border bg-bg-2 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-accent text-xl">⬡</span>
        <span className="font-semibold text-text-primary tracking-tight">Webhook Inspector</span>
      </div>
      <StatusDot connected={connected} />
    </header>
  );
}