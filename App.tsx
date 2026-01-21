import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import LPView from './components/LPView';
import LeadTracker from './components/LeadTracker';
import RevenueTracker from './components/RevenueTracker';
import OKRTracker from './components/OKRTracker';
import { DataService } from './services/dataService';
import { User, Metric, ChartData, TabView, LandingPage } from './types';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Share2,
  Globe,
  Award,
  RefreshCw,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { PerformanceChart, ConversionBarChart } from './components/Charts';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  const [initializing, setInitializing] = useState(true);
  
  // Data State
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  
  const [loadingData, setLoadingData] = useState(false);

  // Initialize App (Check Login)
  useEffect(() => {
    const savedUser = localStorage.getItem('autoforce_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setInitializing(false);
  }, []);

  // Fetch Data when Tab or User changes
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, currentTab]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Always fetch dashboard data for the header summary
      if (metrics.length === 0) {
        const dashboardMetrics = await DataService.getDashboardMetrics();
        setMetrics(dashboardMetrics);
      }

      // Fetch specific tab data
      if (currentTab === TabView.DASHBOARD && chartData.length === 0) {
        const history = await DataService.getPerformanceHistory();
        setChartData(history);
        const lps = await DataService.getLandingPagesGA(); // Get Top LPs
        setLandingPages(lps);
      } else if (currentTab === TabView.LPS && landingPages.length === 0) {
        const lps = await DataService.getLandingPagesGA();
        setLandingPages(lps);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('autoforce_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('autoforce_user');
    setMetrics([]);
    setChartData([]);
  };

  if (initializing) return <div className="min-h-screen bg-[#00020A] flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Carregando AutoForce...</div>;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#00020A] font-sans text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-autoforce-darkest border-r border-autoforce-grey/20 flex flex-col justify-between shrink-0 z-50">
        <div>
          <div className="p-6 border-b border-autoforce-grey/20 flex justify-center">
             <img 
               src="https://static.autodromo.com.br/uploads/1dc32f4d-ab47-428d-91dd-756266d45b47_LOGOTIPO-AUTOFORCE-HORIZONTAL.svg" 
               alt="AutoForce" 
               className="h-8 w-auto object-contain"
             />
          </div>

          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setCurrentTab(TabView.DASHBOARD)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.DASHBOARD ? 'bg-autoforce-blue text-white shadow-lg shadow-autoforce-blue/30' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Performance</span>
            </button>
            
            <button 
              onClick={() => setCurrentTab(TabView.LEAD_TRACKER)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.LEAD_TRACKER ? 'bg-autoforce-blue text-white shadow-lg' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <ClipboardList size={20} />
              <span className="font-medium">Acompanhamento</span>
            </button>
            
            <button 
              onClick={() => setCurrentTab(TabView.REVENUE)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.REVENUE ? 'bg-autoforce-blue text-white shadow-lg' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <DollarSign size={20} />
              <span className="font-medium">Ganhos</span>
            </button>

            <button 
              onClick={() => setCurrentTab(TabView.OKRS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.OKRS ? 'bg-autoforce-blue text-white shadow-lg' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <Target size={20} />
              <span className="font-medium">Metas & OKRs</span>
            </button>

            <button 
              onClick={() => setCurrentTab(TabView.LPS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.LPS ? 'bg-autoforce-blue text-white shadow-lg' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <FileText size={20} />
              <span className="font-medium">Analytics (GA4)</span>
            </button>

            <button 
              onClick={() => setCurrentTab(TabView.SETTINGS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentTab === TabView.SETTINGS ? 'bg-autoforce-blue text-white shadow-lg' : 'text-autoforce-lightGrey hover:bg-white/5'}`}
            >
              <Settings size={20} />
              <span className="font-medium">Configurações</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-autoforce-grey/20">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-autoforce-blue" />
            <div>
              <p className="text-sm font-bold text-white leading-none">{user.name}</p>
              <p className="text-xs text-autoforce-lightGrey mt-1">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors py-2 border border-transparent hover:border-red-400/30 rounded"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#00020A] relative custom-scrollbar">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-autoforce-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="px-8 py-6 flex justify-between items-center sticky top-0 bg-[#00020A]/80 backdrop-blur-md z-40 border-b border-autoforce-grey/10">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {currentTab === TabView.DASHBOARD && "Visão Geral de Performance"}
              {currentTab === TabView.LEAD_TRACKER && "Acompanhamento Diário"}
              {currentTab === TabView.REVENUE && "Ganhos & Resultados"}
              {currentTab === TabView.OKRS && "Gestão de OKRs"}
              {currentTab === TabView.LPS && "Google Analytics"}
              {currentTab === TabView.SETTINGS && "Configurações"}
            </h1>
            <p className="text-autoforce-lightGrey text-sm flex items-center gap-2">
               {loadingData ? <RefreshCw className="animate-spin w-3 h-3"/> : <span className="w-2 h-2 rounded-full bg-green-500"></span>}
               Sistema Atualizado
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-autoforce-darkest border border-autoforce-grey/30 hover:border-autoforce-blue text-white px-4 py-2 rounded flex items-center gap-2 transition-all text-sm">
               <Share2 size={16} />
               Exportar Relatório
            </button>
            <div className="bg-autoforce-accent/10 border border-autoforce-accent/30 text-autoforce-accent px-4 py-2 rounded font-bold flex items-center gap-2 text-sm">
                <Target size={18} />
                Meta Global: 82%
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="relative z-10">
            
            {/* Dashboard View */}
            {currentTab === TabView.DASHBOARD && (
            <div className="p-8 space-y-8">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.id} className="bg-autoforce-darkest p-6 rounded-lg border border-autoforce-grey/20 relative overflow-hidden group hover:border-autoforce-blue/50 transition-all shadow-lg hover:shadow-autoforce-blue/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award size={40} />
                    </div>
                    <h3 className="text-autoforce-lightGrey text-xs font-bold uppercase tracking-wider mb-2">{metric.label}</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-display font-bold text-white">{metric.unit}{metric.value.toLocaleString()}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className={`text-sm font-bold flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                            {metric.trend === 'up' ? <TrendingUp size={14} /> : metric.trend === 'down' ? <TrendingDown size={14} /> : null}
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                        </div>
                        <span className="text-[10px] text-autoforce-grey bg-white/5 px-2 py-0.5 rounded">Meta: {metric.unit}{metric.target.toLocaleString()}</span>
                    </div>
                    {/* Progress Bar for Target */}
                    <div className="w-full bg-gray-800 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${metric.trend === 'up' ? 'bg-autoforce-blue' : 'bg-autoforce-accent'}`} 
                            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-autoforce-darkest p-6 rounded-lg border border-autoforce-grey/20">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white font-display">Funil de Vendas (Leads vs Qualificação)</h3>
                        <select className="bg-autoforce-black text-xs text-autoforce-lightGrey border border-autoforce-grey/30 rounded p-1">
                            <option>Últimos 6 meses</option>
                            <option>Ano Atual</option>
                        </select>
                    </div>
                    {loadingData ? <div className="h-[350px] flex items-center justify-center"><RefreshCw className="animate-spin"/></div> : <PerformanceChart data={chartData} />}
                </div>
                
                <div className="bg-autoforce-darkest p-6 rounded-lg border border-autoforce-grey/20 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 font-display">Conversão (Deals Fechados)</h3>
                    <div className="flex-1 flex items-center justify-center">
                        {loadingData ? <RefreshCw className="animate-spin"/> : <ConversionBarChart data={chartData} />}
                    </div>
                    <div className="mt-4 p-4 bg-autoforce-blue/10 rounded border border-autoforce-blue/20">
                        <h4 className="text-autoforce-blue font-bold text-sm mb-1">Insight AutoForce</h4>
                        <p className="text-xs text-autoforce-lightGrey">
                            Sua taxa de conversão subiu 15% em Maio. A campanha de "Feirão" foi o principal driver. Considere estender a oferta.
                        </p>
                    </div>
                </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Channel Breakdown */}
                <div className="bg-autoforce-darkest p-6 rounded-lg border border-autoforce-grey/20">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-autoforce-accent"/> 
                        Origem de Tráfego
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Google Ads', val: 45, color: 'bg-autoforce-blue' },
                            { name: 'Facebook/IG', val: 30, color: 'bg-blue-500' },
                            { name: 'Orgânico', val: 15, color: 'bg-green-500' },
                            { name: 'Direto', val: 10, color: 'bg-gray-500' }
                        ].map((channel) => (
                            <div key={channel.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-autoforce-lightGrey">{channel.name}</span>
                                    <span className="text-white font-bold">{channel.val}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div className={`h-full ${channel.color}`} style={{ width: `${channel.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing LPs (Mini Table) */}
                <div className="bg-autoforce-darkest p-6 rounded-lg border border-autoforce-grey/20 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Award size={18} className="text-autoforce-yellow"/> 
                            Top LPs por Conversão
                        </h3>
                        <button onClick={() => setCurrentTab(TabView.LPS)} className="text-xs text-autoforce-blue hover:underline">Ver todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-autoforce-lightGrey">
                            <thead className="text-xs text-autoforce-grey uppercase bg-autoforce-black/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Landing Page</th>
                                    <th className="px-4 py-3">Visitantes</th>
                                    <th className="px-4 py-3 rounded-r-lg">Conv. %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {landingPages.slice(0, 3).map((lp, idx) => (
                                    <tr key={idx} className="border-b border-autoforce-grey/10 hover:bg-autoforce-blue/5 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white">{lp.name}</td>
                                        <td className="px-4 py-3">{lp.users.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${lp.conversionRate > 5 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                                {lp.conversionRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

            </div>
            )}

            {/* Lead Tracker View */}
            {currentTab === TabView.LEAD_TRACKER && (
                <LeadTracker />
            )}

            {/* Revenue Tracker View */}
            {currentTab === TabView.REVENUE && (
                <RevenueTracker />
            )}

            {/* OKR Tracker View (NEW) */}
            {currentTab === TabView.OKRS && (
                <OKRTracker />
            )}

            {/* LP View */}
            {currentTab === TabView.LPS && (
                <LPView pages={landingPages} loading={loadingData} />
            )}

            {/* Settings Placeholder */}
            {currentTab === TabView.SETTINGS && (
            <div className="flex items-center justify-center h-[60vh] text-autoforce-grey flex-col gap-4">
                <div className="bg-autoforce-darkest p-8 rounded-full border border-autoforce-blue/20">
                    <Settings size={48} className="animate-spin-slow text-autoforce-blue" />
                </div>
                <h2 className="text-xl font-bold text-white">Configurações do Sistema</h2>
                <p className="max-w-md text-center text-sm">Integrações com CRM (Salesforce, RD Station) e configuração de metas globais estarão disponíveis na próxima atualização.</p>
            </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;