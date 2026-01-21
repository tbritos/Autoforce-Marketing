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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  leadsGenerated: number;
  salesClosed: number;
  conversionRate: number;
  lastActive: string;
  status: 'online' | 'offline' | 'busy';
  goalProgress: number; // 0-100
}

export interface LandingPage {
  id: string;
  name: string;
  url: string;
  visitors: number;
  leads: number;
  conversionRate: number;
  bounceRate: number;
  status: 'active' | 'paused' | 'draft';
  campaign: string;
  lastUpdated: string;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  TEAM = 'TEAM',
  LPS = 'LPS',
  SETTINGS = 'SETTINGS'
}
