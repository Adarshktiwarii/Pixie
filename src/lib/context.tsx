"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Heart, Syringe, Sparkles, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Types
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

const defaultProfile = {
  name: "Pixie", breed: "English Golden Retriever", microchip: "981020000123456", reg: "KCI-2026-ENG-0987", dob: "2026-04-10", gender: "Female"
};

// Generic sync hook
function useSyncTable<T extends { id: string }>(
  tableName: string, 
  data: T[], 
  user: any, 
  isLoaded: boolean, 
  mapToDb: (item: T) => any
) {
  const prevRef = useRef(data);
  const supabase = createClient();
  
  useEffect(() => {
    if (!isLoaded || !user) return;
    const prev = prevRef.current;
    if (prev === data) return;
    
    const newIds = new Set(data.map(item => item.id));
    const deletedItems = prev.filter(item => !newIds.has(item.id));
    
    const oldMap = new Map(prev.map(i => [i.id, i]));
    const toUpsert = data.filter(item => JSON.stringify(item) !== JSON.stringify(oldMap.get(item.id)));
    
    if (deletedItems.length > 0) {
      supabase.from(tableName).delete().in('id', deletedItems.map(d => d.id)).then();
    }
    if (toUpsert.length > 0) {
      const upserts = toUpsert.map(item => ({ ...mapToDb(item), user_id: user.id }));
      supabase.from(tableName).upsert(upserts).then();
    }
    
    prevRef.current = data;
  }, [data, user, isLoaded, tableName]);

  return (loadedData: T[]) => {
    prevRef.current = loadedData;
  };
}

export function PixieProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [deworming, setDeworming] = useState<Deworming[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [growthData, setGrowthData] = useState<GrowthLog[]>([]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [memories, setMemories] = useState<Memory[]>([]);
  
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;

  const supabase = createClient();

  // Sync Hooks
  const resetEvents = useSyncTable('events', events, user, isLoaded, (item) => ({
    id: item.id, date: item.date, title: item.title, type: item.type, description: item.description, icon_name: item.iconName, color: item.color, attachments: item.attachments
  }));
  const resetVaccinations = useSyncTable('vaccinations', vaccinations, user, isLoaded, (item) => ({
    id: item.id, name: item.name, date: item.date, next_due: item.nextDue, status: item.status, vet: item.vet
  }));
  const resetDeworming = useSyncTable('deworming', deworming, user, isLoaded, (item) => ({
    id: item.id, product: item.product, date: item.date, next_due: item.nextDue, status: item.status, weight: item.weight
  }));
  const resetMedications = useSyncTable('medications', medications, user, isLoaded, (item) => ({
    id: item.id, name: item.name, dose: item.dose, frequency: item.frequency, condition: item.condition, status: item.status
  }));
  const resetDocuments = useSyncTable('documents', documents, user, isLoaded, (item) => ({
    id: item.id, name: item.name, category: item.category, type: item.type, size: item.size, date: item.date, file_url: item.dataUrl || ""
  }));
  const resetGrowthData = useSyncTable('growth_logs', growthData, user, isLoaded, (item) => ({
    id: item.id, date: item.date, weight: item.weight
  }));
  const resetMemories = useSyncTable('memories', memories, user, isLoaded, (item) => ({
    id: item.id, image_url: item.imageBase64, date: item.date, age: item.age, caption: item.caption
  }));

  // Profile Sync
  const prevProfile = useRef(profile);
  useEffect(() => {
    if (!isLoaded || !user) return;
    if (JSON.stringify(prevProfile.current) === JSON.stringify(profile)) return;
    
    supabase.from('profiles').upsert({
      user_id: user.id,
      name: profile.name, breed: profile.breed, microchip: profile.microchip, reg: profile.reg, dob: profile.dob, gender: profile.gender, avatar_url: profile.avatarUrl
    }).then();
    
    prevProfile.current = profile;
  }, [profile, user, isLoaded]);

  // Auth & Data Loading
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW registration failed: ', err));
    }

    const loadData = async (sessionUser: any) => {
      setIsLoaded(false);
      setUser(sessionUser);

      if (sessionUser) {
        const [
          { data: evt }, { data: vax }, { data: dew }, { data: med }, 
          { data: doc }, { data: gro }, { data: mem }, { data: prof }
        ] = await Promise.all([
          supabase.from('events').select('*'),
          supabase.from('vaccinations').select('*'),
          supabase.from('deworming').select('*'),
          supabase.from('medications').select('*'),
          supabase.from('documents').select('*'),
          supabase.from('growth_logs').select('*'),
          supabase.from('memories').select('*'),
          supabase.from('profiles').select('*').eq('user_id', sessionUser.id).maybeSingle()
        ]);

        const mappedEvt = (evt || []).map(d => ({ id: d.id, date: d.date, title: d.title, type: d.type, description: d.description, iconName: d.icon_name, color: d.color, attachments: d.attachments }));
        const mappedVax = (vax || []).map(d => ({ id: d.id, name: d.name, date: d.date, nextDue: d.next_due, status: d.status, vet: d.vet }));
        const mappedDew = (dew || []).map(d => ({ id: d.id, product: d.product, date: d.date, nextDue: d.next_due, status: d.status, weight: d.weight }));
        const mappedMed = (med || []).map(d => ({ id: d.id, name: d.name, dose: d.dose, frequency: d.frequency, condition: d.condition, status: d.status }));
        const mappedDoc = (doc || []).map(d => ({ id: d.id, name: d.name, category: d.category, type: d.type, size: d.size, date: d.date, dataUrl: d.file_url }));
        const mappedGro = (gro || []).map(d => ({ id: d.id, date: d.date, weight: Number(d.weight) }));
        const mappedMem = (mem || []).map(d => ({ id: d.id, imageBase64: d.image_url, date: d.date, age: d.age, caption: d.caption }));

        setEvents(mappedEvt); resetEvents(mappedEvt);
        setVaccinations(mappedVax); resetVaccinations(mappedVax);
        setDeworming(mappedDew); resetDeworming(mappedDew);
        setMedications(mappedMed); resetMedications(mappedMed);
        setDocuments(mappedDoc); resetDocuments(mappedDoc);
        setGrowthData(mappedGro); resetGrowthData(mappedGro);
        setMemories(mappedMem); resetMemories(mappedMem);

        if (prof) {
          const loadedProfile = { name: prof.name, breed: prof.breed, microchip: prof.microchip, reg: prof.reg, dob: prof.dob, gender: prof.gender, avatarUrl: prof.avatar_url };
          setProfile(loadedProfile);
          prevProfile.current = loadedProfile;
        } else {
          // Create initial profile
          await supabase.from('profiles').insert({ user_id: sessionUser.id, ...defaultProfile });
        }
      } else {
        // Clear data on logout
        setEvents([]); setVaccinations([]); setDeworming([]); setMedications([]);
        setDocuments([]); setGrowthData([]); setMemories([]); setProfile(defaultProfile);
      }

      // Small delay to ensure state updates commit before syncing resumes
      setTimeout(() => setIsLoaded(true), 100);
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadData(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadData(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = () => { /* Now handled by Supabase Auth */ };
  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <PixieContext.Provider value={{
      events, setEvents, vaccinations, setVaccinations, deworming, setDeworming,
      medications, setMedications, documents, setDocuments, growthData, setGrowthData,
      profile, setProfile, memories, setMemories, isLoaded, isAuthenticated, login, logout
    }}>
      {children}
    </PixieContext.Provider>
  );
}

export function usePixie() {
  const context = useContext(PixieContext);
  if (context === undefined) throw new Error("usePixie must be used within a PixieProvider");
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
