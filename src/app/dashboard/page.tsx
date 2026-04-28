"use client";
import { useState, useEffect, useCallback } from "react";
import { Endpoint, WebhookEvent, WsMessage } from "@/types";
import { getEndpoints, getEvents, deleteEndpoint } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Header } from "@/components/layout/Header";
import { EventRow } from "@/components/events/EventRow";
import { EventDetail } from "@/components/events/EventDetail";
import { CreateEndpointModal } from "@/components/endpoints/CreateEndpointModal";
import { Plus, Trash2, Copy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const handleWsMessage = useCallback((msg: WsMessage) => {
    if (msg.type === "new_event") {
      const ev = msg.event;
      setEvents((prev) => [ev, ...prev]);
      setNewEventIds((prev) => new Set([...prev, ev.id]));
      setTimeout(() => setNewEventIds((prev) => { const n = new Set(prev); n.delete(ev.id); return n; }), 3000);
      toast.success("New webhook received", { duration: 2000 });
    }
  }, []);

  const { connected } = useWebSocket(handleWsMessage);

  const fetchEndpoints = useCallback(async () => {
    const data = await getEndpoints();
    setEndpoints(data);
    if (data.length > 0) setActiveEndpoint((prev) => prev ?? data[0]);
  }, []);

  useEffect(() => { fetchEndpoints(); }, [fetchEndpoints]);

  useEffect(() => {
    if (!activeEndpoint) return;
    setEvents([]);
    setSelectedEvent(null);
    getEvents(activeEndpoint.id).then(setEvents);
  }, [activeEndpoint]);

  const handleDelete = async (ep: Endpoint) => {
    await deleteEndpoint(ep.id);
    toast.success("Endpoint deleted");
    fetchEndpoints();
    if (activeEndpoint?.id === ep.id) setActiveEndpoint(null);
  };

  const copyEndpointUrl = (ep: Endpoint) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/endpoints/${ep.id}/receive`;
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      <Header connected={connected} />
      <Toaster position="top-right" toastOptions={{ style: { background: "#16161F", color: "#F0F0FF", border: "1px solid #2A2A3F" } }} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-bg-2 flex-shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Endpoints</span>
            <button onClick={() => setShowModal(true)} className="p-1.5 rounded hover:bg-elevated text-text-secondary hover:text-accent transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {endpoints.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-text-muted">No endpoints yet.</p>
                <button onClick={() => setShowModal(true)} className="mt-2 text-xs text-accent hover:underline">Create one</button>
              </div>
            ) : endpoints.map((ep) => (
              <div key={ep.id} onClick={() => setActiveEndpoint(ep)}
                className={`p-3 cursor-pointer border-b border-border transition-colors group ${activeEndpoint?.id === ep.id ? "bg-accent/10 border-l-2 border-l-accent" : "hover:bg-elevated"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary font-medium truncate">{ep.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); copyEndpointUrl(ep); }} className="p-1 rounded hover:bg-elevated text-text-muted hover:text-teal"><Copy size={11} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(ep); }} className="p-1 rounded hover:bg-elevated text-text-muted hover:text-red-400"><Trash2 size={11} /></button>
                  </div>
                </div>
                <span className="text-xs text-text-muted font-mono capitalize">{ep.source}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Event Feed */}
        <div className="w-80 border-r border-border flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Events</span>
            <span className="text-xs font-mono text-text-muted">{events.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!activeEndpoint ? (
              <div className="p-6 text-center text-xs text-text-muted">Select an endpoint to see events</div>
            ) : events.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-xs text-text-muted">Waiting for webhooks...</p>
                <p className="text-xs text-text-muted font-mono">POST to: <span className="text-accent">/endpoints/{activeEndpoint.id.slice(0, 8)}...</span></p>
              </div>
            ) : events.map((ev) => (
              <EventRow key={ev.id} event={ev} selected={selectedEvent?.id === ev.id}
                onClick={() => setSelectedEvent(ev)} isNew={newEventIds.has(ev.id)} />
            ))}
          </div>
        </div>

        {/* Event Detail */}
        <div className="flex-1 overflow-hidden">
          {selectedEvent ? <EventDetail event={selectedEvent} /> : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl opacity-20">⬡</div>
                <p className="text-text-muted text-sm">Select an event to inspect</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && <CreateEndpointModal onCreated={fetchEndpoints} onClose={() => setShowModal(false)} />}
    </div>
  );
}