import React from 'react';
import { useHealth } from '../context/HealthContext';
import { VionexCompanionWidget } from './VionexCompanionWidget';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pill,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  Phone,
  Flame,
} from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const {
    patient,
    medications,
    toggleMedication,
    alerts,
    acknowledgeAlert,
    language,
    setIs360ModalOpen,
    isHeatStressActive,
    triggerSimulateFall,
  } = useHealth();

  const isHindi = language === 'hi';

  // Status color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH RISK':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ELEVATED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MONITORING':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  // Environmental status badge
  const getEnvBadge = (temp: number) => {
    if (temp >= 40) return { label: isHindi ? 'अत्यधिक ताप' : 'Hazardous Heat', color: 'bg-red-50 text-red-700 border-red-200' };
    if (temp >= 35) return { label: isHindi ? 'गर्म वातावरण' : 'High Heat', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: isHindi ? 'सुखद तापमान' : 'Optimal Room', color: 'bg-teal-50 text-teal-700 border-teal-100' };
  };

  const envCondition = getEnvBadge(patient.environment.temperature);

  return (
    <div className="space-y-6">
      {/* Top Patient Header Banner (Natural Tones) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xs shrink-0">
              RS
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {patient.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {patient.age} {isHindi ? 'वर्ष, पुरुष' : 'Years • Type II Diabetes'}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getStatusBadge(
                    patient.riskStatus
                  )}`}
                >
                  {patient.riskStatus}
                </span>
                {patient.fallDetected && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                    FALL DETECTED
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {patient.room}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  {patient.condition}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Last check: {patient.lastCheckIn}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Caregiver Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="caregiver-sos-btn"
              onClick={triggerSimulateFall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 text-xs font-bold transition cursor-pointer"
              title="Test emergency SOS"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>{isHindi ? 'आपातकालीन कॉल' : 'Emergency SOS'}</span>
            </button>

            <button
              id="caregiver-view-360-btn"
              onClick={() => setIs360ModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <span>{isHindi ? 'मरीज का 360° विवरण' : 'Patient 360°'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Vitals Grid (Natural Tones cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isHindi ? 'हृदय गति' : 'Heart Rate'}
            </span>
            <div className={`p-2 rounded-xl ${patient.vitals.heartRate > 100 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              <Heart className={`w-4 h-4 ${patient.vitals.heartRate > 95 ? 'animate-ping' : ''}`} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold ${patient.vitals.heartRate > 95 ? 'text-amber-600' : 'text-slate-800'}`}>
              {patient.vitals.heartRate}
            </span>
            <span className="text-xs font-medium text-slate-400">bpm</span>
          </div>
          <div className="mt-2 w-full bg-amber-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (patient.vitals.heartRate / 140) * 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Baseline: {patient.baseline.heartRate} bpm</span>
            <span className={`font-semibold ${patient.vitals.heartRate > 85 ? 'text-amber-700' : 'text-teal-600'}`}>
              {patient.vitals.heartRate > patient.baseline.heartRate ? `+${patient.vitals.heartRate - patient.baseline.heartRate}` : 'Normal'}
            </span>
          </div>
        </div>

        {/* SpO2 Oxygen */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isHindi ? 'ऑक्सीजन स्तर' : 'SpO2 Level'}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold ${patient.vitals.spo2 < 95 ? 'text-amber-600' : 'text-teal-600'}`}>
              {patient.vitals.spo2}
            </span>
            <span className="text-xs font-medium text-slate-400">%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${patient.vitals.spo2}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Baseline: {patient.baseline.spo2}%</span>
            <span className="text-teal-700 font-semibold">Adequate</span>
          </div>
        </div>

        {/* Core Body Temperature */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isHindi ? 'शरीर तापमान' : 'Body Temp'}
            </span>
            <div className={`p-2 rounded-xl ${patient.vitals.bodyTemp >= 38 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold ${patient.vitals.bodyTemp >= 38 ? 'text-red-600' : 'text-slate-800'}`}>
              {patient.vitals.bodyTemp}
            </span>
            <span className="text-xs font-medium text-slate-400">°C</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${patient.vitals.bodyTemp >= 38 ? 'bg-red-500' : 'bg-slate-400'}`}
              style={{ width: `${Math.min(100, ((patient.vitals.bodyTemp - 35) / 5) * 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Baseline: {patient.baseline.bodyTemp}°C</span>
            <span className={`font-semibold ${patient.vitals.bodyTemp > 37.5 ? 'text-amber-700' : 'text-slate-600'}`}>
              {patient.vitals.bodyTemp > 37.5 ? 'Mild Pyrexia' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Current Activity & Blood Pressure */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isHindi ? 'गतिविधि स्थिति' : 'Patient Activity'}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-800 block truncate">
              {patient.vitals.activity}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              BP: {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia} mmHg
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Room Gyroscope</span>
            <span className={`font-semibold ${patient.fallDetected ? 'text-red-600' : 'text-teal-700'}`}>
              {patient.fallDetected ? 'Fall Registered' : 'Stable Posture'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Environmental Monitoring & AI Health Risk Score & Smart Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Telemetry Card (Natural Tones) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                {isHindi ? 'कमरे का वातावरण' : 'Environment'}
              </h2>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${envCondition.color}`}>
              {envCondition.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TEMP</p>
              <p className={`text-xl font-bold ${patient.environment.temperature >= 38 ? 'text-red-600' : 'text-amber-600'}`}>
                {patient.environment.temperature}°C
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">HUMIDITY</p>
              <p className="text-xl font-bold text-slate-800">{patient.environment.humidity}%</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AQI</p>
              <p className="text-xl font-bold text-teal-600">
                {patient.environment.aqi} <span className="text-[10px] font-medium">{patient.environment.status}</span>
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SOUND</p>
              <p className="text-xl font-bold text-slate-800">38dB</p>
            </div>
          </div>

          {/* Fall Detection quick status strip */}
          <div className={`rounded-2xl p-3 border flex items-center justify-between ${
            patient.fallDetected ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
          }`}>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${patient.fallDetected ? 'text-red-700' : 'text-slate-700'}`}>
                Fall Detection
              </p>
              <p className={`text-[10px] ${patient.fallDetected ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                {patient.fallDetected ? 'Impact Registered (3.8G)' : 'Continuous Monitoring Active'}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              patient.fallDetected ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* AI Health Risk Score Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  {isHindi ? 'एआई स्वास्थ्य जोखिम' : 'AI Health Risk Score'}
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">0-100 Gauge</span>
            </div>

            {/* Natural Tones Risk Metric */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Overall Risk</span>
                <span className="text-xs font-bold text-amber-700 underline capitalize">{patient.riskStatus}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-800">{patient.riskScore}</span>
                <span className="text-sm font-bold text-amber-700">/100</span>
              </div>
            </div>

            {/* Risk Factor Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>{isHindi ? 'हीट-स्ट्रेस संभावना' : 'Thermal Strain Risk'}</span>
                <span className="font-bold text-slate-800">
                  {patient.environment.temperature >= 38 ? 'High (84%)' : 'Low (18%)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{isHindi ? 'कार्डियोवैस्कुलर लोड' : 'Cardiovascular Load'}</span>
                <span className="font-bold text-slate-800">
                  {patient.vitals.heartRate > 95 ? 'Elevated' : 'Stable'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{isHindi ? 'संतुलन / चाल जोखिम' : 'Gait & Posture Balance'}</span>
                <span className="font-bold text-slate-800">
                  {patient.fallDetected ? 'CRITICAL EVENT' : 'Guarded (Age 72)'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIs360ModalOpen(true)}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{isHindi ? 'विस्तृत एआई विश्लेषण देखें' : 'View Detailed Predictive Radar'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Smart Insight Banner (Natural Tones Design) */}
        <div className="bg-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-xs font-bold text-amber-200 uppercase tracking-widest">AI Smart Insight</span>
            </div>

            {patient.fallDetected ? (
              <div className="space-y-3 mb-4">
                <p className="text-base font-medium leading-relaxed">
                  Sudden <span className="text-red-400 font-bold">3.8G deceleration impact</span> detected in Flat 402 living room. Rajesh has been immobile for &gt;15s.
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={triggerSimulateFall}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-white"
                  >
                    Open Emergency SOS
                  </button>
                  <button
                    onClick={() => setIs360ModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Telemetry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <p className="text-base font-medium leading-relaxed">
                  Rajesh's heart rate is climbing to <span className="text-amber-300 font-bold">{patient.vitals.heartRate} bpm</span> due to ambient heat (<span className="text-amber-300 font-bold">{patient.environment.temperature}°C</span>). He has been static for 45 minutes.
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => alert('Notification sent to Rajesh Sharma smart speaker')}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Notify Patient
                  </button>
                  <button
                    onClick={() => alert('Thermostat cooling dispatch activated')}
                    className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-white"
                  >
                    Adjust Thermostat
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>VIONEX Bio-Engine v4.2</span>
            <span className="text-teal-400 font-semibold">Continuous Telemetry</span>
          </div>

          {/* Decorative Teal glow blur */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Bottom Section: Medication Tracker & Companion Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medication Schedule Tracker (Natural Tones) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {isHindi ? "आज की अनुसूची" : "Today's Schedule"}
                </h2>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {isHindi ? 'दवाइयां एवं स्वास्थ्य कार्य' : 'Prescription Checklist & Adherence'}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                {medications.filter((m) => m.taken).length}/{medications.length} {isHindi ? 'ली गई' : 'Completed'}
              </span>
            </div>

            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => toggleMedication(med.id)}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    med.taken
                      ? 'bg-slate-50 border-slate-100 text-slate-500 opacity-60'
                      : 'bg-white border-slate-200 hover:border-teal-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        med.taken ? 'bg-teal-500' : 'bg-amber-500'
                      }`}
                    />
                    <div>
                      <span className={`text-xs font-bold ${med.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {med.name}
                      </span>
                      <p className="text-[11px] text-slate-500">{med.dosage}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-600 block">{med.time}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        med.taken ? 'text-teal-600' : 'text-amber-600'
                      }`}
                    >
                      {med.taken ? (isHindi ? '✓ ले ली गई' : 'Taken') : (isHindi ? 'लंबित' : 'Upcoming')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                {isHindi ? 'हालिया अलर्ट' : 'Recent Telemetry Alerts'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{alerts.length} total</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-2 ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : alert.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-100 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{alert.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({alert.timestamp})</span>
                    </div>
                    <p className="text-[11px] mt-0.5 text-slate-600">
                      {isHindi ? alert.descriptionHi : alert.description}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
                    >
                      OK
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIONEX Interactive Voice & Text Companion */}
        <VionexCompanionWidget />
      </div>
    </div>
  );
};
