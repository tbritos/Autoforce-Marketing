import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ChartData } from '../types';

interface ChartsProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-autoforce-darkest border border-autoforce-blue p-3 rounded shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-mono font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceChart: React.FC<ChartsProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1440FF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1440FF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFA814" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FFA814" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4E5265" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#8A92B7" 
            tick={{ fill: '#8A92B7' }} 
            tickLine={false}
          />
          <YAxis 
            stroke="#8A92B7" 
            tick={{ fill: '#8A92B7' }} 
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="leads" 
            name="Total Leads" 
            stroke="#1440FF" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLeads)" 
          />
          <Area 
            type="monotone" 
            dataKey="qualified" 
            name="Leads Qualificados" 
            stroke="#FFA814" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorQualified)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ConversionBarChart: React.FC<ChartsProps> = ({ data }) => {
    return (
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4E5265" vertical={false} opacity={0.3} />
            <XAxis dataKey="name" stroke="#8A92B7" tick={{fill: '#8A92B7'}} tickLine={false} />
            <YAxis stroke="#8A92B7" tick={{fill: '#8A92B7'}} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Legend />
            <Bar dataKey="sales" name="Vendas (Deals)" fill="#0027D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
};
