"use client";
import { useState } from "react";
import { createEndpoint } from "@/lib/api";
import toast from "react-hot-toast";

const SOURCES = ["stripe", "github", "shopify", "custom"];

export function CreateEndpointModal({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [source, setSource] = useState("stripe");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setLoading(true);
    try {
      await createEndpoint({ name, source, secret: secret || undefined });
      toast.success("Endpoint created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create endpoint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4 animate-fade-in">
        <h2 className="text-lg font-semibold text-text-primary">New Endpoint</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Stripe Webhook"
              className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}
              className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
              {SOURCES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Webhook Secret <span className="text-text-muted">(optional)</span></label>
            <input value={secret} onChange={(e) => setSecret(e.target.value)} type="password" placeholder="whsec_..."
              className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-elevated transition-colors">Cancel</button>
          <button onClick={handleCreate} disabled={loading} className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}