import React, { useState, useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  ArrowUpDown,
  Stethoscope,
  Heart,
  Activity,
  ChevronRight,
  TrendingUp,
  Download,
  Building2,
  Home,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    allPatients,
    setSelectedPatientId,
    setIs360ModalOpen,
    patient,
    fallState,
  } = useHealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH RISK' | 'ELEVATED' | 'MONITORING' | 'NORMAL'>('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'HOME' | 'WARD' | 'ICU'>('ALL');

  // KPI Calculations
  const stats = useMemo(() => {
    const total = allPatients.length;
    const critical = allPatients.filter((p) => p.riskStatus === 'CRITICAL').length;
    const atRisk = allPatients.filter((p) => p.riskStatus === 'HIGH RISK' || p.riskStatus === 'ELEVATED').length;
    const stable = allPatients.filter((p) => p.riskStatus === 'MONITORING' || p.riskStatus === 'NORMAL').length;
    return { total, critical, atRisk, stable };
  }, [allPatients]);

  // Filtered patient list
  const filteredPatients = useMemo(() => {
    return allPatients.filter((p) => {
      // Search
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus = statusFilter === 'ALL' || p.riskStatus === statusFilter;

      // Location
      let matchesLocation = true;
      if (locationFilter === 'HOME') {
        matchesLocation = p.room.toLowerCase().includes('home');
      } else if (locationFilter === 'WARD') {
        matchesLocation = p.room.toLowerCase().includes('ward');
      } else if (locationFilter === 'ICU') {
        matchesLocation = p.room.toLowerCase().includes('icu');
      }

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [allPatients, searchQuery, statusFilter, locationFilter]);

  const handleOpen360 = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIs360ModalOpen(true);
  };

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

  return (
    <div className="space-y-6">
      {/* Top Clinical Triage Header (Natural Tones) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Doctor Clinical Command & Triage Console
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  AI-prioritized continuous telemetry for 24 monitored patients across Home Care & Hospital Beds
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="export-clinical-summary-btn"
              onClick={() => alert('Exporting Clinical Telemetry Summary for 24 Patients (PDF/HL7)...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Triage Report</span>
            </button>

            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Auto-Priority Queue: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Analytical Cards (Natural Tones) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Monitored
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-800">{stats.total}</div>
          <p className="text-[11px] text-slate-400 mt-1">16 Home Care · 8 Hospital Ward</p>
        </div>

        {/* Critical Priority */}
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-5 bg-red-50/25">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-red-700 flex items-center gap-1">
              Critical Urgency
            </span>
            <div className="p-2 rounded-xl bg-red-100 text-red-600 animate-pulse">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-red-600">{stats.critical}</div>
          <p className="text-[11px] text-red-600/80 font-semibold mt-1">
            Immediate physician action required
          </p>
        </div>

        {/* At Risk */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-5 bg-amber-50/25">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              At Risk / Elevated
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-amber-700">{stats.atRisk}</div>
          <p className="text-[11px] text-amber-700/80 font-medium mt-1">Close observation & nurse checks</p>
        </div>

        {/* Stable */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Stable
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-teal-600">{stats.stable}</div>
          <p className="text-[11px] text-slate-400 mt-1">Within expected personal baselines</p>
        </div>
      </div>

      {/* Risk Distribution Visualizer Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2.5">
          <span className="uppercase tracking-wider text-slate-400 text-[11px]">Cohort Risk Distribution (24 Patients)</span>
          <span className="text-slate-500 font-medium">
            Critical: {Math.round((stats.critical / stats.total) * 100)}% | At Risk: {Math.round((stats.atRisk / stats.total) * 100)}% | Stable: {Math.round((stats.stable / stats.total) * 100)}%
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-red-500 h-full transition-all duration-500"
            style={{ width: `${(stats.critical / stats.total) * 100}%` }}
            title={`Critical: ${stats.critical}`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${(stats.atRisk / stats.total) * 100}%` }}
            title={`At Risk: ${stats.atRisk}`}
          />
          <div
            className="bg-teal-500 h-full transition-all duration-500"
            style={{ width: `${(stats.stable / stats.total) * 100}%` }}
            title={`Stable: ${stats.stable}`}
          />
        </div>
      </div>

      {/* Priority Patient Queue Table & Filters (Natural Tones) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/40">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="doctor-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, ward/room, or diagnosis..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 text-xs">
              {(['ALL', 'CRITICAL', 'HIGH RISK', 'ELEVATED', 'STABLE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() =>
                    setStatusFilter(
                      st === 'STABLE' ? 'NORMAL' : (st as any)
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    (st === 'STABLE' && (statusFilter === 'NORMAL' || statusFilter === 'MONITORING')) ||
                    statusFilter === st
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Location Filter */}
            <div className="flex items-center rounded-xl bg-white border border-slate-200 p-0.5 text-xs">
              {(['ALL', 'HOME', 'WARD', 'ICU'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    locationFilter === loc
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Priority Queue Notice */}
        {patient.priorityRank === 1 && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center justify-between text-xs text-red-900 animate-pulse">
            <div className="flex items-center gap-2 font-bold">
              <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                TRIAGE OVERRIDE: Rajesh Sharma automatically elevated to Priority #1 due to critical biometric trigger (Score: {patient.riskScore}/100)
              </span>
            </div>
            <button
              onClick={() => handleOpen360(patient.id)}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer text-xs"
            >
              Open 360° Now
            </button>
          </div>
        )}

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Patient & Diagnosis</th>
                <th className="px-5 py-3.5">Location / Ward</th>
                <th className="px-5 py-3.5">Heart Rate</th>
                <th className="px-5 py-3.5">SpO2</th>
                <th className="px-5 py-3.5">Body Temp</th>
                <th className="px-5 py-3.5">AI Risk Score</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((pt) => {
                const isRajesh = pt.id === patient.id;
                const isPriority1 = pt.priorityRank === 1;

                return (
                  <tr
                    key={pt.id}
                    className={`transition hover:bg-slate-50/80 ${
                      isRajesh && (pt.riskStatus === 'CRITICAL' || pt.riskStatus === 'HIGH RISK')
                        ? 'bg-red-50/50 font-medium'
                        : isRajesh
                        ? 'bg-teal-50/30'
                        : ''
                    }`}
                  >
                    {/* Priority Rank */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black ${
                          isPriority1
                            ? 'bg-red-600 text-white shadow-xs animate-bounce'
                            : pt.priorityRank <= 3
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{pt.priorityRank}
                      </span>
                    </td>

                    {/* Patient Name & Condition */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isRajesh
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pt.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{pt.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({pt.age}y, {pt.gender[0]})
                            </span>
                            {isRajesh && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-100">
                                Primary
                              </span>
                            )}
                            {pt.fallDetected && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-extrabold animate-pulse">
                                FALL
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {pt.condition}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        {pt.room.toLowerCase().includes('home') ? (
                          <Home className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate max-w-[140px]">{pt.room}</span>
                      </span>
                    </td>

                    {/* HR */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`font-mono font-bold ${
                          pt.vitals.heartRate > 100
                            ? 'text-red-600'
                            : pt.vitals.heartRate > 85
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {pt.vitals.heartRate}{' '}
                        <span className="text-[10px] font-normal text-slate-400">bpm</span>
                      </span>
                    </td>

                    {/* SpO2 */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`font-mono font-bold ${
                          pt.vitals.spo2 < 93
                            ? 'text-red-600'
                            : pt.vitals.spo2 < 96
                            ? 'text-amber-600'
                            : 'text-teal-600'
                        }`}
                      >
                        {pt.vitals.spo2}%
                      </span>
                    </td>

                    {/* Temp */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`font-mono font-bold ${
                          pt.vitals.bodyTemp >= 38
                            ? 'text-red-600'
                            : pt.vitals.bodyTemp > 37.3
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {pt.vitals.bodyTemp}°C
                      </span>
                    </td>

                    {/* AI Risk Score */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-black text-xs ${
                            pt.riskScore >= 75
                              ? 'text-red-600'
                              : pt.riskScore >= 45
                              ? 'text-amber-600'
                              : 'text-teal-700'
                          }`}
                        >
                          {pt.riskScore}
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              pt.riskScore >= 75
                                ? 'bg-red-500'
                                : pt.riskScore >= 45
                                ? 'bg-amber-500'
                                : 'bg-teal-500'
                            }`}
                            style={{ width: `${pt.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          pt.riskStatus
                        )}`}
                      >
                        {pt.riskStatus}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        id={`open-360-${pt.id}`}
                        onClick={() => handleOpen360(pt.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 font-bold text-xs transition cursor-pointer shadow-2xs"
                      >
                        <span>Open 360°</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
