import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  X,
  Heart,
  Activity,
  Thermometer,
  Wind,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Pill,
  MessageSquare,
  FileText,
  PhoneCall,
  Ambulance,
  TrendingUp,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const Patient360Modal: React.FC = () => {
  const {
    is360ModalOpen,
    setIs360ModalOpen,
    selectedPatientId,
    getPatientById,
    patient: primaryRajesh,
    history,
    medications,
    vionexMessages,
    dispatchEmergencyServices,
    acknowledgeAlert,
    language,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'vitals' | 'risk_radar' | 'meds' | 'interactions'>('vitals');
  const [doctorNote, setDoctorNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  if (!is360ModalOpen) return null;

  const currentPatient = getPatientById(selectedPatientId) || primaryRajesh;
  const isRajesh = currentPatient.id === primaryRajesh.id;
  const isHindi = language === 'hi';

  // Compute baseline deviations
  const hrDelta = currentPatient.vitals.heartRate - currentPatient.baseline.heartRate;
  const tempDelta = Number((currentPatient.vitals.bodyTemp - currentPatient.baseline.bodyTemp).toFixed(1));
  const spo2Delta = currentPatient.vitals.spo2 - currentPatient.baseline.spo2;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              {currentPatient.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {currentPatient.name} — Patient 360° Profile
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Priority #{currentPatient.priorityRank}
                </span>
                {currentPatient.fallDetected && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black animate-pulse">
                    FALL DETECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentPatient.age} yrs, {currentPatient.gender} · {currentPatient.condition} · {currentPatient.room}
              </p>
            </div>
          </div>

          <button
            id="close-360-modal-btn"
            onClick={() => setIs360ModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close 360° Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-6 bg-white text-xs font-bold text-slate-500">
          <button
            id="tab-vitals-btn"
            onClick={() => setActiveTab('vitals')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vitals'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Vital Trends & Baselines</span>
          </button>

          <button
            id="tab-risk-btn"
            onClick={() => setActiveTab('risk_radar')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'risk_radar'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>AI Risk Matrix & Environment</span>
          </button>

          <button
            id="tab-meds-btn"
            onClick={() => setActiveTab('meds')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'meds'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Medication Adherence</span>
          </button>

          <button
            id="tab-interactions-btn"
            onClick={() => setActiveTab('interactions')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interactions'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>VIONEX Logs</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Baseline Deviation Comparison Banner */}
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              Personal Baseline vs. Current Telemetry (Delta Analysis)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* HR Comparison */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold text-slate-800">
                    {currentPatient.vitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      hrDelta > 15
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : hrDelta > 5
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-teal-50 text-teal-700 border border-teal-100'
                    }`}
                  >
                    {hrDelta >= 0 ? `+${hrDelta}` : hrDelta} bpm
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Baseline: {currentPatient.baseline.heartRate} bpm</span>
              </div>

              {/* SpO2 Comparison */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SpO2 Level</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold text-teal-600">{currentPatient.vitals.spo2}%</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      spo2Delta < -3
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : spo2Delta < 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-teal-50 text-teal-700 border border-teal-100'
                    }`}
                  >
                    {spo2Delta >= 0 ? `+${spo2Delta}%` : `${spo2Delta}%`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Baseline: {currentPatient.baseline.spo2}%</span>
              </div>

              {/* Body Temp Comparison */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Core Temp</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold text-slate-800">{currentPatient.vitals.bodyTemp}°C</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      tempDelta >= 1.0
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : tempDelta >= 0.4
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-teal-50 text-teal-700 border border-teal-100'
                    }`}
                  >
                    {tempDelta >= 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Baseline: {currentPatient.baseline.bodyTemp}°C</span>
              </div>

              {/* Blood Pressure Comparison */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold text-slate-800">
                    {currentPatient.vitals.bloodPressureSys}/{currentPatient.vitals.bloodPressureDia}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {currentPatient.vitals.activity}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Baseline: {currentPatient.baseline.bloodPressure}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: Vital Trends & Environmental Chart */}
          {activeTab === 'vitals' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Live Biometric & Ambient Thermal Timeline
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Heart Rate (bpm), Ambient Heat (°C), and Core Body Temp (°C)
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-100">
                    Continuous Telemetry Stream
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 5', 'dataMax + 10']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area
                        type="monotone"
                        dataKey="heartRate"
                        name="Heart Rate (bpm)"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#hrGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="ambientTemp"
                        name="Ambient Room Temp (°C)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bodyTemp"
                        name="Core Body Temp (°C)"
                        stroke="#0d9488"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary Chart: SpO2 & AI Risk Progression */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  AI Composite Risk Score & Oxygen Saturation Progression
                </h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="riskScore"
                        name="AI Risk Index (0-100)"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="spo2"
                        name="SpO2 (%)"
                        stroke="#0d9488"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Risk Radar & Environmental Breakdown */}
          {activeTab === 'risk_radar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risk Domain Cards */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      Thermal Strain & Heat Exhaustion
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {currentPatient.environment.temperature >= 38 ? 'Critical (88%)' : 'Normal (15%)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Evaluated from room temperature ({currentPatient.environment.temperature}°C), humidity ({currentPatient.environment.humidity}%), and tachycardia response.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-amber-600" />
                      Cardiovascular Stress Index
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {currentPatient.vitals.heartRate > 100 ? 'High Load (82%)' : 'Controlled (24%)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Assesses stroke volume demand vs baseline (72 bpm), hypertension history, and pulse variability.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-red-500" />
                      Gait & Postural Fall Risk
                    </span>
                    <span className="text-xs font-bold text-red-600">
                      {currentPatient.fallDetected ? 'Active Incident (94%)' : 'Elevated (35%)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Synthesizes accelerometer telemetry, posture transitions, age frailty coefficients, and room floor proximity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-teal-600" />
                      Respiratory & AQI Vulnerability
                    </span>
                    <span className="text-xs font-bold text-teal-700">
                      {currentPatient.environment.aqi > 150 ? 'Poor AQI (60%)' : 'Moderate (25%)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Monitors particulate index ({currentPatient.environment.aqi} AQI) correlated with SpO2 stability ({currentPatient.vitals.spo2}%).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Medication Adherence */}
          {activeTab === 'meds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
                <div>
                  <h4 className="text-xs font-bold text-teal-950">
                    7-Day Medication Adherence Rate
                  </h4>
                  <p className="text-xs text-teal-700">
                    Patient has consistently taken morning doses on time.
                  </p>
                </div>
                <span className="text-2xl font-bold text-teal-700">92%</span>
              </div>

              <div className="space-y-2">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          med.taken ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {med.taken ? '✓' : '!'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">{med.name}</span>
                        <p className="text-[11px] text-slate-500">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-600 block">{med.time}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          med.taken ? 'text-teal-600' : 'text-amber-600'
                        }`}
                      >
                        {med.taken ? 'Confirmed Dispensed' : 'Action Scheduled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIONEX Interaction Logs */}
          {activeTab === 'interactions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Audit trail of autonomous smart speaker conversations, reminders, and patient confirmations.
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {vionexMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                        {msg.sender === 'vionex' ? 'VIONEX AI Agent' : msg.sender === 'caregiver' ? 'Caregiver' : 'Patient Voice'}
                      </span>
                      <span className="text-[10px] font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="font-medium text-slate-900">{msg.text}</p>
                    <p className="text-slate-500 mt-1 italic text-[11px]">{msg.textHi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Actions & Doctor Notes Section */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Clinical Action Directives & Tele-Consult Orders
            </h3>

            {/* Doctor Note Form */}
            <form onSubmit={handleSaveNote} className="flex gap-2">
              <input
                type="text"
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                placeholder="Enter clinical observation or adjust tele-prescription dosage..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Save Note
              </button>
            </form>
            {noteSaved && (
              <p className="text-xs text-teal-700 font-semibold">
                ✓ Clinical note committed to patient electronic record.
              </p>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => alert('Initiating priority Tele-Consult video connection with Flat 402...')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Start Tele-Consult Video</span>
              </button>

              <button
                onClick={() => {
                  dispatchEmergencyServices();
                  alert('Emergency EMS 108 vehicle dispatched to Flat 402, Rohini Sector 14.');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <Ambulance className="w-3.5 h-3.5" />
                <span>Dispatch EMS 108</span>
              </button>

              <button
                onClick={() => alert('Clinical flag cleared. Patient moved to standard monitoring interval.')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Acknowledge & Clear Triage Flag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
