import React from 'react';
import { TabType } from '../types';
import { Home, BarChart2, Search, Layers, Repeat } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'SORTING', label: 'Sorting', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'SEARCHING', label: 'Searching', icon: <Search className="w-4 h-4" /> },
    { id: 'STACK', label: 'Stack', icon: <Layers className="w-4 h-4" /> },
    { id: 'QUEUE', label: 'Queue', icon: <Repeat className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#191928] border-b-2 border-[#6366F1] px-4 py-2.5 shadow-lg flex items-center justify-between flex-wrap gap-3">
      <div 
        id="nav-logo" 
        onClick={() => onTabChange('HOME')}
        className="flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <span className="text-2xl transition-transform duration-200 group-hover:scale-110">🧠</span>
        <span className="text-[#6366F1] font-bold text-lg tracking-wide group-hover:text-indigo-400 transition-colors">
          DSA Visualizer
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase()}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/30'
                  : 'bg-[#28283C] text-slate-200 hover:bg-[#6366F1]/80 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
