import React from 'react';
import { useHealth, HEAT_STRESS_STAGES } from '../context/HealthContext';
import {
  Flame,
  AlertOctagon,
  RotateCcw,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Activity,
  Users,
  Radio,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const {
    isLiveSimulation,
    toggleLiveSimulation,
    isHeatStressActive,
    heatStressStep,
    startHeatStressSimulation,
    pauseHeatStressSimulation,
    setHeatStressStage,
    triggerSimulateFall,
    resetToBaseline,
    fallState,
    role,
    setRole,
    isControlBarCollapsed,
    setIsControlBarCollapsed,
    patient,
  } = useHealth();

  if (isControlBarCollapsed) {
    return (
      <div className="fixed bottom-3 right-4 z-50">
        <button
          id="expand-demo-controls-btn"
          onClick={() => setIsControlBarCollapsed(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition border border-slate-700 text-xs font-semibold group cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>SIH Demo Controls</span>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="SIH Demo Control Panel" className="sticky top-16 z-30 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Label and Badge */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Demo Controls
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono border border-slate-700">
                  State: {patient.riskStatus} ({patient.riskScore}/100)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Synchronous caregiver & doctor reactivity simulation
              </p>
            </div>
          </div>

          {/* Action Buttons & Simulation Scenarios */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Live Jitter Toggle */}
            <button
              id="toggle-live-sim-btn"
              onClick={toggleLiveSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isLiveSimulation
                  ? 'bg-teal-950/80 border-teal-500/50 text-teal-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle subtle real-time telemetry jitter"
            >
              <Radio className={`w-3 h-3 ${isLiveSimulation ? 'animate-pulse text-teal-400' : ''}`} />
              <span>Live Ticker: {isLiveSimulation ? 'ON' : 'PAUSED'}</span>
            </button>

            {/* 2. Heat Stress Simulation Controller */}
            <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 p-0.5">
              <button
                id="toggle-heat-sim-btn"
                onClick={() => {
                  if (isHeatStressActive) {
                    pauseHeatStressSimulation();
                  } else {
                    startHeatStressSimulation();
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isHeatStressActive
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                    : 'text-amber-400 hover:bg-amber-950/50'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isHeatStressActive ? 'animate-bounce text-yellow-200' : 'text-amber-400'}`} />
                <span>{isHeatStressActive ? 'PAUSE HEAT STRESS' : 'HEAT STRESS SIM'}</span>
              </button>

              {/* Step indicator buttons 1-5 */}
              <div className="flex items-center px-1.5 gap-1 border-l border-slate-700 ml-1">
                {HEAT_STRESS_STAGES.map((stg, idx) => (
                  <button
                    key={idx}
                    id={`heat-step-${idx + 1}-btn`}
                    onClick={() => setHeatStressStage(idx)}
                    className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition cursor-pointer ${
                      heatStressStep === idx && (isHeatStressActive || patient.riskScore === stg.risk)
                        ? 'bg-amber-500 text-white ring-1 ring-amber-300'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={`Stage ${idx + 1}: ${stg.status} (HR ${stg.hr}, Amb ${stg.ambTemp}°C, Risk ${stg.risk})`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Simulate Fall Trigger */}
            <button
              id="simulate-fall-btn"
              onClick={triggerSimulateFall}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                fallState.isActive
                  ? 'bg-red-600 text-white ring-2 ring-red-400 animate-pulse'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              <span>SIMULATE FALL (3.8G)</span>
            </button>

            {/* 4. Reset to Baseline */}
            <button
              id="reset-baseline-btn"
              onClick={resetToBaseline}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              title="Reset Rajesh Sharma to baseline healthy condition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">RESET BASELINE</span>
            </button>

            {/* 5. Switch Role Quick Link */}
            <button
              id="demo-switch-role-btn"
              onClick={() => setRole(role === 'caregiver' ? 'doctor' : 'caregiver')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900/40 border border-teal-600/50 text-teal-300 hover:bg-teal-800/60 text-xs font-bold transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>SWITCH TO {role === 'caregiver' ? 'DOCTOR VIEW' : 'CAREGIVER VIEW'}</span>
            </button>

            {/* Collapse toggle */}
            <button
              id="collapse-control-bar-btn"
              onClick={() => setIsControlBarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
              title="Collapse control bar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
