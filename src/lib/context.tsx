"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Heart, Syringe, Sparkles, FileText } from "lucide-react";

export type Event = { id: string; date: string; title: string; type: string; description: string; iconName: string; color: string; attachments: number; };
export type Vaccination = { id: string; name: string; date: string; nextDue: string; status: string; vet: string; };
export type Deworming = { id: string; product: string; date: string; nextDue: string; status: string; weight: string; };
export type Medication = { id: string; name: string; dose: string; frequency: string; condition: string; status: string; };
export type Document = { id: string; name: string; category: string; type: string; size: string; date: string; dataUrl?: string; };
export type GrowthLog = { id: string; date: string; weight: number; };
export type Profile = { name: string; breed: string; microchip: string; reg: string; dob: string; gender: string; avatarUrl?: string; };
export type Memory = { id: string; imageBase64: string; date: string; age: string; caption: string; };

interface PixieContextType {
  events: Event[]; setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  vaccinations: Vaccination[]; setVaccinations: React.Dispatch<React.SetStateAction<Vaccination[]>>;
  deworming: Deworming[]; setDeworming: React.Dispatch<React.SetStateAction<Deworming[]>>;
  medications: Medication[]; setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  documents: Document[]; setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  growthData: GrowthLog[]; setGrowthData: React.Dispatch<React.SetStateAction<GrowthLog[]>>;
  profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  memories: Memory[]; setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  isLoaded: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const PixieContext = createContext<PixieContextType | undefined>(undefined);

const defaultEvents = [
  { id: "e1", date: "Jun 12, 2026", title: "First Day Home", type: "milestone", description: "Pixie joined our family today!", iconName: "Heart", color: "bg-rose-100 text-rose-600", attachments: 0 },
  { id: "e2", date: "May 26, 2026", title: "Microchipped", type: "health", description: "Microchip implanted and registered with KCI.", iconName: "Syringe", color: "bg-amber-100 text-amber-600", attachments: 0 },
  { id: "e3", date: "May 26, 2026", title: "First Vaccination", type: "health", description: "Nobivac DHPPi administered.", iconName: "Syringe", color: "bg-amber-100 text-amber-600", attachments: 1 },
  { id: "e4", date: "Apr 10, 2026", title: "Born", type: "milestone", description: "Pixie was born! A healthy English Golden Retriever pup.", iconName: "Sparkles", color: "bg-orange-100 text-orange-600", attachments: 0 }
];

const defaultVaccinations = [
  { id: "v1", name: "Nobivac DHPPI", date: "Jun 04, 2026", nextDue: "Jun 25, 2026", status: "Completed", vet: "Dr Yatish Gowda" },
  { id: "v2", name: "Nobivac L4", date: "Jun 04, 2026", nextDue: "None", status: "Completed", vet: "Dr Yatish Gowda" },
  { id: "v3", name: "Rabies Booster", date: "-", nextDue: "Sep 25, 2026", status: "Upcoming", vet: "-" },
];

const defaultDeworming = [
  { id: "d1", product: "Drontal Plus", date: "May 26, 2026", nextDue: "Jun 25, 2026", status: "Completed", weight: "3.2 kg" },
];

const defaultMedications = [
  { id: "m1", name: "Digyton Plus", dose: "10 drops", frequency: "Twice daily", condition: "Eye Swelling", status: "Active" },
];

const defaultDocuments = [
  { id: "doc1", name: "Nobivac_Certificate_Jun2026.pdf", category: "Vaccinations", type: "pdf", size: "1.2 MB", date: "Jun 04, 2026" },
  { id: "doc2", name: "Digyton_Prescription.jpg", category: "Prescriptions", type: "image", size: "845 KB", date: "Jun 12, 2026" },
  { id: "doc3", name: "KCI_Registration.pdf", category: "Registration", type: "pdf", size: "2.1 MB", date: "May 26, 2026" },
];

const defaultGrowth = [
  { id: "g1", date: "Apr 10", weight: 0.5 },
  { id: "g2", date: "Apr 25", weight: 1.2 },
  { id: "g3", date: "May 10", weight: 2.1 },
  { id: "g4", date: "May 26", weight: 3.2 },
  { id: "g5", date: "Jun 04", weight: 4.8 },
  { id: "g6", date: "Jun 12", weight: 5.2 },
];

const defaultProfile = {
  name: "Pixie", breed: "English Golden Retriever", microchip: "981020000123456", reg: "KCI-2026-ENG-0987", dob: "2026-04-10", gender: "Female"
};

const defaultMemories: Memory[] = [
  { id: "mem1", imageBase64: "/pixie.jpg", date: "Apr 10, 2026", age: "0 Weeks", caption: "The day I was born! A little golden potato." },
  { id: "mem2", imageBase64: "/pixie.jpg", date: "Jun 12, 2026", age: "8 Weeks", caption: "Coming home with my new family." }
];

export function PixieProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(defaultVaccinations);
  const [deworming, setDeworming] = useState<Deworming[]>(defaultDeworming);
  const [medications, setMedications] = useState<Medication[]>(defaultMedications);
  const [documents, setDocuments] = useState<Document[]>(defaultDocuments);
  const [growthData, setGrowthData] = useState<GrowthLog[]>(defaultGrowth);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [memories, setMemories] = useState<Memory[]>(defaultMemories);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  // Load from local storage and register SW on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
    }

    try {
      const stored = localStorage.getItem('pixie_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setEvents(parsed.events || defaultEvents);
        setVaccinations(parsed.vaccinations || defaultVaccinations);
        setDeworming(parsed.deworming || defaultDeworming);
        setMedications(parsed.medications || defaultMedications);
        setDocuments(parsed.documents || defaultDocuments);
        setGrowthData(parsed.growthData || defaultGrowth);
        setProfile(parsed.profile || defaultProfile);
        setMemories(parsed.memories || defaultMemories);
        setIsAuthenticated(parsed.isAuthenticated || false);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('pixie_data', JSON.stringify({
      events, vaccinations, deworming, medications, documents, growthData, profile, memories, isAuthenticated
    }));
  }, [events, vaccinations, deworming, medications, documents, growthData, profile, memories, isAuthenticated, isLoaded]);

  return (
    <PixieContext.Provider value={{
      events, setEvents,
      vaccinations, setVaccinations,
      deworming, setDeworming,
      medications, setMedications,
      documents, setDocuments,
      growthData, setGrowthData,
      profile, setProfile,
      memories, setMemories,
      isLoaded,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </PixieContext.Provider>
  );
}

export function usePixie() {
  const context = useContext(PixieContext);
  if (context === undefined) {
    throw new Error("usePixie must be used within a PixieProvider");
  }
  return context;
}

export function getIcon(iconName: string) {
  switch (iconName) {
    case 'Syringe': return Syringe;
    case 'FileText': return FileText;
    case 'Sparkles': return Sparkles;
    default: return Heart;
  }
}
