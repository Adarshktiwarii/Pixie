"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Syringe, Bug, Activity, ClipboardList, CheckCircle2, Clock, Plus, Trash2, Edit2, Printer } from "lucide-react";
import { AddMedicalRecordModal } from "@/components/modals/AddMedicalRecordModal";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Passport() {
  const { profile, vaccinations, setVaccinations, deworming, setDeworming, medications, setMedications, isLoaded } = usePixie();

  const handlePrint = () => {
    window.print();
  };

  const handleAddRecord = (record: any) => {
    const formattedDate = new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const formattedNextDue = record.nextDueDate ? new Date(record.nextDueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'None';
    
    if (record.type === "vaccinations") {
      setVaccinations([...vaccinations, { id: Date.now().toString(), name: record.name, date: formattedDate, nextDue: formattedNextDue, status: "Completed", vet: record.provider || "-" }]);
      toast.success("Vaccination record added!");
    } else if (record.type === "deworming") {
      setDeworming([...deworming, { id: Date.now().toString(), product: record.name, date: formattedDate, nextDue: formattedNextDue, status: "Completed", weight: "N/A" }]);
      toast.success("Deworming record added!");
    } else if (record.type === "medications") {
      setMedications([...medications, { id: Date.now().toString(), name: record.name, dose: "N/A", frequency: "N/A", condition: "General", status: "Active" }]);
      toast.success("Medication record added!");
    }
  };

  const handleEditVaccination = (id: string, updated: any) => {
    const formattedDate = new Date(updated.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const formattedNextDue = updated.nextDue ? new Date(updated.nextDue).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'None';
    setVaccinations(vaccinations.map(v => v.id === id ? { ...v, name: updated.name, date: formattedDate, nextDue: formattedNextDue, vet: updated.provider || "-" } : v));
    toast.success("Vaccination record updated!");
  };

  const handleEditDeworming = (id: string, updated: any) => {
    const formattedDate = new Date(updated.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const formattedNextDue = updated.nextDue ? new Date(updated.nextDue).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'None';
    setDeworming(deworming.map(d => d.id === id ? { ...d, product: updated.name, date: formattedDate, nextDue: formattedNextDue } : d));
    toast.success("Deworming record updated!");
  };

  const handleEditMedication = (id: string, updated: any) => {
    setMedications(medications.map(m => m.id === id ? { ...m, name: updated.name } : m));
    toast.success("Medication record updated!");
  };

  const handleDeleteVaccination = (idToDelete: string) => {
    setVaccinations(vaccinations.filter((vax) => vax.id !== idToDelete));
    toast.error("Vaccination record deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };
  
  const handleDeleteDeworming = (idToDelete: string) => {
    setDeworming(deworming.filter((d) => d.id !== idToDelete));
    toast.error("Deworming record deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  const handleDeleteMedication = (idToDelete: string) => {
    setMedications(medications.filter((m) => m.id !== idToDelete));
    toast.error("Medication record deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
      case "Upcoming":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="mr-1 h-3 w-3" /> Upcoming</Badge>;
      case "Active":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Activity className="mr-1 h-3 w-3" /> Active</Badge>;
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Passport...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 print:m-0 print:p-0 print:shadow-none print:border-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medical Passport</h1>
          <p className="text-slate-500 mt-1">Official health records, vaccinations, and treatments.</p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={handlePrint} className="rounded-xl border-slate-200 w-full">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <AddMedicalRecordModal onAdd={handleAddRecord}>
            <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          </AddMedicalRecordModal>
        </div>
      </div>

      <PrintablePassport profile={profile} vaccinations={vaccinations} deworming={deworming} medications={medications} />

      <Tabs defaultValue="vaccinations" className="w-full print:hidden">
        <TabsList className="bg-white border border-slate-100 p-1 rounded-xl h-auto w-full flex overflow-x-auto no-scrollbar justify-start md:justify-center shadow-sm">
          <TabsTrigger value="vaccinations" className="rounded-lg py-2.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none">
            <Syringe className="h-4 w-4 md:mr-2 md:mb-0 mb-1" /> <span className="text-[11px] md:text-sm">Vaccinations</span>
          </TabsTrigger>
          <TabsTrigger value="deworming" className="rounded-lg py-2.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none">
            <Bug className="h-4 w-4 md:mr-2 md:mb-0 mb-1" /> <span className="text-[11px] md:text-sm">Deworming</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="rounded-lg py-2.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none">
            <Activity className="h-4 w-4 md:mr-2 md:mb-0 mb-1" /> <span className="text-[11px] md:text-sm">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="conditions" className="rounded-lg py-2.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none">
            <ClipboardList className="h-4 w-4 md:mr-2 md:mb-0 mb-1" /> <span className="text-[11px] md:text-sm">Conditions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vaccinations" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Vaccine</th>
                    <th className="px-6 py-4 hidden md:table-cell">Date Administered</th>
                    <th className="px-6 py-4 hidden md:table-cell">Next Due</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="py-4 px-6 text-left font-medium text-slate-500 hidden lg:table-cell">Vet/Clinic</th>
                    <th className="py-4 px-6 text-right font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vaccinations.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No vaccinations recorded.</td></tr>
                  ) : (
                  vaccinations.map((vax) => (
                    <tr key={vax.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{vax.name}</div>
                        <div className="text-sm text-slate-500 md:hidden">{vax.date}</div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600">{vax.date}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600">{vax.nextDue}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(vax.status)}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell text-slate-600">{vax.vet}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <AddMedicalRecordModal initialData={{...vax, type: "vaccinations"}} defaultTab="vaccinations" onAdd={(updated) => handleEditVaccination(vax.id, updated)}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 h-8 w-8 mr-1">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </AddMedicalRecordModal>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteVaccination(vax.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deworming" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 hidden md:table-cell">Date Administered</th>
                    <th className="px-6 py-4 hidden md:table-cell">Next Due</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="py-4 px-6 text-left font-medium text-slate-500 hidden lg:table-cell">Weight</th>
                    <th className="py-4 px-6 text-right font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deworming.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No deworming recorded.</td></tr>
                  ) : (
                  deworming.map((deworm) => (
                    <tr key={deworm.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{deworm.product}</div>
                        <div className="text-sm text-slate-500 md:hidden">{deworm.date}</div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600">{deworm.date}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600">{deworm.nextDue}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(deworm.status)}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell text-slate-600">{deworm.weight}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <AddMedicalRecordModal initialData={{...deworm, type: "deworming", name: deworm.product}} defaultTab="deworming" onAdd={(updated) => handleEditDeworming(deworm.id, updated)}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 h-8 w-8 mr-1">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </AddMedicalRecordModal>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDeworming(deworm.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {medications.map((med, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-900 pr-2">{med.name}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(med.status)}
                      <AddMedicalRecordModal initialData={{...med, type: "medications"}} defaultTab="medications" onAdd={(updated) => handleEditMedication(med.id, updated)}>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-amber-600">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </AddMedicalRecordModal>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMedication(med.id)} className="h-6 w-6 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dosage</span>
                      <span className="font-medium text-slate-900">{med.dose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Frequency</span>
                      <span className="font-medium text-slate-900">{med.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Condition</span>
                      <span className="font-medium text-slate-900">{med.condition}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <ClipboardList className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Left Eye Swelling</h3>
              <p className="text-slate-600 mt-1">Diagnosed on June 12, 2026. Improving naturally. Prescribed Digyton Plus drops.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function PrintablePassport({ profile, vaccinations, deworming, medications }: any) {
  return (
    <div className="hidden print:block space-y-8 p-0 max-w-4xl mx-auto font-sans bg-white text-slate-900">
      <div className="flex items-center gap-6 border-b-2 border-amber-600 pb-6">
        <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center text-4xl overflow-hidden border-2 border-amber-200 shrink-0">
          {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : "🐾"}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-1">{profile.name}&apos;s Medical Passport</h1>
          <p className="text-xl text-slate-600 font-medium">{profile.breed}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div><span className="text-slate-500 block mb-1 uppercase text-xs tracking-wider font-semibold">Date of Birth</span><span className="font-semibold text-base">{profile.dob}</span></div>
        <div><span className="text-slate-500 block mb-1 uppercase text-xs tracking-wider font-semibold">Gender</span><span className="font-semibold text-base">{profile.gender}</span></div>
        <div><span className="text-slate-500 block mb-1 uppercase text-xs tracking-wider font-semibold">Microchip No.</span><span className="font-semibold text-base font-mono tracking-wider">{profile.microchip}</span></div>
        <div><span className="text-slate-500 block mb-1 uppercase text-xs tracking-wider font-semibold">Registration No.</span><span className="font-semibold text-base font-mono tracking-wider">{profile.reg}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-slate-800 font-bold mb-3 border-b border-slate-200 pb-2">Owner Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">Primary Owner</span>
              <span className="font-semibold text-slate-900 text-base block">Adarsh Kumar Tiwari</span>
              <span className="text-slate-600 block">+91 91316 20063</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">Secondary Caregiver</span>
              <span className="font-semibold text-slate-900 text-base block">Upasana Shil</span>
              <span className="text-slate-600 block">+91 84848 46980</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-slate-800 font-bold mb-3 border-b border-slate-200 pb-2">Veterinary Clinic</h3>
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">Primary Veterinarian</span>
              <span className="font-semibold text-slate-900 text-base block">Dr. Yatish Gowda</span>
              <span className="text-slate-600 block">Leela Pet Clinic HSR Layout</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">Clinic Registration No.</span>
              <span className="font-semibold text-slate-900 text-base font-mono block">KVC 5647</span>
            </div>
          </div>
        </div>
      </div>

      
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Vaccinations</h2>
        <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Vaccine</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Date Administered</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Next Due</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Clinic / Vet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vaccinations.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-4 text-slate-500 text-center">No vaccinations on record.</td></tr>
            ) : vaccinations.map((vax: any) => (
              <tr key={vax.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{vax.name}</td>
                <td className="px-4 py-3 text-slate-700">{vax.date}</td>
                <td className="px-4 py-3 text-slate-700">{vax.nextDue}</td>
                <td className="px-4 py-3 text-slate-700">{vax.vet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Deworming & Parasite Control</h2>
        <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Product</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Date Administered</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Next Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deworming.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-4 text-slate-500 text-center">No deworming on record.</td></tr>
            ) : deworming.map((d: any) => (
              <tr key={d.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{d.product}</td>
                <td className="px-4 py-3 text-slate-700">{d.date}</td>
                <td className="px-4 py-3 text-slate-700">{d.nextDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {medications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Current Medications & Conditions</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {medications.map((m: any) => (
              <li key={m.id}><span className="font-semibold text-slate-900">{m.name}</span> - {m.dose} ({m.frequency}) for {m.condition}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="pt-8 text-center text-xs text-slate-400 mt-12 border-t border-slate-100">
        <p>Official Pixie Passport Document • Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
