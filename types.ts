
export interface Metric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface ChartData {
  name: string;
  leads: number;
  qualified: number;
  sales: number;
}

export interface User {
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  lastActive: string;
  leadsGenerated: number;
  salesClosed: number;
  goalProgress: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface RevenueEntry {
  id: string;
  date: string;
  businessName: string;
  setupValue: number;
  mrrValue: number;
  origin: string;
  product: string;
}

export interface LandingPage {
  id: string;
  name: string;
  path: string; // GA4 path style
  views: number;
  users: number;
  conversions: number;
  conversionRate: number;
  avgEngagementTime: string;
  source: 'google_analytics';
}

export interface DailyLeadEntry {
  id: string;
  date: string; // ISO YYYY-MM-DD
  mql: number;
  sql: number;
  sales: number;
  conversionRate: number; // Calculated (Sales / MQL) * 100 or specific logic
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  LEAD_TRACKER = 'LEAD_TRACKER',
  REVENUE = 'REVENUE',
  LPS = 'LPS',
  SETTINGS = 'SETTINGS'
}
