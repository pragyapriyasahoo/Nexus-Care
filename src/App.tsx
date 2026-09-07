import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Navbar } from './components/Navbar';
import { DemoControlBar } from './components/DemoControlBar';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { Patient360Modal } from './components/Patient360Modal';
import { EmergencyFallModal } from './components/EmergencyFallModal';
import {
  Activity,
  Heart,
  Shield,
  Layers,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role } = useHealth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Presentation Demo Control Bar */}
      <DemoControlBar />

      {/* Main Role-Specific View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'caregiver' ? <CaregiverDashboard /> : <DoctorDashboard />}
      </main>

      {/* Modals */}
      <Patient360Modal />
      <EmergencyFallModal />

      {/* Clean Natural Tones Healthcare Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              V
            </div>
            <span className="font-bold text-slate-800">VIONEX Health Companion</span>
            <span>· Smart India Hackathon (SIH) High-Fidelity Prototype</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Continuous Real-Time Sensor Telemetry
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              Fall Detection (3.8G) & Heat Stress Engine
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              Caregiver ↔ Doctor Dynamic Prioritization
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainLayout />
    </HealthProvider>
  );
}
