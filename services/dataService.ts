
import { Metric, ChartData, LandingPage, DailyLeadEntry, RevenueEntry, OKR } from '../types';

// Simulando delay de rede para parecer real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para LocalStorage
const STORAGE_LEADS_KEY = 'autoforce_lead_history';
const STORAGE_REVENUE_KEY = 'autoforce_revenue_history';
const STORAGE_OKRS_KEY = 'autoforce_okrs_history';

export const DataService = {
  getDashboardMetrics: async (): Promise<Metric[]> => {
    await delay(800); // Fake loading
    return [
      { id: '1', label: 'Total de Leads', value: 3850, target: 4000, unit: '', change: 12.5, trend: 'up', description: 'Leads gerados em todas as fontes' },
      { id: '2', label: 'Taxa de Qualificação', value: 42, target: 45, unit: '%', change: -2.3, trend: 'down', description: 'Leads que viraram oportunidades' },
      { id: '3', label: 'MRR Novo (Mês)', value: 12500, target: 15000, unit: 'R$', change: 8.5, trend: 'up', description: 'Receita recorrente adicionada' },
      { id: '4', label: 'Vendas Realizadas', value: 142, target: 120, unit: '', change: 15.8, trend: 'up', description: 'Negócios fechados no período' },
    ];
  },

  getPerformanceHistory: async (): Promise<ChartData[]> => {
    await delay(600);
    return [
      { name: 'Jan', leads: 2400, qualified: 1400, sales: 240 },
      { name: 'Fev', leads: 2800, qualified: 1600, sales: 260 },
      { name: 'Mar', leads: 3200, qualified: 1900, sales: 310 },
      { name: 'Abr', leads: 3908, qualified: 2100, sales: 380 },
      { name: 'Mai', leads: 4800, qualified: 2500, sales: 430 },
      { name: 'Jun', leads: 3800, qualified: 1800, sales: 300 },
      { name: 'Jul', leads: 4100, qualified: 2200, sales: 350 },
    ];
  },

  // Simulating Google Analytics Data API response
  getLandingPagesGA: async (): Promise<LandingPage[]> => {
    await delay(1200);
    return [
      { id: '1', name: 'Oferta SUV 2025', path: '/oferta-suv-2025', views: 15420, users: 12050, conversions: 850, conversionRate: 7.05, avgEngagementTime: '1m 32s', source: 'google_analytics' },
      { id: '2', name: 'Feirão Seminovos', path: '/lp/feirao-seminovos', views: 10200, users: 8400, conversions: 520, conversionRate: 6.19, avgEngagementTime: '0m 58s', source: 'google_analytics' },
      { id: '3', name: 'Agendamento Revisão', path: '/servicos/agendamento', views: 4500, users: 3200, conversions: 480, conversionRate: 15.00, avgEngagementTime: '2m 15s', source: 'google_analytics' },
      { id: '4', name: 'Consórcio Nacional', path: '/lp-consorcio', views: 6800, users: 5100, conversions: 150, conversionRate: 2.94, avgEngagementTime: '0m 45s', source: 'google_analytics' },
      { id: '5', name: 'Pré-venda Elétrico', path: '/lancamento/eletrico', views: 22000, users: 15000, conversions: 2200, conversionRate: 14.6, avgEngagementTime: '3m 10s', source: 'google_analytics' },
    ];
  },

  // --- Lead Tracker Methods ---

  getDailyLeadsHistory: async (): Promise<DailyLeadEntry[]> => {
    const stored = localStorage.getItem(STORAGE_LEADS_KEY);
    if (stored) {
      return JSON.parse(stored).sort((a: DailyLeadEntry, b: DailyLeadEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    const mockData: DailyLeadEntry[] = [
      { id: '1', date: '2025-01-20', mql: 12, sql: 10, sales: 3, conversionRate: 25.0 },
      { id: '2', date: '2025-01-19', mql: 11, sql: 10, sales: 2, conversionRate: 18.1 },
    ];
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(mockData));
    return mockData;
  },

  saveDailyLeadEntry: async (entry: Omit<DailyLeadEntry, 'id'>): Promise<DailyLeadEntry> => {
    await delay(500);
    const stored = localStorage.getItem(STORAGE_LEADS_KEY);
    let history: DailyLeadEntry[] = stored ? JSON.parse(stored) : [];

    history = history.filter(h => h.date !== entry.date);

    const newEntry: DailyLeadEntry = {
      ...entry,
      id: Date.now().toString(),
    };

    history.push(newEntry);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(history));
    return newEntry;
  },

  // --- Revenue Tracker Methods ---

  getRevenueHistory: async (): Promise<RevenueEntry[]> => {
    const stored = localStorage.getItem(STORAGE_REVENUE_KEY);
    if (stored) {
      return JSON.parse(stored).sort((a: RevenueEntry, b: RevenueEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const mockRevenue: RevenueEntry[] = [
        { id: '1', date: '2025-01-20', businessName: 'Grupo Sinal', setupValue: 5000, mrrValue: 1200, origin: 'Google Ads', product: 'Autoforce Site' },
        { id: '2', date: '2025-01-18', businessName: 'Concessionária Elite', setupValue: 3500, mrrValue: 800, origin: 'Indicação', product: 'Autoforce MKT' },
    ];
    localStorage.setItem(STORAGE_REVENUE_KEY, JSON.stringify(mockRevenue));
    return mockRevenue;
  },

  saveRevenueEntry: async (entry: Omit<RevenueEntry, 'id' | 'date'>): Promise<RevenueEntry> => {
    await delay(600);
    const stored = localStorage.getItem(STORAGE_REVENUE_KEY);
    let history: RevenueEntry[] = stored ? JSON.parse(stored) : [];

    const newEntry: RevenueEntry = {
        ...entry,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
    };

    history.push(newEntry);
    localStorage.setItem(STORAGE_REVENUE_KEY, JSON.stringify(history));
    return newEntry;
  },

  // --- OKR Methods ---

  getOKRs: async (): Promise<OKR[]> => {
    const stored = localStorage.getItem(STORAGE_OKRS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Mock inicial
    const mockOKRs: OKR[] = [
        {
            id: '1',
            quarter: 'Q1 2026',
            objective: 'Aumentar a penetração de mercado em Concessionárias Honda',
            progress: 45,
            keyResults: [
                { id: 'kr1', title: 'Fechar 10 novos contratos com grupos Honda', currentValue: 4, targetValue: 10, unit: '#' },
                { id: 'kr2', title: 'Aumentar leads qualificados desse segmento em 20%', currentValue: 8, targetValue: 20, unit: '%' }
            ]
        },
        {
            id: '2',
            quarter: 'Q2 2026',
            objective: 'Lançar nova feature de IA Generativa',
            progress: 0,
            keyResults: [
                { id: 'kr3', title: 'Finalizar desenvolvimento do Beta', currentValue: 0, targetValue: 100, unit: '%' },
                { id: 'kr4', title: 'Conseguir 50 usuários beta testando', currentValue: 0, targetValue: 50, unit: '#' }
            ]
        }
    ];
    localStorage.setItem(STORAGE_OKRS_KEY, JSON.stringify(mockOKRs));
    return mockOKRs;
  },

  saveOKR: async (okr: OKR): Promise<OKR> => {
      await delay(500);
      const stored = localStorage.getItem(STORAGE_OKRS_KEY);
      let list: OKR[] = stored ? JSON.parse(stored) : [];
      
      // Update if exists, else add
      const idx = list.findIndex(o => o.id === okr.id);
      if (idx >= 0) {
          list[idx] = okr;
      } else {
          list.push(okr);
      }
      
      localStorage.setItem(STORAGE_OKRS_KEY, JSON.stringify(list));
      return okr;
  }
};
