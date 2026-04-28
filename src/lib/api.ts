import axios from "axios";
import { Endpoint, WebhookEvent, ReplayLog } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getEndpoints = () =>
  api.get<Endpoint[]>("/endpoints").then((r) => r.data);

export const createEndpoint = (data: { name: string; source: string; secret?: string }) =>
  api.post<Endpoint>("/endpoints", data).then((r) => r.data);

export const deleteEndpoint = (id: string) =>
  api.delete(`/endpoints/${id}`).then((r) => r.data);

export const getEvents = (endpointId: string) =>
  api.get<WebhookEvent[]>(`/endpoints/${endpointId}/events`).then((r) => r.data);

export const replayEvent = (eventId: string, targetUrl: string) =>
  api.post<ReplayLog>(`/events/${eventId}/replay`, { target_url: targetUrl }).then((r) => r.data);

export const getReplayLogs = (eventId: string) =>
  api.get<ReplayLog[]>(`/events/${eventId}/replays`).then((r) => r.data);