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
export type Profile = { name: string; breed: string; microchip: string; reg: string; dob: string; gender: string; avatarUrl?: string; bloodGroup?: string; };
export type Memory = { id: string; imageBase64: string; date: string; age: string; caption: string; };

export type Insurance = { id: string; provider: string; policyNumber: string; validUntil: string; documentUrl?: string; };
export type TravelLog = { id: string; destination: string; startDate: string; endDate: string; description: string; mediaUrl?: string; };
export type Registration = { id: string; type: string; regNumber: string; };

interface PixieContextType {
  events: Event[]; setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  vaccinations: Vaccination[]; setVaccinations: React.Dispatch<React.SetStateAction<Vaccination[]>>;
  deworming: Deworming[]; setDeworming: React.Dispatch<React.SetStateAction<Deworming[]>>;
  medications: Medication[]; setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  documents: Document[]; setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  growthData: GrowthLog[]; setGrowthData: React.Dispatch<React.SetStateAction<GrowthLog[]>>;
  profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  memories: Memory[]; setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  insurance: Insurance[]; setInsurance: React.Dispatch<React.SetStateAction<Insurance[]>>;
  travelLogs: TravelLog[]; setTravelLogs: React.Dispatch<React.SetStateAction<TravelLog[]>>;
  registrations: Registration[]; setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
  isLoaded: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const PixieContext = createContext<PixieContextType | undefined>(undefined);

const defaultProfile = {
  name: "Pixie", breed: "English Golden Retriever", microchip: "981020000123456", reg: "KCI-2026-ENG-0987", dob: "2026-04-10", gender: "Female", bloodGroup: "DEA 1.1 Positive"
};

const supabase = createClient();

// Mappers
const dbToEvent = (d: any): Event => ({ id: d.id, date: d.date, title: d.title, type: d.type, description: d.description || '', iconName: d.icon_name || 'Heart', color: d.color || '', attachments: d.attachments || 0 });
const dbToVax = (d: any): Vaccination => ({ id: d.id, name: d.name, date: d.date, nextDue: d.next_due || '', status: d.status || '', vet: d.vet || '' });
const dbToDew = (d: any): Deworming => ({ id: d.id, product: d.product, date: d.date, nextDue: d.next_due || '', status: d.status || '', weight: d.weight || '' });
const dbToMed = (d: any): Medication => ({ id: d.id, name: d.name, dose: d.dose || '', frequency: d.frequency || '', condition: d.condition || '', status: d.status || '' });
const dbToDoc = (d: any): Document => ({ id: d.id, name: d.name, category: d.category || '', type: d.type || '', size: d.size || '', date: d.date || '', dataUrl: d.file_url || '' });
const dbToGro = (d: any): GrowthLog => ({ id: d.id, date: d.date, weight: Number(d.weight) || 0 });
const dbToMem = (d: any): Memory => ({ id: d.id, imageBase64: d.image_url || '', date: d.date, age: d.age || '', caption: d.caption || '' });

const dbToIns = (d: any): Insurance => ({ id: d.id, provider: d.provider, policyNumber: d.policy_number || '', validUntil: d.valid_until || '', documentUrl: d.document_url || '' });
const dbToTra = (d: any): TravelLog => ({ id: d.id, destination: d.destination, startDate: d.start_date, endDate: d.end_date || '', description: d.description || '', mediaUrl: d.media_url || '' });
const dbToReg = (d: any): Registration => ({ id: d.id, type: d.type, regNumber: d.reg_number });

// Realtime Sync Hook
function useRealtimeTable<T extends { id: string }>(
  tableName: string, 
  user: any, 
  isLoaded: boolean, 
  mapToDb: (item: T) => any,
  mapFromDb: (dbItem: any) => T
) {
  const [_data, _setData] = useState<T[]>([]);

  // Exposed to UI: Updates local state immediately, then pushes diff to Supabase
  const setData = (action: React.SetStateAction<T[]>) => {
    _setData(prev => {
      const next: T[] = typeof action === 'function' ? (action as (prevState: T[]) => T[])(prev) : action;
      
      if (user) {
        const newIds = new Set(next.map((item: T) => item.id));
        const deletedItems = prev.filter((item: T) => !newIds.has(item.id));
        const oldMap = new Map(prev.map((i: T) => [i.id, i]));
        const toUpsert = next.filter((item: T) => JSON.stringify(item) !== JSON.stringify(oldMap.get(item.id)));
        
        if (deletedItems.length > 0) {
          supabase.from(tableName).delete().in('id', deletedItems.map(d => d.id)).then();
        }
        if (toUpsert.length > 0) {
          const upserts = toUpsert.map(item => ({ ...mapToDb(item), user_id: user.id }));
          supabase.from(tableName).upsert(upserts).then();
        }
      }
      
      return next;
    });
  };

  // Listens to Supabase Realtime to update local state without echoing
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    const channel = supabase.channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName, filter: `user_id=eq.${user.id}` }, (payload) => {
        _setData(currentData => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newItem = mapFromDb(payload.new);
            const exists = currentData.some(i => i.id === newItem.id);
            if (exists) {
              return currentData.map(i => i.id === newItem.id ? newItem : i);
            } else {
              return [...currentData, newItem];
            }
          } else if (payload.eventType === 'DELETE') {
            return currentData.filter(i => i.id !== payload.old.id);
          }
          return currentData;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isLoaded, user, tableName]);

  return { data: _data, setData, loadInitialData: _setData };
}

export function PixieProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;

  // Realtime Tables
  const eventsTable = useRealtimeTable<Event>('events', user, isLoaded, 
    (item) => ({ id: item.id, date: item.date, title: item.title, type: item.type, description: item.description, icon_name: item.iconName, color: item.color, attachments: item.attachments }), dbToEvent);
  const vaccinationsTable = useRealtimeTable<Vaccination>('vaccinations', user, isLoaded, 
    (item) => ({ id: item.id, name: item.name, date: item.date, next_due: item.nextDue, status: item.status, vet: item.vet }), dbToVax);
  const dewormingTable = useRealtimeTable<Deworming>('deworming', user, isLoaded, 
    (item) => ({ id: item.id, product: item.product, date: item.date, next_due: item.nextDue, status: item.status, weight: item.weight }), dbToDew);
  const medicationsTable = useRealtimeTable<Medication>('medications', user, isLoaded, 
    (item) => ({ id: item.id, name: item.name, dose: item.dose, frequency: item.frequency, condition: item.condition, status: item.status }), dbToMed);
  const documentsTable = useRealtimeTable<Document>('documents', user, isLoaded, 
    (item) => ({ id: item.id, name: item.name, category: item.category, type: item.type, size: item.size, date: item.date, file_url: item.dataUrl || "" }), dbToDoc);
  const growthTable = useRealtimeTable<GrowthLog>('growth_logs', user, isLoaded, 
    (item) => ({ id: item.id, date: item.date, weight: item.weight }), dbToGro);
  const memoriesTable = useRealtimeTable<Memory>('memories', user, isLoaded, 
    (item) => ({ id: item.id, image_url: item.imageBase64, date: item.date, age: item.age, caption: item.caption }), dbToMem);
  
  const insuranceTable = useRealtimeTable<Insurance>('insurance', user, isLoaded, 
    (item) => ({ id: item.id, provider: item.provider, policy_number: item.policyNumber, valid_until: item.validUntil, document_url: item.documentUrl || '' }), dbToIns);
  const travelTable = useRealtimeTable<TravelLog>('travel_logs', user, isLoaded, 
    (item) => ({ id: item.id, destination: item.destination, start_date: item.startDate, end_date: item.endDate, description: item.description, media_url: item.mediaUrl || '' }), dbToTra);
  const registrationsTable = useRealtimeTable<Registration>('registrations', user, isLoaded, 
    (item) => ({ id: item.id, type: item.type, reg_number: item.regNumber }), dbToReg);

  // Profile Sync
  const [_profile, _setProfile] = useState<Profile>(defaultProfile);
  const setProfile = (action: React.SetStateAction<Profile>) => {
    _setProfile(prev => {
      const next = typeof action === 'function' ? (action as Function)(prev) : action;
      if (user) {
        supabase.from('profiles').upsert({ user_id: user.id, name: next.name, breed: next.breed, microchip: next.microchip, reg: next.reg, dob: next.dob, gender: next.gender, avatar_url: next.avatarUrl, blood_group: next.bloodGroup }).then();
      }
      return next;
    });
  }

  useEffect(() => {
    if (!isLoaded || !user) return;
    const channel = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          _setProfile({ name: payload.new.name, breed: payload.new.breed, microchip: payload.new.microchip, reg: payload.new.reg, dob: payload.new.dob, gender: payload.new.gender, avatarUrl: payload.new.avatar_url, bloodGroup: payload.new.blood_group });
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); }
  }, [isLoaded, user]);

  // Auth & Initial Data Loading
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
          { data: doc }, { data: gro }, { data: mem }, { data: ins }, { data: tra }, { data: reg }, { data: prof }
        ] = await Promise.all([
          supabase.from('events').select('*'),
          supabase.from('vaccinations').select('*'),
          supabase.from('deworming').select('*'),
          supabase.from('medications').select('*'),
          supabase.from('documents').select('*'),
          supabase.from('growth_logs').select('*'),
          supabase.from('memories').select('*'),
          supabase.from('insurance').select('*'),
          supabase.from('travel_logs').select('*'),
          supabase.from('registrations').select('*'),
          supabase.from('profiles').select('*').eq('user_id', sessionUser.id).maybeSingle()
        ]);

        eventsTable.loadInitialData((evt || []).map(dbToEvent));
        vaccinationsTable.loadInitialData((vax || []).map(dbToVax));
        dewormingTable.loadInitialData((dew || []).map(dbToDew));
        medicationsTable.loadInitialData((med || []).map(dbToMed));
        documentsTable.loadInitialData((doc || []).map(dbToDoc));
        growthTable.loadInitialData((gro || []).map(dbToGro));
        memoriesTable.loadInitialData((mem || []).map(dbToMem));
        insuranceTable.loadInitialData((ins || []).map(dbToIns));
        travelTable.loadInitialData((tra || []).map(dbToTra));
        registrationsTable.loadInitialData((reg || []).map(dbToReg));

        if (prof) {
          _setProfile({ name: prof.name, breed: prof.breed, microchip: prof.microchip, reg: prof.reg, dob: prof.dob, gender: prof.gender, avatarUrl: prof.avatar_url, bloodGroup: prof.blood_group });
        } else {
          await supabase.from('profiles').insert({ user_id: sessionUser.id, ...defaultProfile });
        }
      } else {
        // Clear data on logout
        eventsTable.loadInitialData([]); vaccinationsTable.loadInitialData([]); dewormingTable.loadInitialData([]); medicationsTable.loadInitialData([]);
        documentsTable.loadInitialData([]); growthTable.loadInitialData([]); memoriesTable.loadInitialData([]); 
        insuranceTable.loadInitialData([]); travelTable.loadInitialData([]); registrationsTable.loadInitialData([]);
        _setProfile(defaultProfile);
      }

      setIsLoaded(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadData(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadData(session?.user || null);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => {};
  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <PixieContext.Provider value={{
      events: eventsTable.data, setEvents: eventsTable.setData, 
      vaccinations: vaccinationsTable.data, setVaccinations: vaccinationsTable.setData, 
      deworming: dewormingTable.data, setDeworming: dewormingTable.setData,
      medications: medicationsTable.data, setMedications: medicationsTable.setData, 
      documents: documentsTable.data, setDocuments: documentsTable.setData, 
      growthData: growthTable.data, setGrowthData: growthTable.setData,
      profile: _profile, setProfile: setProfile, 
      memories: memoriesTable.data, setMemories: memoriesTable.setData, 
      insurance: insuranceTable.data, setInsurance: insuranceTable.setData,
      travelLogs: travelTable.data, setTravelLogs: travelTable.setData,
      registrations: registrationsTable.data, setRegistrations: registrationsTable.setData,
      isLoaded, isAuthenticated, login, logout
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
