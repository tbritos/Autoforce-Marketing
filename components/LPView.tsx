import React from 'react';
import { LandingPage } from '../types';
import { ExternalLink, Edit, Trash2, ArrowUpRight, ArrowDownRight, Eye, MousePointer } from 'lucide-react';

interface LPViewProps {
  pages: LandingPage[];
  loading: boolean;
}

const LPView: React.FC<LPViewProps> = ({ pages, loading }) => {
  if (loading) {
    return <div className="text-white text-center py-20 animate-pulse">Carregando dados das Landing Pages...</div>;
  }

  return (
    <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
            <div>
            <h2 className="text-xl font-bold text-white mb-1">Landing Pages & Campanhas</h2>
            <p className="text-autoforce-lightGrey text-sm">Monitore a conversão e o tráfego de suas páginas de captura</p>
            </div>
            <div className="flex gap-2">
                <button className="bg-autoforce-darkest border border-autoforce-grey text-white px-4 py-2 rounded text-sm hover:bg-white/5 transition">
                    Filtrar por Status
                </button>
                <button className="bg-autoforce-blue hover:bg-autoforce-secondary text-white px-4 py-2 rounded text-sm font-bold transition shadow-lg shadow-autoforce-blue/20">
                    + Nova Landing Page
                </button>
            </div>
        </div>

        <div className="bg-autoforce-darkest border border-autoforce-grey/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-autoforce-black/40 text-autoforce-lightGrey text-xs uppercase tracking-wider border-b border-autoforce-grey/20">
                            <th className="p-4 font-semibold">Nome da Página / URL</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                            <th className="p-4 font-semibold text-right">Visitantes</th>
                            <th className="p-4 font-semibold text-right">Leads</th>
                            <th className="p-4 font-semibold text-right">Conversão</th>
                            <th className="p-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-autoforce-grey/10">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-autoforce-blue/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">{page.name}</span>
                                        <a href="#" className="text-xs text-autoforce-blue hover:underline flex items-center gap-1 mt-1">
                                            /{page.url} <ExternalLink size={10} />
                                        </a>
                                        <span className="text-[10px] text-autoforce-grey mt-1">Campanha: {page.campaign}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        page.status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 
                                        page.status === 'paused' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' : 
                                        'bg-gray-800 text-gray-400 border border-gray-600/30'
                                    }`}>
                                        {page.status === 'active' ? 'Ativa' : page.status === 'paused' ? 'Pausada' : 'Rascunho'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white">
                                        <Eye size={14} className="text-autoforce-grey" />
                                        {page.visitors.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white">
                                        <MousePointer size={14} className="text-autoforce-grey" />
                                        {page.leads.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`font-bold ${page.conversionRate > 10 ? 'text-green-400' : page.conversionRate > 5 ? 'text-white' : 'text-red-400'}`}>
                                            {page.conversionRate}%
                                        </span>
                                        <span className="text-xs text-autoforce-grey">Bounce: {page.bounceRate}%</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-autoforce-blue/20 rounded text-autoforce-blue transition" title="Editar">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-900/20 rounded text-red-400 transition" title="Excluir">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default LPView;
