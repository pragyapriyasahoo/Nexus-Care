export type UserRole = 'caregiver' | 'doctor';
export type Language = 'en' | 'hi';

export type HealthStatus = 'NORMAL' | 'MONITORING' | 'ELEVATED' | 'HIGH RISK' | 'CRITICAL';

export interface Vitals {
  heartRate: number; // bpm
  spo2: number; // percentage
  bodyTemp: number; // °C
  bloodPressureSys: number;
  bloodPressureDia: number;
  activity: 'Resting' | 'Walking' | 'Sedentary' | 'Post-Fall Immobility' | 'Restless';
}

export interface Environment {
  temperature: number; // °C
  humidity: number; // percentage
  aqi: number; // Air Quality Index
  status: 'Good' | 'Moderate' | 'Poor' | 'Hazardous';
}

export interface HistoricalPoint {
  time: string;
  heartRate: number;
  spo2: number;
  bodyTemp: number;
  ambientTemp: number;
  humidity: number;
  riskScore: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  type: 'blood_pressure' | 'hydration' | 'heart' | 'general';
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'fall' | 'heat_stress' | 'vital_spike' | 'medication_missed' | 'environmental';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  descriptionHi: string;
  acknowledged: boolean;
  patientId: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  room: string;
  condition: string;
  vitals: Vitals;
  environment: Environment;
  riskScore: number; // 0 - 100
  riskStatus: HealthStatus;
  priorityRank: number; // 1 to 24
  baseline: {
    heartRate: number;
    spo2: number;
    bodyTemp: number;
    bloodPressure: string;
  };
  lastCheckIn: string;
  fallDetected?: boolean;
}

export interface VionexMessage {
  id: string;
  sender: 'vionex' | 'patient' | 'caregiver';
  text: string;
  textHi: string;
  timestamp: string;
  isAlert?: boolean;
}

export type HeatStressStep = 0 | 1 | 2 | 3 | 4; // 5 stages (0 through 4)
