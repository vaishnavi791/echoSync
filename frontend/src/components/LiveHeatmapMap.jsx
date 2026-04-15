import React from 'react';
import Card from './ui/Card';
import { motion } from 'framer-motion';

const LiveHeatmapMap = ({ crowdDensity }) => {
  const getDensityColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-crimson/80';
      case 'MED': return 'bg-violet/60';
      case 'LOW': return 'bg-green-500/50';
      default: return 'bg-gray-500/50';
    }
  };

  return (
    <Card className="relative h-[250px] overflow-hidden flex flex-col">
      <h3 className="font-mono text-sm text-gray-400 mb-4 z-10">LIVE STADIUM DENSITY</h3>
      
      <div className="flex-1 relative w-full border border-white/5 rounded-lg overflow-hidden bg-obsidian/50">
        {/* Mock representation of nodes/areas */}
        <motion.div 
          className={`absolute top-4 left-4 w-12 h-12 ${getDensityColor(crowdDensity.gateA)} rounded-full blur-md`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className={`absolute top-1/2 left-1/3 w-16 h-16 ${getDensityColor(crowdDensity.concourseB)} rounded-full blur-md`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className={`absolute bottom-6 right-8 w-10 h-10 ${getDensityColor(crowdDensity.gateC)} rounded-full blur-md`}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />

        {/* Mock Paths */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <path d="M 40 40 L 120 120 L 250 80" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-pulse" />
        </svg>

        {/* Labels */}
        <div className={`absolute top-4 left-4 z-10 font-mono text-xs text-white px-2 rounded ${crowdDensity.gateA === 'HIGH' ? 'bg-crimson/20' : crowdDensity.gateA === 'MED' ? 'bg-violet/20' : 'bg-green-500/20'}`}>
          GATE A: {crowdDensity.gateA}
        </div>
        <div className={`absolute top-1/2 left-1/3 z-10 font-mono text-xs text-white px-2 rounded ${crowdDensity.concourseB === 'HIGH' ? 'bg-crimson/20' : crowdDensity.concourseB === 'MED' ? 'bg-violet/20' : 'bg-green-500/20'}`}>
          CONCOURSE B: {crowdDensity.concourseB}
        </div>
        <div className={`absolute bottom-6 right-8 z-10 font-mono text-xs text-white px-2 rounded ${crowdDensity.gateC === 'HIGH' ? 'bg-crimson/20' : crowdDensity.gateC === 'MED' ? 'bg-violet/20' : 'bg-green-500/20'}`}>
          GATE C: {crowdDensity.gateC}
        </div>
      </div>
    </Card>
  );
};

export default LiveHeatmapMap;
