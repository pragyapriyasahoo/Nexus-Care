import React from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Activity,
  ShieldAlert,
  User,
  Stethoscope,
  Globe,
  Radio,
  Sliders,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    patient,
    fallState,
    setIs360ModalOpen,
    isControlBarCollapsed,
    setIsControlBarCollapsed,
  } = useHealth();

  const isEmergency = fallState.isActive || patient.riskStatus === 'CRITICAL';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Nexus Care<span className="text-teal-600 font-bold ml-0.5">.ai</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                  {role === 'caregiver' ? 'Caregiver Portal' : 'Doctor Console'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI Health & Ambient Environmental Guardian
              </p>
            </div>
          </div>

          {/* Emergency Alert Banner (if active) */}
          {isEmergency && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-pulse text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>CRITICAL ALERT: Rajesh Sharma (Risk: {patient.riskScore}/100)</span>
            </div>
          )}

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Live Streaming Indicator (matching Natural Tones pill) */}
            <div className="hidden lg:flex items-center bg-teal-50 border border-teal-100 rounded-full px-3 py-1 text-teal-700">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs font-semibold uppercase tracking-wider">Live Simulation: ON</span>
            </div>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              title="Toggle English / Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                id="role-caregiver-btn"
                onClick={() => setRole('caregiver')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === 'caregiver'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Caregiver</span>
              </button>

              <button
                id="role-doctor-btn"
                onClick={() => setRole('doctor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === 'doctor'
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor (24)</span>
              </button>
            </div>

            {/* Quick 360° View Button */}
            <button
              id="open-360-nav-btn"
              onClick={() => setIs360ModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Patient 360°</span>
            </button>

            {/* Demo Bar Toggle button */}
            <button
              id="toggle-demo-bar-btn"
              onClick={() => setIsControlBarCollapsed(!isControlBarCollapsed)}
              className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                isControlBarCollapsed
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isControlBarCollapsed ? 'Expand SIH Demo Controls' : 'Minimize Demo Bar'}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
