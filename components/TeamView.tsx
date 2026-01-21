import React from 'react';
import { TeamMember } from '../types';
import { MoreHorizontal, Phone, Mail, Award, TrendingUp } from 'lucide-react';

interface TeamViewProps {
  members: TeamMember[];
  loading: boolean;
}

const TeamView: React.FC<TeamViewProps> = ({ members, loading }) => {
  if (loading) {
    return <div className="text-white text-center py-20 animate-pulse">Carregando dados da equipe...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Performance da Equipe</h2>
          <p className="text-autoforce-lightGrey text-sm">Visão detalhada de vendas e geração de leads por membro</p>
        </div>
        <button className="bg-autoforce-blue hover:bg-autoforce-secondary text-white px-4 py-2 rounded text-sm font-bold transition-colors">
          + Adicionar Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-autoforce-darkest border border-autoforce-grey/20 rounded-lg p-6 hover:border-autoforce-blue/50 transition-all group relative">
            
            {/* Status Indicator */}
            <div className={`absolute top-6 right-6 w-3 h-3 rounded-full border-2 border-autoforce-darkest ${member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`} title={member.status}></div>

            <div className="flex items-center gap-4 mb-6">
              <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-autoforce-grey/30 group-hover:border-autoforce-blue transition-colors" />
              <div>
                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                <p className="text-autoforce-blue text-sm font-medium">{member.role}</p>
                <p className="text-xs text-autoforce-grey mt-1">{member.lastActive}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-autoforce-black/30 p-3 rounded">
                <p className="text-xs text-autoforce-lightGrey mb-1">Leads</p>
                <p className="text-xl font-bold text-white">{member.leadsGenerated}</p>
              </div>
              <div className="bg-autoforce-black/30 p-3 rounded">
                <p className="text-xs text-autoforce-lightGrey mb-1">Vendas</p>
                <p className="text-xl font-bold text-white">{member.salesClosed}</p>
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between text-xs text-autoforce-lightGrey">
                  <span>Meta Mensal</span>
                  <span className="text-white font-bold">{member.goalProgress}%</span>
               </div>
               <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${member.goalProgress >= 100 ? 'bg-green-500' : member.goalProgress > 70 ? 'bg-autoforce-blue' : 'bg-autoforce-accent'}`} 
                    style={{ width: `${Math.min(member.goalProgress, 100)}%` }}
                  ></div>
               </div>
            </div>

            <div className="flex gap-2 mt-6">
               <button className="flex-1 bg-autoforce-grey/10 hover:bg-autoforce-grey/30 border border-autoforce-grey/30 text-white py-2 rounded flex items-center justify-center transition-colors">
                  <Phone size={16} />
               </button>
               <button className="flex-1 bg-autoforce-grey/10 hover:bg-autoforce-grey/30 border border-autoforce-grey/30 text-white py-2 rounded flex items-center justify-center transition-colors">
                  <Mail size={16} />
               </button>
               <button className="flex-1 bg-autoforce-blue/10 hover:bg-autoforce-blue/20 border border-autoforce-blue/30 text-autoforce-blue py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm font-bold">
                  Ver Perfil
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
