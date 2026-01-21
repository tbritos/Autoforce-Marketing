import { Metric, ChartData, TeamMember, LandingPage } from '../types';

// Simulando delay de rede para parecer real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DataService = {
  getDashboardMetrics: async (): Promise<Metric[]> => {
    await delay(800); // Fake loading
    return [
      { id: '1', label: 'Total de Leads', value: 3850, target: 4000, unit: '', change: 12.5, trend: 'up', description: 'Leads gerados em todas as fontes' },
      { id: '2', label: 'Taxa de Qualificação', value: 42, target: 45, unit: '%', change: -2.3, trend: 'down', description: 'Leads que viraram oportunidades' },
      { id: '3', label: 'Custo por Lead (CPL)', value: 18.50, target: 20.00, unit: 'R$', change: 5.1, trend: 'up', description: 'Investimento / Total de Leads' },
      { id: '4', label: 'Vendas Realizadas', value: 142, target: 120, unit: '', change: 15.8, trend: 'up', description: 'Veículos vendidos no período' },
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

  getTeamMembers: async (): Promise<TeamMember[]> => {
    await delay(1000);
    return [
      { id: '1', name: 'Ana Silva', role: 'Gerente Comercial', avatar: 'https://ui-avatars.com/api/?name=Ana+Silva&background=1440FF&color=fff', leadsGenerated: 120, salesClosed: 15, conversionRate: 12.5, lastActive: 'Online agora', status: 'online', goalProgress: 85 },
      { id: '2', name: 'Carlos Souza', role: 'Vendedor Sênior', avatar: 'https://ui-avatars.com/api/?name=Carlos+Souza&background=FFA814&color=000', leadsGenerated: 450, salesClosed: 32, conversionRate: 7.1, lastActive: 'há 5 min', status: 'busy', goalProgress: 92 },
      { id: '3', name: 'Mariana Lima', role: 'Analista de MKT', avatar: 'https://ui-avatars.com/api/?name=Mariana+Lima&background=00C851&color=fff', leadsGenerated: 850, salesClosed: 0, conversionRate: 0, lastActive: 'há 1h', status: 'offline', goalProgress: 60 },
      { id: '4', name: 'Roberto Santos', role: 'Vendedor Jr', avatar: 'https://ui-avatars.com/api/?name=Roberto+Santos&background=ff4444&color=fff', leadsGenerated: 200, salesClosed: 8, conversionRate: 4.0, lastActive: 'Online agora', status: 'online', goalProgress: 45 },
    ];
  },

  getLandingPages: async (): Promise<LandingPage[]> => {
    await delay(1200);
    return [
      { id: '1', name: 'Oferta SUV 2025', url: 'oferta-suv-2025', visitors: 12050, leads: 850, conversionRate: 7.05, bounceRate: 45.2, status: 'active', campaign: 'Lançamento Q3', lastUpdated: '12/06/2025' },
      { id: '2', name: 'Feirão Seminovos', url: 'feirao-seminovos', visitors: 8400, leads: 520, conversionRate: 6.19, bounceRate: 52.1, status: 'active', campaign: 'Varejo Mensal', lastUpdated: '10/06/2025' },
      { id: '3', name: 'Agendamento Revisão', url: 'pos-venda-revisao', visitors: 3200, leads: 480, conversionRate: 15.00, bounceRate: 25.4, status: 'active', campaign: 'Pós-Venda', lastUpdated: '01/05/2025' },
      { id: '4', name: 'Consórcio Nacional', url: 'lp-consorcio', visitors: 5100, leads: 150, conversionRate: 2.94, bounceRate: 65.0, status: 'paused', campaign: 'Institucional', lastUpdated: '20/04/2025' },
      { id: '5', name: 'Pré-venda Elétrico', url: 'eletrico-autoforce', visitors: 15000, leads: 2200, conversionRate: 14.6, bounceRate: 30.2, status: 'draft', campaign: 'Futuro', lastUpdated: 'Hoje' },
    ];
  }
};
