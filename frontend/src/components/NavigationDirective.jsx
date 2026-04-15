import React from 'react';
import Card from './ui/Card';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

const NavigationDirective = ({ active }) => {
  if (!active) return null;

  return (
    <Card className="flex flex-col gap-4 border-violet/30">
      <div className="flex justify-between items-center bg-obsidian/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-2 text-violet">
          <MapPin size={20} />
          <span className="font-mono font-bold tracking-widest text-lg">SEC 142</span>
        </div>
        <div className="flex items-center gap-2 text-crimson animate-pulse">
          <Clock size={16} />
          <span className="font-mono font-bold">EST. 4m 20s</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-4 p-3 bg-violet/10 rounded-lg">
          <div className="mt-1 bg-violet p-1.5 rounded-full text-white">
            <ArrowRight size={16} />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Proceed to Concourse B</h4>
            <p className="text-sm text-gray-400 font-mono">Avoid Gate A - Heavy Traffic Detected</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NavigationDirective;
