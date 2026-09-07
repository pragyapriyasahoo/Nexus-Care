import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import {
  Patient,
  Vitals,
  Environment,
  HealthStatus,
  Alert,
  Medication,
  VionexMessage,
  HistoricalPoint,
  UserRole,
  Language,
} from '../types';
import {
  INITIAL_RAJESH_SHARMA,
  INITIAL_MEDICATIONS,
  INITIAL_MESSAGES,
  INITIAL_HISTORY,
  OTHER_PATIENTS,
  PRIMARY_PATIENT_ID,
} from '../data/mockPatients';

// Heat stress stages definition
export interface HeatStressStageData {
  hr: number;
  ambTemp: number;
  humidity: number;
  risk: number;
  status: HealthStatus;
  bodyTemp: number;
  spo2: number;
}

export const HEAT_STRESS_STAGES: HeatStressStageData[] = [
  { hr: 82, ambTemp: 32, humidity: 52, risk: 22, status: 'NORMAL', bodyTemp: 36.8, spo2: 98 },
  { hr: 88, ambTemp: 34, humidity: 55, risk: 38, status: 'MONITORING', bodyTemp: 37.1, spo2: 97 },
  { hr: 96, ambTemp: 38, humidity: 65, risk: 52, status: 'ELEVATED', bodyTemp: 37.5, spo2: 96 },
  { hr: 104, ambTemp: 40, humidity: 72, risk: 68, status: 'HIGH RISK', bodyTemp: 38.1, spo2: 95 },
  { hr: 112, ambTemp: 42, humidity: 78, risk: 82, status: 'CRITICAL', bodyTemp: 38.8, spo2: 94 },
];

export interface FallEventState {
  isActive: boolean;
  stage: 'impact_detected' | 'awaiting_response' | 'critical_unresponsive' | 'resolved';
  countdown: number;
  impactG: number;
  confidence: number;
  timestamp: string;
}

interface HealthContextType {
  // Navigation & Preferences
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  is360ModalOpen: boolean;
  setIs360ModalOpen: (open: boolean) => void;

  // Primary Patient (Rajesh Sharma)
  patient: Patient;
  history: HistoricalPoint[];
  medications: Medication[];
  toggleMedication: (id: string) => void;
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  vionexMessages: VionexMessage[];
  sendVionexMessage: (text: string, textHi?: string) => void;

  // Doctor Patient List
  allPatients: Patient[];
  getPatientById: (id: string) => Patient | undefined;

  // Simulation State & Controls
  isLiveSimulation: boolean;
  toggleLiveSimulation: () => void;
  isHeatStressActive: boolean;
  heatStressStep: number;
  startHeatStressSimulation: () => void;
  pauseHeatStressSimulation: () => void;
  setHeatStressStage: (step: number) => void;

  // Emergency Fall
  fallState: FallEventState;
  triggerSimulateFall: () => void;
  respondPatientSafe: () => void;
  dispatchEmergencyServices: () => void;
  resetToBaseline: () => void;

  // Control Bar
  isControlBarCollapsed: boolean;
  setIsControlBarCollapsed: (collapsed: boolean) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('caregiver');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(PRIMARY_PATIENT_ID);
  const [is360ModalOpen, setIs360ModalOpen] = useState<boolean>(false);
  const [isControlBarCollapsed, setIsControlBarCollapsed] = useState<boolean>(false);

  // Rajesh Sharma Primary State
  const [patient, setPatient] = useState<Patient>(INITIAL_RAJESH_SHARMA);
  const [history, setHistory] = useState<HistoricalPoint[]>(INITIAL_HISTORY);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alt-init-1',
      timestamp: '12:30 PM',
      type: 'environmental',
      severity: 'info',
      title: 'Ambient Temperature Advisory',
      description: 'Room temperature rising above 30°C. Air circulation advised for elderly resident.',
      descriptionHi: 'कमरे का तापमान 30°C से ऊपर जा रहा है। हवा का संचार बनाए रखने की सलाह दी जाती है।',
      acknowledged: false,
      patientId: PRIMARY_PATIENT_ID,
    },
  ]);
  const [vionexMessages, setVionexMessages] = useState<VionexMessage[]>(INITIAL_MESSAGES);

  // Other Patients List (Total 24)
  const [otherPatients] = useState<Patient[]>(OTHER_PATIENTS);

  // Simulation Controls
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(true);
  const [isHeatStressActive, setIsHeatStressActive] = useState<boolean>(false);
  const [heatStressStep, setHeatStressStep] = useState<number>(0);

  // Fall Event State
  const [fallState, setFallState] = useState<FallEventState>({
    isActive: false,
    stage: 'resolved',
    countdown: 15,
    impactG: 3.8,
    confidence: 94,
    timestamp: '',
  });

  const countdownIntervalRef = useRef<number | null>(null);

  // Live Jitter Simulation (gentle realistic vitals fluctuation when live is ON and not in high heat)
  useEffect(() => {
    if (!isLiveSimulation || isHeatStressActive || fallState.isActive) return;

    const interval = window.setInterval(() => {
      setPatient((prev) => {
        const hrOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const newHr = Math.max(68, Math.min(80, prev.vitals.heartRate + hrOffset));
        return {
          ...prev,
          vitals: {
            ...prev.vitals,
            heartRate: newHr,
          },
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveSimulation, isHeatStressActive, fallState.isActive]);

  // Heat Stress Multi-step progression
  useEffect(() => {
    if (!isHeatStressActive) return;

    const stepInterval = window.setInterval(() => {
      setHeatStressStep((currentStep) => {
        const nextStep = currentStep + 1;
        if (nextStep >= HEAT_STRESS_STAGES.length) {
          return currentStep; // stay at maximum critical step
        }
        applyHeatStressStage(nextStep);
        return nextStep;
      });
    }, 3500);

    return () => clearInterval(stepInterval);
  }, [isHeatStressActive]);

  const applyHeatStressStage = (stepIndex: number) => {
    const data = HEAT_STRESS_STAGES[stepIndex];
    if (!data) return;

    setPatient((prev) => {
      const updatedVitals: Vitals = {
        ...prev.vitals,
        heartRate: data.hr,
        bodyTemp: data.bodyTemp,
        spo2: data.spo2,
        bloodPressureSys: 128 + stepIndex * 5,
        bloodPressureDia: 82 + stepIndex * 3,
        activity: stepIndex >= 3 ? 'Restless' : 'Resting',
      };

      const updatedEnv: Environment = {
        ...prev.environment,
        temperature: data.ambTemp,
        humidity: data.humidity,
        aqi: Math.min(220, 142 + stepIndex * 15),
        status: data.ambTemp >= 38 ? 'Hazardous' : data.ambTemp >= 34 ? 'Poor' : 'Moderate',
      };

      // Rajesh priority rank improves as severity increases
      // Step 0: rank 16, Step 1: rank 12, Step 2: rank 5, Step 3: rank 2, Step 4: rank 1
      const rank = stepIndex === 4 ? 1 : stepIndex === 3 ? 2 : stepIndex === 2 ? 5 : stepIndex === 1 ? 12 : 16;

      return {
        ...prev,
        vitals: updatedVitals,
        environment: updatedEnv,
        riskScore: data.risk,
        riskStatus: data.status,
        priorityRank: rank,
        lastCheckIn: 'Just now',
      };
    });

    // Append to live chart history
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => [
      ...prev.slice(-9), // keep last 10 points
      {
        time: nowTime,
        heartRate: data.hr,
        spo2: data.spo2,
        bodyTemp: data.bodyTemp,
        ambientTemp: data.ambTemp,
        humidity: data.humidity,
        riskScore: data.risk,
      },
    ]);

    // Create dynamic alerts depending on step
    if (stepIndex === 2) {
      addSystemAlert({
        type: 'heat_stress',
        severity: 'warning',
        title: 'Elevated Ambient Heat & HR Increase',
        description: `Ambient temperature reached ${data.ambTemp}°C. Patient heart rate elevated to ${data.hr} bpm. Hydration alert dispatched.`,
        descriptionHi: `कमरे का तापमान ${data.ambTemp}°C तक पहुँच गया है। हृदय गति बढ़कर ${data.hr} बीपीएम हो गई है। ओआरएस पीने की सलाह।`,
      });
      addVionexMessage(
        `Rajesh ji, the ambient heat is high (${data.ambTemp}°C). Please turn on the air cooler and stay seated.`,
        `राजेश जी, कमरे का तापमान बढ़ रहा है (${data.ambTemp}°C)। कृपया कूलर चलाएं और आराम से बैठें।`
      );
    } else if (stepIndex === 4) {
      addSystemAlert({
        type: 'heat_stress',
        severity: 'critical',
        title: 'Critical Heat-Exhaustion Warning',
        description: `CRITICAL: Severe ambient heat (${data.ambTemp}°C) with core body temp ${data.bodyTemp}°C and HR ${data.hr} bpm. High risk of hyperthermia!`,
        descriptionHi: `अति गंभीर: अत्यधिक गर्मी (${data.ambTemp}°C) और शरीर का तापमान ${data.bodyTemp}°C। तुरंत ठंडा पानी व डॉक्टर से परामर्श आवश्यक!`,
      });
      addVionexMessage(
        `EMERGENCY ADVISORY: Critical heat stress detected. Caregiver notified for immediate cold sponge compress and hydration.`,
        `आपातकालीन सूचना: अत्यधिक हीट-स्ट्रेस दर्ज हुआ है। देखभालकर्ता को तुरंत सूचित किया गया है।`
      );
    }
  };

  const startHeatStressSimulation = () => {
    setIsHeatStressActive(true);
    setHeatStressStep(0);
    applyHeatStressStage(0);
  };

  const pauseHeatStressSimulation = () => {
    setIsHeatStressActive(false);
  };

  const setHeatStressStage = (step: number) => {
    const validStep = Math.max(0, Math.min(HEAT_STRESS_STAGES.length - 1, step));
    setHeatStressStep(validStep);
    applyHeatStressStage(validStep);
  };

  // Helper for adding alerts
  const addSystemAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'acknowledged' | 'patientId'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acknowledged: false,
      patientId: PRIMARY_PATIENT_ID,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const addVionexMessage = (text: string, textHi?: string, sender: 'vionex' | 'patient' | 'caregiver' = 'vionex') => {
    const newMsg: VionexMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      textHi: textHi || text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setVionexMessages((prev) => [...prev, newMsg]);
  };

  // Trigger Fall Simulation Flow
  const triggerSimulateFall = () => {
    setIsHeatStressActive(false);

    const fallTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Immediate impact detection
    setFallState({
      isActive: true,
      stage: 'awaiting_response',
      countdown: 15,
      impactG: 3.8,
      confidence: 94,
      timestamp: fallTimestamp,
    });

    // Update Rajesh Sharma vitals per specification:
    // Sudden impact detection, HR 112, SpO2 94%, AI confidence 94%
    // VIONEX asks: "I detected a possible fall. Are you okay?"
    setPatient((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        heartRate: 112,
        spo2: 94,
        bodyTemp: 37.2,
        activity: 'Post-Fall Immobility',
      },
      riskScore: 94,
      riskStatus: 'CRITICAL',
      priorityRank: 1, // Rajesh instantly shifts to Priority #1 in doctor queue!
      fallDetected: true,
      lastCheckIn: 'Emergency Alert',
    }));

    // Add Vionex fall dialogue
    addVionexMessage(
      'VIONEX SENSOR: Sudden impact detected (3.8G). Rajesh ji, I detected a possible fall. Are you okay? Please respond.',
      'वियोनेक्स सेंसर: तेज झटका दर्ज हुआ (3.8G)। राजेश जी, क्या आप गिर गए हैं? क्या आप ठीक हैं? कृपया उत्तर दें।',
      'vionex'
    );

    // Add immediate high-priority alert
    addSystemAlert({
      type: 'fall',
      severity: 'critical',
      title: 'Sudden Fall Impact Detected (3.8G)',
      description: 'High deceleration impact registered in Living Room. VIONEX initiating emergency verbal check-in.',
      descriptionHi: 'कमरे में अचानक गिरने का प्रभाव दर्ज किया गया (3.8G)। वियोनेक्स द्वारा आपातकालीन सुरक्षा जांच शुरू।',
    });

    // Start 15s countdown for simulated "No response"
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    let currentCountdown = 15;
    countdownIntervalRef.current = window.setInterval(() => {
      currentCountdown -= 1;
      setFallState((prev) => {
        if (!prev.isActive) return prev;
        if (currentCountdown <= 0) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          handleFallUnresponsive();
          return {
            ...prev,
            countdown: 0,
            stage: 'critical_unresponsive',
          };
        }
        return {
          ...prev,
          countdown: currentCountdown,
        };
      });
    }, 1000);
  };

  const handleFallUnresponsive = () => {
    // Simulated no response triggers critical alert & escalation
    addVionexMessage(
      'PATIENT UNRESPONSIVE: No verbal or motion response within 15 seconds. Critical escalation triggered. Dispatching emergency notification to Caregiver & Doctor Priority Queue #1.',
      'मरीज अनुत्तरदायी: 15 सेकंड में कोई जवाब नहीं। देखभालकर्ता और अस्पताल को आपातकालीन अलर्ट भेजा गया।',
      'vionex'
    );

    addSystemAlert({
      type: 'fall',
      severity: 'critical',
      title: 'CRITICAL EMERGENCY: Unresponsive Fall Event',
      description: 'Patient unresponsive to voice prompts. HR 112 bpm, SpO2 94%, AI Confidence 94%. Immediate assistance required!',
      descriptionHi: 'अति आपातकाल: मरीज बोलने में असमर्थ। हृदय गति 112, ऑक्सीजन 94%। तुरंत एम्बुलेंस व सहायता आवश्यक!',
    });
  };

  const respondPatientSafe = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setFallState((prev) => ({
      ...prev,
      isActive: false,
      stage: 'resolved',
    }));
    setPatient((prev) => ({
      ...prev,
      fallDetected: false,
      riskScore: 35,
      riskStatus: 'MONITORING',
      priorityRank: 8,
      vitals: {
        ...prev.vitals,
        heartRate: 84,
        activity: 'Resting',
      },
    }));
    addVionexMessage(
      'Patient confirmed safe / Caregiver acknowledged. Heart rate recovering to 84 bpm. Status reset to Monitoring.',
      'मरीज ने ठीक होने की पुष्टि की। हृदय गति 84 बीपीएम पर स्थिर हो रही है।',
      'patient'
    );
  };

  const dispatchEmergencyServices = () => {
    addSystemAlert({
      type: 'fall',
      severity: 'critical',
      title: 'Ambulance & Paramedics Dispatched',
      description: 'Emergency Services 108 dispatched to Flat 402, Rohini Sector 14. Estimated arrival: 7 minutes.',
      descriptionHi: 'एम्बुलेंस (108) रवाना कर दी गई है। पहुंचने का अनुमानित समय: 7 मिनट।',
    });
    addVionexMessage(
      'Emergency SOS Dispatch confirmed. Nearest trauma vehicle en-route to Rohini Sector 14. Live vitals stream linked to EMS unit.',
      'आपातकालीन एम्बुलेंस रवाना हो चुकी है। लाइव वाइटल्स अस्पताल से जुड़े हैं।',
      'vionex'
    );
  };

  const resetToBaseline = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsHeatStressActive(false);
    setHeatStressStep(0);
    setFallState({
      isActive: false,
      stage: 'resolved',
      countdown: 15,
      impactG: 3.8,
      confidence: 94,
      timestamp: '',
    });
    setPatient(INITIAL_RAJESH_SHARMA);
    setHistory(INITIAL_HISTORY);
    addVionexMessage(
      'System restored to baseline conditions. Rajesh Sharma: HR 74 bpm, Normal heat index, No active falls.',
      'प्रणाली सामान्य स्थिति में रीसेट हो गई है। राजेश शर्मा: हृदय गति 74 बीपीएम, सामान्य स्थिति।',
      'vionex'
    );
  };

  const toggleLiveSimulation = () => {
    setIsLiveSimulation((prev) => !prev);
  };

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const sendVionexMessage = (text: string, textHi?: string) => {
    addVionexMessage(text, textHi, 'caregiver');

    // Simulate smart AI response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let response = "I have noted that. Rajesh ji's current vitals are within stable thresholds.";
      let responseHi = "मैंने नोट कर लिया है। राजेश जी के सभी वाइटल्स इस समय सामान्य सीमा में हैं।";

      if (lower.includes('medicine') || lower.includes('medication') || lower.includes('दवा')) {
        response = "Rajesh ji took his morning Amlodipine (5mg) and afternoon ORS. Evening Telmisartan is scheduled for 8:30 PM.";
        responseHi = "राजेश जी ने सुबह की एम्लोडिपिन और दोपहर का ओआरएस ले लिया है। शाम की टेलमिसार्टन रात 8:30 बजे निर्धारित है।";
      } else if (lower.includes('water') || lower.includes('hydration') || lower.includes('पानी')) {
        response = "Fluid intake today is approximately 1.4 liters. With current ambient temperatures, we recommend another 500ml before 6 PM.";
        responseHi = "आज लगभग 1.4 लीटर तरल पदार्थ लिया गया है। मौजूदा तापमान में शाम 6 बजे से पहले और 500 मिलीलीटर पानी की सलाह दी जाती है।";
      } else if (lower.includes('bp') || lower.includes('pressure') || lower.includes('बीपी')) {
        response = `Latest blood pressure reading is ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg. Heart rate is ${patient.vitals.heartRate} bpm.`;
        responseHi = `ताज़ा ब्लड प्रेशर ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg है और हृदय गति ${patient.vitals.heartRate} बीपीएम है।`;
      } else if (lower.includes('how is') || lower.includes('doing') || lower.includes('तबियत')) {
        response = `Rajesh ji is currently ${patient.vitals.activity.toLowerCase()} in the living room. Overall AI Risk Index is ${patient.riskScore}/100 (${patient.riskStatus}).`;
        responseHi = `राजेश जी इस समय लिविंग रूम में आराम कर रहे हैं। समग्र स्वास्थ्य रिस्क स्कोर ${patient.riskScore}/100 (${patient.riskStatus}) है।`;
      }

      addVionexMessage(response, responseHi, 'vionex');
    }, 600);
  };

  // Dynamically compute the Doctor's 24 patients list
  // IMPORTANT: When Rajesh is in critical condition (fall or high heat stress), he dynamically sorts to Priority #1!
  const allPatients = useMemo<Patient[]>(() => {
    const list = [patient, ...otherPatients];

    // Dynamic sort:
    // Priority #1: Active Fall or Critical status with highest risk score
    return list.sort((a, b) => {
      if (a.fallDetected && !b.fallDetected) return -1;
      if (!a.fallDetected && b.fallDetected) return 1;
      if (b.riskScore !== a.riskScore) {
        return b.riskScore - a.riskScore;
      }
      return a.priorityRank - b.priorityRank;
    }).map((p, idx) => ({
      ...p,
      priorityRank: idx + 1,
    }));
  }, [patient, otherPatients]);

  const getPatientById = (id: string): Patient | undefined => {
    if (id === PRIMARY_PATIENT_ID) return patient;
    return otherPatients.find((p) => p.id === id);
  };

  return (
    <HealthContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        selectedPatientId,
        setSelectedPatientId,
        is360ModalOpen,
        setIs360ModalOpen,
        patient,
        history,
        medications,
        toggleMedication,
        alerts,
        acknowledgeAlert,
        vionexMessages,
        sendVionexMessage,
        allPatients,
        getPatientById,
        isLiveSimulation,
        toggleLiveSimulation,
        isHeatStressActive,
        heatStressStep,
        startHeatStressSimulation,
        pauseHeatStressSimulation,
        setHeatStressStage,
        fallState,
        triggerSimulateFall,
        respondPatientSafe,
        dispatchEmergencyServices,
        resetToBaseline,
        isControlBarCollapsed,
        setIsControlBarCollapsed,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
