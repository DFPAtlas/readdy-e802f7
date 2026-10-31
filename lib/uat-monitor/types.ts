import type { MonitoringSettings, UatMonitoringEventType } from '@/lib/uat-monitoring-definitions';

export interface UATMonitorConfig {
  endpoint: string;
  token: string;
  allowedOrigin: string;
  settings: MonitoringSettings;
  assignmentId?: string;
  assignmentTestCaseId?: string;
  onTokenExpired?: () => void;
  onDisconnected?: () => void;
  onStatusChange?: (status: MonitorConnectionStatus) => void;
}

export type MonitorConnectionStatus =
  | 'not_enabled'
  | 'connecting'
  | 'active'
  | 'paused'
  | 'degraded'
  | 'disconnected'
  | 'expired';

export interface UATMonitor {
  start(): void;
  stop(): void;
  pause(): void;
  resume(token: string): void;
  checkpoint(label: string, metadata?: Record<string, unknown>): void;
  getStatus(): MonitorStatus;
  getCounts(): EventCounts;
}

export interface MonitorStatus {
  status: MonitorConnectionStatus;
  lastEventAt: string | null;
  queuedEvents: number;
  currentPage: string | null;
}

export interface EventCounts {
  errorCount: number;
  failedRequestCount: number;
  slowRequestCount: number;
  checkpointCount: number;
  pageViewCount: number;
}

export interface MonitorEvent {
  event_type: UatMonitoringEventType;
  event_timestamp?: string;
  page_url?: string | null;
  page_path?: string | null;
  page_title?: string;
  event_name?: string;
  severity?: string;
  message?: string | null;
  source_file?: string | null;
  source_line?: number | null;
  source_column?: number | null;
  request_method?: string;
  request_path?: string;
  response_status?: number | null;
  duration_ms?: number;
  performance_data?: Record<string, unknown>;
  safe_metadata?: Record<string, unknown>;
  assignment_test_case_id?: string;
}

export interface TransportResult {
  success: boolean;
  accepted: number;
  rejected: number;
  retryable: boolean;
}
