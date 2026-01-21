
import React from 'react';
import { LandingPage } from '../types';
import { ExternalLink, ArrowUpRight, Clock, Users, Activity } from 'lucide-react';

interface LPViewProps {
  pages: LandingPage[];
  loading: boolean;
}

const LPView: React.FC<LPViewProps> = ({ pages, loading }) => {
  if (loading) {
    return <div className="text-white text-center py-20 animate-pulse">Sincronizando com Google Analytics...</div>;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in-up">
        {/* GA Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 bg-autoforce-darkest p-6 rounded-xl border border-autoforce-grey/20">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {/* Fake GA Icon */}
                    <div className="w-6 h-6 bg-[#E37400] rounded-full flex items-center justify-center">
                        <Activity size={14} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Google Analytics 4</h2>
                </div>
                <p className="text-autoforce-lightGrey text-sm">Dados de tráfego e conversão sincronizados em tempo real.</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-500 font-bold uppercase tracking-wider">Conectado: AutoForce Property ID-99382</span>
                </div>
            </div>
            <div>
                <button className="bg-autoforce-black border border-autoforce-grey/30 text-autoforce-lightGrey px-4 py-2 rounded text-sm hover:text-white transition flex items-center gap-2">
                    <ExternalLink size={14} />
                    Abrir Analytics
                </button>
            </div>
        </div>

        <div className="bg-autoforce-darkest border border-autoforce-grey/20 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-autoforce-black/40 text-autoforce-lightGrey text-xs uppercase tracking-wider border-b border-autoforce-grey/20">
                            <th className="p-4 font-semibold">Caminho da Página (Path)</th>
                            <th className="p-4 font-semibold text-right">Visualizações</th>
                            <th className="p-4 font-semibold text-right">Usuários</th>
                            <th className="p-4 font-semibold text-right">Tempo Médio</th>
                            <th className="p-4 font-semibold text-right">Conversões (Eventos)</th>
                            <th className="p-4 font-semibold text-right">Taxa Conv.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-autoforce-grey/10">
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-autoforce-blue/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">{page.name}</span>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-autoforce-blue">
                                            <span>{page.path}</span>
                                            <ExternalLink size={10} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white">
                                        {page.views.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-autoforce-lightGrey">
                                        <Users size={14} className="text-autoforce-grey" />
                                        {page.users.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-autoforce-lightGrey">
                                        <Clock size={14} className="text-autoforce-grey" />
                                        {page.avgEngagementTime}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white font-bold">
                                        <ArrowUpRight size={14} className="text-green-500" />
                                        {page.conversions.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${page.conversionRate > 10 ? 'bg-green-900/30 text-green-400' : 'bg-autoforce-blue/10 text-white'}`}>
                                        {page.conversionRate}%
                                    </span>
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
