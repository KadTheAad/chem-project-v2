import { useState } from 'react';
import { Beaker, Link2 } from 'lucide-react';
import PolymerLab from './features/polymer-lab/PolymerLab';
import IMFViewer from './features/imf-viewer/IMFViewer';

function App() {
  const [activeTab, setActiveTab] = useState('polymer');

  const tabs = [
    { id: 'polymer', label: 'Polymer Lab', icon: Beaker, color: 'text-emerald-500' },
    { id: 'imf', label: 'IMF Viewer', icon: Link2, color: 'text-blue-500' },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-science-900 text-slate-200 font-sans relative">
      
      {/* Main Content Area */}
      <main className="absolute inset-0">
        {activeTab === 'polymer' && <PolymerLab />}
        {activeTab === 'imf' && <IMFViewer />}
      </main>

      {/* Floating Nav Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-card p-2 flex gap-2 rounded-full items-center shadow-2xl bg-science-900/90 border-science-700">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-science-800 text-white shadow-inner scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-science-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span className={`text-sm font-bold ${isActive ? 'block' : 'hidden md:block'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
