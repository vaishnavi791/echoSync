import React, { useState, useEffect, useRef } from 'react';
import AR_SeatFinder from './components/AR_SeatFinder';
import LiveHeatmapMap from './components/LiveHeatmapMap';
import NavigationDirective from './components/NavigationDirective';
import StartNavigationButton from './components/ui/StartNavigationButton';
import Card from './components/ui/Card';
import { motion } from 'framer-motion';
import { Camera, MapPin, AlertTriangle, Navigation, Search } from 'lucide-react';

function App() {
  const [navigationActive, setNavigationActive] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [selectedView, setSelectedView] = useState('ar'); // 'ar', 'features', 'alerts'
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [crowdDensity, setCrowdDensity] = useState({ gateA: 'HIGH', concourseB: 'MED', gateC: 'LOW' });
  const [loading, setLoading] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const audioRef = useRef(null);

  // Simulate real-time crowd density updates
  useEffect(() => {
    const interval = setInterval(() => {
      const densities = ['LOW', 'MED', 'HIGH'];
      setCrowdDensity({
        gateA: densities[Math.floor(Math.random() * 3)],
        concourseB: densities[Math.floor(Math.random() * 3)],
        gateC: densities[Math.floor(Math.random() * 3)],
      });
    }, 3000 + Math.random() * 2000); // 3-5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogoHover = () => {
    setIsLogoHovered(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const handleLogoLeave = () => {
    setIsLogoHovered(false);
  };

  // Simulate real-time crowd density updates
  useEffect(() => {
    const interval = setInterval(() => {
      const densities = ['LOW', 'MED', 'HIGH'];
      setCrowdDensity({
        gateA: densities[Math.floor(Math.random() * 3)],
        concourseB: densities[Math.floor(Math.random() * 3)],
        gateC: densities[Math.floor(Math.random() * 3)],
      });
    }, 3000 + Math.random() * 2000); // 3-5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStartNavigation = async () => {
    setLoading(true);
    setNavigationActive(true);
    try {
      const response = await fetch('http://localhost:8080/api/navigation/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startNodeId: 'gate_b',
          endNodeId: 'sec_142',
          crowdDensityWeights: { 'concourse_a': 1.5 }
        })
      });
      const data = await response.json();
      console.log("Path received:", data);
    } catch (err) {
      console.log("Backend not connected yet. Running UI in standalone mode.");
    }
    setTimeout(() => setLoading(false), 1000);
  };

  const handleProceedToConcourseB = () => {
    setNavigationActive(true);
    setSelectedView('features');
  };

  const handleActivateAR = () => {
    setIsARActive(!isARActive);
  };

  const handleFindMySeat = () => {
    setShowSeatModal(true);
  };

  const handleFlowNavigation = () => {
    setSelectedView('features');
  };

  const tabs = [
    { id: 'ar', label: 'AR View', icon: Camera },
    { id: 'features', label: 'Features', icon: MapPin },
    { id: 'alerts', label: 'Live Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Hidden audio element for logo sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/echo-ping.mp3" type="audio/mpeg" />
        <source src="/echo-ping.wav" type="audio/wav" />
      </audio>

      <header className="flex justify-between items-center mb-4">
        <motion.div
          className="cursor-pointer select-none"
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h1 className={`text-4xl font-mono font-bold tracking-tighter transition-all duration-300 ${
            isLogoHovered
              ? 'text-shadow-glow'
              : 'text-white'
          }`}>
            ECHO<span className={`bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent ${
              isLogoHovered ? 'text-shadow-glow-purple' : ''
            }`}>-SYNC</span>
          </h1>
          <p className="font-mono text-sm tracking-widest text-gray-500 mt-1">REAL-TIME STADIUM OPTIMIZATION</p>
        </motion.div>
        <div className="px-4 py-2 bg-obsidian border border-white/10 rounded-full font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition ${
              selectedView === tab.id
                ? 'bg-violet text-white'
                : 'bg-obsidian/50 text-gray-400 hover:bg-obsidian/70'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Map & Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <LiveHeatmapMap crowdDensity={crowdDensity} />
          
          {selectedView === 'features' && (
            <>
              <NavigationDirective active={navigationActive} />
              
              {!navigationActive && (
                <div className="flex-1 flex items-center justify-center py-12">
                  <StartNavigationButton onClick={handleStartNavigation} disabled={loading} />
                </div>
              )}
              
              <Card className="p-4">
                <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToConcourseB}
                    className="flex items-center gap-3 p-3 bg-violet/10 hover:bg-violet/20 rounded-lg text-left transition"
                    disabled={navigationActive}
                    title={navigationActive ? "Navigation already active" : "Navigate to Concourse B"}
                  >
                    <Navigation size={20} className="text-violet" />
                    <div>
                      <div className="font-semibold text-white">Proceed to Concourse B</div>
                      <div className="text-sm text-gray-400">Navigate to your section</div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleActivateAR}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition ${
                      isARActive ? 'bg-green-500/10 hover:bg-green-500/20' : 'bg-gray-500/10 hover:bg-gray-500/20'
                    }`}
                    title={isARActive ? "Deactivate AR overlay" : "Activate AR overlay for navigation"}
                  >
                    <Camera size={20} className={isARActive ? 'text-green-500' : 'text-gray-400'} />
                    <div>
                      <div className="font-semibold text-white">{isARActive ? 'Deactivate AR' : 'Activate AR'}</div>
                      <div className="text-sm text-gray-400">Toggle AR overlay</div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFindMySeat}
                    className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-left transition"
                    title="Open seat detection modal"
                  >
                    <Search size={20} className="text-blue-500" />
                    <div>
                      <div className="font-semibold text-white">Find My Seat</div>
                      <div className="text-sm text-gray-400">Locate your assigned seat</div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFlowNavigation}
                    className="flex items-center gap-3 p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg text-left transition"
                    title="Switch to navigation features panel"
                  >
                    <MapPin size={20} className="text-orange-500" />
                    <div>
                      <div className="font-semibold text-white">Flow Navigation</div>
                      <div className="text-sm text-gray-400">Switch to navigation panel</div>
                    </div>
                  </motion.button>
                </div>
              </Card>
            </>
          )}
          
          {selectedView === 'alerts' && (
            <Card className="p-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-500" />
                Live Alerts
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="font-semibold text-yellow-400">High Traffic at Gate A</div>
                  <div className="text-sm text-gray-400">Estimated wait: 5-7 minutes</div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="font-semibold text-green-400">Concourse B Clear</div>
                  <div className="text-sm text-gray-400">Optimal path available</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - AR View or Features */}
        <div className="lg:col-span-2 relative min-h-[500px]">
          {selectedView === 'ar' && <AR_SeatFinder isARActive={isARActive} onToggleAR={handleActivateAR} />}
          {selectedView === 'features' && (
            <Card className="h-full min-h-[500px] p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Navigation Features</h2>
              <p className="text-gray-400 mb-6">Explore advanced navigation tools and real-time updates.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-violet/10 rounded-lg">
                  <h3 className="font-semibold text-violet mb-2">Path Optimization</h3>
                  <p className="text-sm text-gray-400">AI-powered route planning based on crowd density.</p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-2">Real-time Updates</h3>
                  <p className="text-sm text-gray-400">Live crowd data updates every 3-5 seconds.</p>
                </div>
              </div>
            </Card>
          )}
          {selectedView === 'alerts' && (
            <Card className="h-full min-h-[500px] p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Alert Dashboard</h2>
              <p className="text-gray-400 mb-6">Monitor live alerts and system status.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-obsidian/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">System Status</div>
                    <div className="text-sm text-green-400">All systems operational</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Seat Finder Modal */}
      {showSeatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Seat Detection</h3>
            <p className="text-gray-400 mb-4">Simulating seat detection...</p>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-violet rounded-full mx-auto mb-4 animate-pulse"></div>
              <p className="text-violet font-semibold">Scanning...</p>
            </div>
            <button
              onClick={() => setShowSeatModal(false)}
              className="w-full py-2 bg-violet rounded-lg text-white font-semibold hover:bg-violet/90 transition"
            >
              Close
            </button>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 font-mono text-sm">
        created by vaishnavi with ❤️
      </footer>
    </div>
  );
}

export default App;
