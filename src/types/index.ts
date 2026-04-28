export interface Endpoint {
  id: string;
  name: string;
  source: "stripe" | "github" | "shopify" | "custom";
  secret?: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  endpoint_id: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  raw_body: string;
  source_ip: string;
  signature_status: "valid" | "invalid" | "unverified";
  received_at: string;
}

export interface ReplayLog {
  id: string;
  event_id: string;
  target_url: string;
  status_code: number;
  response_time_ms: number;
  success: boolean;
  replayed_at: string;
}

export type WsMessage =
  | { type: "new_event"; event: WebhookEvent }
  | { type: "ping" };