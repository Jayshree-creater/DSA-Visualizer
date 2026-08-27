import React from 'react';
import { TabType } from '../types';
import { BarChart2, Search, Layers, Repeat, ArrowRight, Sparkles } from 'lucide-react';

interface HomePanelProps {
  onSelectPanel: (panel: TabType) => void;
}

export const HomePanel: React.FC<HomePanelProps> = ({ onSelectPanel }) => {
  const cards = [
    {
      id: 'SORTING' as TabType,
      emoji: '📊',
      icon: <BarChart2 className="w-8 h-8 text-[#6366F1]" />,
      title: 'Sorting',
      description: 'Bubble, Selection & Insertion Sort animations',
      color: '#6366F1',
      borderColor: 'border-[#6366F1]',
      btnBg: 'bg-[#6366F1]',
      hoverBorder: 'hover:border-[#818cf8]',
    },
    {
      id: 'SEARCHING' as TabType,
      emoji: '🔍',
      icon: <Search className="w-8 h-8 text-[#10B981]" />,
      title: 'Searching',
      description: 'Binary Search step by step with pointer visualization',
      color: '#10B981',
      borderColor: 'border-[#10B981]',
      btnBg: 'bg-[#10B981]',
      hoverBorder: 'hover:border-[#34d399]',
    },
    {
      id: 'STACK' as TabType,
      emoji: '📚',
      icon: <Layers className="w-8 h-8 text-[#F59E0B]" />,
      title: 'Stack',
      description: 'Push, Pop & Peek LIFO interactive animation',
      color: '#F59E0B',
      borderColor: 'border-[#F59E0B]',
      btnBg: 'bg-[#F59E0B]',
      hoverBorder: 'hover:border-[#fbbf24]',
    },
    {
      id: 'QUEUE' as TabType,
      emoji: '🔄',
      icon: <Repeat className="w-8 h-8 text-[#EF4444]" />,
      title: 'Queue',
      description: 'Enqueue, Dequeue & Peek FIFO interactive animation',
      color: '#EF4444',
      borderColor: 'border-[#EF4444]',
      btnBg: 'bg-[#EF4444]',
      hoverBorder: 'hover:border-[#f87171]',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full animate-fade-in">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Interactive DSA Playground
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#6366F1] tracking-tight mb-3">
          DSA Algorithm Visualizer
        </h1>
        <p className="text-base md:text-lg text-[#A0A0C8] max-w-xl mx-auto">
          Algorithms ko visually samjho — Step by Step Animation
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {cards.map((card) => (
          <div
            key={card.id}
            id={`card-${card.id.toLowerCase()}`}
            onClick={() => onSelectPanel(card.id)}
            className={`bg-[#1C1C2D] border-2 ${card.borderColor} ${card.hoverBorder} rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:bg-[#232337] group`}
          >
            <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {card.emoji}
            </div>
            <h3
              className="text-xl font-bold mb-2 tracking-wide"
              style={{ color: card.color }}
            >
              {card.title}
            </h3>
            <p className="text-sm text-[#A0A0C8] mb-6 flex-1 leading-relaxed">
              {card.description}
            </p>
            <button
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white ${card.btnBg} flex items-center justify-center gap-2 shadow-md transition-transform duration-200 group-hover:translate-x-0.5`}
            >
              <span>Open</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs md:text-sm text-[#64648C] font-medium border-t border-[#28283C] pt-6 w-full">
        Made with ❤️ using Core Java & Swing | Re-architected for Web Placement Showcase
      </div>
    </div>
  );
};
