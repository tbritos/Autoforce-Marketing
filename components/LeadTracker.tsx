
import React, { useState, useEffect } from 'react';
import { DailyLeadEntry } from '../types';
import { DataService } from '../services/dataService';
import { Calendar, Save, TrendingUp, Filter, Plus, FileSpreadsheet, Loader2 } from 'lucide-react';

const LeadTracker: React.FC = () => {
  const [history, setHistory] = useState<DailyLeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mqlInput, setMqlInput] = useState<number>(0);
  const [sqlInput, setSqlInput] = useState<number>(0);
  const [salesInput, setSalesInput] = useState<number>(0);

  // Computed Stats
  const [stats, setStats] = useState({
    day: { mql: 0, sql: 0, sales: 0, conversion: 0 },
    week: { mql: 0, sql: 0, sales: 0, conversion: 0 },
    month: { mql: 0, sql: 0, sales: 0, conversion: 0 }
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // Quando a data selecionada ou o histórico muda, recalcula as estatísticas
    if (history.length > 0) {
        calculateStats(selectedDate);
        
        // Se já existir dados para a data selecionada, preenche o form
        const existingEntry = history.find(h => h.date === selectedDate);
        if (existingEntry) {
            setMqlInput(existingEntry.mql);
            setSqlInput(existingEntry.sql);
            setSalesInput(existingEntry.sales);
        } else {
            // Se não, zera (ou mantém o input do usuário se ele estiver digitando novo)
            // Aqui optamos por não zerar automaticamente para não frustrar o usuário trocando datas
            // mas num app real poderiamos perguntar.
        }
    }
  }, [history, selectedDate]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await DataService.getDailyLeadsHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (targetDate: string) => {
    const target = new Date(targetDate);
    const targetMonth = target.getMonth();
    const targetYear = target.getFullYear();
    
    // Start of Week (assuming Sunday as start)
    const dayOfWeek = target.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(target);
    startOfWeek.setDate(target.getDate() - dayOfWeek);
    startOfWeek.setHours(0,0,0,0);
    
    // End of selected day
    const endOfTargetDay = new Date(target);
    endOfTargetDay.setHours(23, 59, 59, 999);

    // Filter Logic
    let dayMql = 0, daySql = 0, daySales = 0;
    let weekMql = 0, weekSql = 0, weekSales = 0;
    let monthMql = 0, monthSql = 0, monthSales = 0;

    // Verificar se existe input atual para somar nas estatisticas em tempo real ou usar o histórico
    // Vamos usar o histórico + o input atual se a data for a selecionada
    // Mas para simplificar a visualização "Spreadsheet", vamos calcular baseado no que está SALVO ou no input atual se for o dia

    history.forEach(entry => {
        const entryDate = new Date(entry.date + 'T12:00:00'); // Fix timezone issue roughly
        
        // Check Day (Is Exact Match?)
        if (entry.date === targetDate) {
           // We will overwrite day stats with form input below to show "preview"
        }

        // Check Week ( >= StartOfWeek AND <= TargetDate)
        if (entryDate >= startOfWeek && entryDate <= endOfTargetDay) {
            if (entry.date !== targetDate) { // Add history, current day added later
                weekMql += entry.mql;
                weekSql += entry.sql;
                weekSales += entry.sales;
            }
        }

        // Check Month (Same Month/Year AND <= TargetDate)
        if (entryDate.getMonth() === targetMonth && entryDate.getFullYear() === targetYear && entryDate <= endOfTargetDay) {
             if (entry.date !== targetDate) {
                monthMql += entry.mql;
                monthSql += entry.sql;
                monthSales += entry.sales;
             }
        }
    });

    // Add current inputs to stats
    dayMql = mqlInput;
    daySql = sqlInput;
    daySales = salesInput;

    weekMql += mqlInput;
    weekSql += sqlInput;
    weekSales += salesInput;

    monthMql += mqlInput;
    monthSql += sqlInput;
    monthSales += salesInput;

    setStats({
        day: { mql: dayMql, sql: daySql, sales: daySales, conversion: dayMql > 0 ? (daySales / dayMql) * 100 : 0 },
        week: { mql: weekMql, sql: weekSql, sales: weekSales, conversion: weekMql > 0 ? (weekSales / weekMql) * 100 : 0 },
        month: { mql: monthMql, sql: monthSql, sales: monthSales, conversion: monthMql > 0 ? (monthSales / monthMql) * 100 : 0 },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const conversion = mqlInput > 0 ? (salesInput / mqlInput) * 100 : 0;

    try {
        await DataService.saveDailyLeadEntry({
            date: selectedDate,
            mql: mqlInput,
            sql: sqlInput,
            sales: salesInput,
            conversionRate: conversion
        });
        await loadHistory(); // Reload to update table
    } catch (err) {
        console.error(err);
    } finally {
        setSaving(false);
    }
  };

  // Helper to format percentage
  const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  // Helper for date display
  const fmtDate = (d: string) => {
      const parts = d.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="text-autoforce-blue" />
                    Acompanhamento Diário
                </h2>
                <p className="text-autoforce-lightGrey text-sm">Registre MQLs, SQLs e Conversões diariamente.</p>
            </div>
        </div>

        {/* Main Input & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Form */}
            <div className="lg:col-span-4 bg-autoforce-darkest border border-autoforce-grey/20 rounded-xl p-6 shadow-lg">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-autoforce-accent"/>
                    Registro de Dados
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Data de Referência</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none"
                            />
                            <Calendar className="absolute right-3 top-2.5 text-autoforce-grey pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">MQLs</label>
                            <input 
                                type="number" 
                                min="0"
                                value={mqlInput}
                                onChange={(e) => setMqlInput(Number(e.target.value))}
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">SQLs</label>
                            <input 
                                type="number" 
                                min="0"
                                value={sqlInput}
                                onChange={(e) => setSqlInput(Number(e.target.value))}
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Vendas (Conversão)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={salesInput}
                            onChange={(e) => setSalesInput(Number(e.target.value))}
                            className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none font-mono"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="w-full bg-autoforce-blue hover:bg-autoforce-secondary text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-autoforce-blue/20"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                            {saving ? 'Salvando...' : 'Salvar Dados'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Stats View (Spreadsheet Style) */}
            <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-lg overflow-hidden border border-autoforce-grey/20 text-autoforce-black shadow-lg">
                    {/* Header Blue Bar */}
                    <div className="bg-autoforce-blue px-6 py-3 flex justify-between items-center text-white">
                        <span className="font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-autoforce-yellow" />
                            Performance Consolidada
                        </span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Ref: {fmtDate(selectedDate)}</span>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-3 divide-x divide-gray-200">
                        {/* Day Column */}
                        <div className="p-4 flex flex-col items-center">
                            <h4 className="text-xs font-bold text-autoforce-blue uppercase tracking-wider mb-4 bg-blue-50 px-2 py-1 rounded w-full text-center">Dia {fmtDate(selectedDate)}</h4>
                            <div className="space-y-3 w-full max-w-[150px]">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">MQL</span>
                                    <span className="font-bold">{stats.day.mql}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">SQL</span>
                                    <span className="font-bold">{stats.day.sql}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-semibold">Conv.</span>
                                    <span className={`font-bold ${stats.day.conversion > 10 ? 'text-green-600' : 'text-gray-800'}`}>{fmt(stats.day.conversion)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Week Column */}
                        <div className="p-4 flex flex-col items-center bg-gray-50/50">
                            <h4 className="text-xs font-bold text-autoforce-blue uppercase tracking-wider mb-4 bg-blue-50 px-2 py-1 rounded w-full text-center">Semana Atual</h4>
                            <div className="space-y-3 w-full max-w-[150px]">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">MQL</span>
                                    <span className="font-bold">{stats.week.mql}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">SQL</span>
                                    <span className="font-bold">{stats.week.sql}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-semibold">Conv.</span>
                                    <span className={`font-bold ${stats.week.conversion > 10 ? 'text-green-600' : 'text-gray-800'}`}>{fmt(stats.week.conversion)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Month Column */}
                        <div className="p-4 flex flex-col items-center">
                            <h4 className="text-xs font-bold text-autoforce-blue uppercase tracking-wider mb-4 bg-blue-50 px-2 py-1 rounded w-full text-center">Mês Atual</h4>
                            <div className="space-y-3 w-full max-w-[150px]">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">MQL</span>
                                    <span className="font-bold">{stats.month.mql}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <span className="text-xs text-gray-500 font-semibold">SQL</span>
                                    <span className="font-bold">{stats.month.sql}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-semibold">Conv.</span>
                                    <div className="flex flex-col items-end">
                                        <span className={`font-bold ${stats.month.conversion > 10 ? 'text-green-600' : 'text-gray-800'}`}>{fmt(stats.month.conversion)}</span>
                                    </div>
                                </div>
                                {/* Progress bar only for month */}
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                                     <div className="h-full bg-autoforce-accent rounded-full" style={{width: `${Math.min(stats.month.conversion, 100)}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-autoforce-darkest border border-autoforce-blue/20 rounded p-4 flex gap-4 items-center">
                    <div className="bg-autoforce-blue/10 p-2 rounded-full text-autoforce-blue">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold">Insight Automático</p>
                        <p className="text-autoforce-lightGrey text-xs">
                            Sua conversão mensal está em {fmt(stats.month.conversion)}. Para atingir a meta de 15%, você precisa de mais {Math.ceil(stats.month.mql * 0.15 - stats.month.sales)} vendas com o volume atual de leads.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* History Table */}
        <div className="bg-autoforce-darkest border border-autoforce-grey/20 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-autoforce-grey/20 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Calendar size={18} className="text-autoforce-lightGrey" />
                    Histórico Completo
                </h3>
                <button className="flex items-center gap-2 text-xs text-autoforce-blue hover:text-white transition">
                    <Filter size={14} />
                    Filtrar por Período
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-autoforce-black/50 text-autoforce-grey text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-center">MQL</th>
                            <th className="p-4 text-center">SQL</th>
                            <th className="p-4 text-center">Vendas</th>
                            <th className="p-4 text-right">Taxa Conv.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-autoforce-grey/10">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-autoforce-lightGrey">Carregando histórico...</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-autoforce-lightGrey">Nenhum registro encontrado.</td></tr>
                        ) : (
                            history.map((entry) => (
                                <tr key={entry.id} className="hover:bg-autoforce-blue/5 transition-colors">
                                    <td className="p-4 text-white font-medium border-l-4 border-transparent hover:border-autoforce-accent">{fmtDate(entry.date)}</td>
                                    <td className="p-4 text-center text-autoforce-lightGrey">{entry.mql}</td>
                                    <td className="p-4 text-center text-autoforce-lightGrey">{entry.sql}</td>
                                    <td className="p-4 text-center text-white font-bold">{entry.sales}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${entry.conversionRate > 15 ? 'bg-green-900/40 text-green-400' : 'bg-autoforce-blue/10 text-autoforce-blue'}`}>
                                            {fmt(entry.conversionRate)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
  );
};

export default LeadTracker;
