
import React, { useState, useEffect } from 'react';
import { RevenueEntry } from '../types';
import { DataService } from '../services/dataService';
import { DollarSign, Plus, Briefcase, Tag, Globe, Package, TrendingUp, Loader2 } from 'lucide-react';

const RevenueTracker: React.FC = () => {
  const [history, setHistory] = useState<RevenueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [setupValue, setSetupValue] = useState('');
  const [mrrValue, setMrrValue] = useState('');
  const [origin, setOrigin] = useState('Google Ads');
  const [product, setProduct] = useState('Autoforce Site');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await DataService.getRevenueHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !setupValue || !mrrValue) return;

    setSaving(true);
    try {
        await DataService.saveRevenueEntry({
            businessName,
            setupValue: parseFloat(setupValue),
            mrrValue: parseFloat(mrrValue),
            origin,
            product
        });
        
        // Reset Form
        setBusinessName('');
        setSetupValue('');
        setMrrValue('');
        
        await loadData();
    } catch (err) {
        console.error(err);
    } finally {
        setSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Calculate Totals
  const totalSetup = history.reduce((acc, curr) => acc + curr.setupValue, 0);
  const totalMRR = history.reduce((acc, curr) => acc + curr.mrrValue, 0);

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="text-autoforce-success" />
                    Ganhos de Marketing
                </h2>
                <p className="text-autoforce-lightGrey text-sm">Registre as vendas, setup e receita recorrente (MRR) geradas.</p>
            </div>
        </div>

        {/* Totals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-autoforce-darkest to-autoforce-darkBlue/20 border border-autoforce-grey/20 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-autoforce-lightGrey text-xs font-bold uppercase tracking-wider mb-1">Total Setup Gerado</p>
                    <p className="text-3xl font-display font-bold text-white">{formatCurrency(totalSetup)}</p>
                </div>
                <div className="bg-autoforce-blue/20 p-3 rounded-full text-autoforce-blue">
                    <Briefcase size={24} />
                </div>
            </div>
            <div className="bg-gradient-to-br from-autoforce-darkest to-autoforce-darkBlue/20 border border-autoforce-grey/20 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-autoforce-lightGrey text-xs font-bold uppercase tracking-wider mb-1">Total MRR Adicionado</p>
                    <p className="text-3xl font-display font-bold text-green-400">{formatCurrency(totalMRR)}</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full text-green-500">
                    <TrendingUp size={24} />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-4 h-fit bg-autoforce-darkest border border-autoforce-grey/20 rounded-xl p-6 shadow-lg sticky top-6">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-autoforce-grey/20 pb-4">
                    <Plus size={16} className="text-autoforce-accent"/>
                    Novo Negócio
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Nome do Negócio</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Ex: Grupo Sinal"
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none pl-9"
                            />
                            <Briefcase className="absolute left-3 top-2.5 text-autoforce-grey" size={14} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Valor Setup (R$)</label>
                            <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                value={setupValue}
                                onChange={(e) => setSetupValue(e.target.value)}
                                placeholder="0,00"
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Valor MRR (R$)</label>
                            <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                value={mrrValue}
                                onChange={(e) => setMrrValue(e.target.value)}
                                placeholder="0,00"
                                className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Origem</label>
                            <div className="relative">
                                <select 
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none pl-9 appearance-none"
                                >
                                    <option value="Google Ads">Google Ads</option>
                                    <option value="Facebook/Meta">Facebook/Meta</option>
                                    <option value="Indicação">Indicação</option>
                                    <option value="Orgânico">Orgânico</option>
                                    <option value="Outros">Outros</option>
                                </select>
                                <Globe className="absolute left-3 top-2.5 text-autoforce-grey" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-autoforce-lightGrey uppercase tracking-wider mb-1">Produto</label>
                            <div className="relative">
                                <select 
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                    className="w-full bg-autoforce-black border border-autoforce-grey/50 rounded-lg px-3 py-2 text-white focus:border-autoforce-blue focus:outline-none pl-9 appearance-none"
                                >
                                    <option value="Autoforce Site">Autoforce Site</option>
                                    <option value="Autoforce MKT">Autoforce MKT</option>
                                    <option value="Autoforce CRM">Autoforce CRM</option>
                                    <option value="Combo Completo">Combo Completo</option>
                                </select>
                                <Package className="absolute left-3 top-2.5 text-autoforce-grey" size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18} />}
                            {saving ? 'Adicionando...' : 'Adicionar Ganho'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="lg:col-span-8 bg-autoforce-darkest border border-autoforce-grey/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-autoforce-grey/20">
                    <h3 className="text-white font-bold">Histórico de Vendas</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-autoforce-black/50 text-autoforce-grey text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Origem / Produto</th>
                                <th className="p-4 text-right">Setup</th>
                                <th className="p-4 text-right">MRR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-autoforce-grey/10">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-autoforce-lightGrey">Carregando...</td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-autoforce-lightGrey">Nenhuma venda registrada ainda.</td></tr>
                            ) : (
                                history.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-autoforce-blue/5 transition-colors">
                                        <td className="p-4 text-autoforce-lightGrey">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-4 font-bold text-white">{entry.businessName}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs text-autoforce-lightGrey"><Globe size={10}/> {entry.origin}</span>
                                                <span className="flex items-center gap-1 text-xs text-autoforce-blue"><Package size={10}/> {entry.product}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-autoforce-lightGrey">{formatCurrency(entry.setupValue)}</td>
                                        <td className="p-4 text-right font-mono text-green-400 font-bold">{formatCurrency(entry.mrrValue)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
  );
};

export default RevenueTracker;
