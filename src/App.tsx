import React, { useState } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { HomePanel } from './components/HomePanel';
import { SortingPanel } from './components/SortingPanel';
import { SearchingPanel } from './components/SearchingPanel';
import { StackPanel } from './components/StackPanel';
import { QueuePanel } from './components/QueuePanel';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('HOME');

  return (
    <div className="min-h-screen bg-[#12121E] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar matching the desktop Swing app header */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area with Card / View Switching */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'HOME' && <HomePanel onSelectPanel={setCurrentTab} />}
        {currentTab === 'SORTING' && <SortingPanel />}
        {currentTab === 'SEARCHING' && <SearchingPanel />}
        {currentTab === 'STACK' && <StackPanel />}
        {currentTab === 'QUEUE' && <QueuePanel />}
      </main>
    </div>
  );
};

export default App;
