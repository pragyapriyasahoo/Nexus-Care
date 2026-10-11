import React from 'react';
import { useHealth } from '../context/HealthContext';
import {
  AlertOctagon,
  ShieldAlert,
  PhoneCall,
  Ambulance,
  CheckCircle,
  MapPin,
  Heart,
  Activity,
  Volume2,
  Clock,
  User,
  Radio,
} from 'lucide-react';

export const EmergencyFallModal: React.FC = () => {
  const {
    fallState,
    patient,
    respondPatientSafe,
    dispatchEmergencyServices,
    language,
    setIs360ModalOpen,
  } = useHealth();

  if (!fallState.isActive) return null;

  const isHindi = language === 'hi';
  const isUnresponsive = fallState.stage === 'critical_unresponsive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Top Emergency Siren Banner */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-ping">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded">
                  {isUnresponsive ? 'CODE RED: UNRESPONSIVE FALL' : 'FALL IMPACT DETECTED'}
                </span>
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">
                  Confidence: {fallState.confidence}%
                </span>
              </div>
              <h2 className="text-lg font-extrabold mt-0.5">
                {isHindi ? 'आपातकालीन गिरावट चेतावनी: राजेश शर्मा (72)' : 'Emergency Fall Alert: Rajesh Sharma (72)'}
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          {!isUnresponsive && (
            <div className="text-right">
              <div className="text-2xl font-black font-mono tracking-tighter text-yellow-300">
                00:{fallState.countdown < 10 ? `0${fallState.countdown}` : fallState.countdown}
              </div>
              <p className="text-[10px] text-red-100 uppercase tracking-wider font-semibold">
                Auto Escalation
              </p>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* AI Voice Prompt Dialogue Card */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Nexus Care Smart Speaker Room Prompt:
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1 italic">
                  "{isHindi
                    ? 'राजेश जी, मैंने एक संभावित गिरावट दर्ज की है। क्या आप ठीक हैं? कृपया उत्तर दें।'
                    : 'Rajesh ji, I detected a possible fall impact. Are you okay? Please respond.'}"
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {isUnresponsive
                      ? isHindi
                        ? 'मरीज से कोई आवाज नहीं आई। तत्काल आपातकालीन सहायता भेजी जा रही है।'
                        : 'No verbal confirmation received from patient. Urgent dispatch recommended.'
                      : isHindi
                      ? `मरीज के उत्तर की प्रतीक्षा... (${fallState.countdown} सेकंड शेष)`
                      : `Awaiting audio confirmation... (${fallState.countdown}s remaining)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Snapshot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-red-500" />
                Impact Force
              </span>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {fallState.impactG} <span className="text-xs font-normal text-slate-400">G</span>
              </div>
              <span className="text-[10px] text-red-600 font-bold">High Deceleration</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" />
                Heart Rate
              </span>
              <div className="text-xl font-bold text-red-600 mt-1">
                {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Tachycardia Spike</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-teal-600" />
                SpO2 Level
              </span>
              <div className="text-xl font-bold text-teal-700 mt-1">
                {patient.vitals.spo2}%
              </div>
              <span className="text-[10px] text-teal-700 font-bold">Oxygen Stable</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                AI Risk Index
              </span>
              <div className="text-xl font-bold text-red-600 mt-1">
                {patient.riskScore}/100
              </div>
              <span className="text-[10px] text-red-700 font-bold uppercase">Critical Priority</span>
            </div>
          </div>

          {/* Location & Priority Information */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Flat 402, Rohini Sector 14, New Delhi (Living Room Floor)
                </p>
                <p className="text-[11px] text-slate-500">
                  Doctor Priority Queue: Automatically shifted to <strong className="text-red-700">Priority #1</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIs360ModalOpen(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 underline shrink-0 cursor-pointer"
            >
              Open 360° Data
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* 1. Safe / Cancel */}
            <button
              id="confirm-patient-safe-btn"
              onClick={respondPatientSafe}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isHindi ? 'मरीज सुरक्षित है / रद्द करें' : "I'm OK / Patient Safe"}</span>
            </button>

            {/* 2. Call Emergency Caregiver */}
            <button
              id="call-caregiver-sos-btn"
              onClick={() => alert('Initiating priority cellular call to Priya Sharma (Daughter: +91 98765 43210)...')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-teal-400" />
              <span>{isHindi ? 'केयरगिवर को कॉल करें' : 'Call Caregiver SOS'}</span>
            </button>

            {/* 3. Dispatch 108 EMS Ambulance */}
            <button
              id="dispatch-108-ambulance-btn"
              onClick={dispatchEmergencyServices}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm shadow-red-500/20 transition animate-pulse cursor-pointer"
            >
              <Ambulance className="w-4 h-4" />
              <span>{isHindi ? '108 एम्बुलेंस भेजें' : 'Dispatch 108 EMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
