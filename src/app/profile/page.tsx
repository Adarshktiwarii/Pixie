"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { AddInsuranceModal } from "@/components/modals/AddInsuranceModal";
import { AddTravelLogModal } from "@/components/modals/AddTravelLogModal";
import { AddRegistrationModal } from "@/components/modals/AddRegistrationModal";
import { Activity, Calendar, Hash, MapPin, Shield, Tag, User, Camera, Bone, HeartPulse, Edit2, Plane, Search, Users, FolderOpen, LogOut, Plus, ShieldCheck, FileText, Map, Trash2 } from "lucide-react";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const router = useRouter();
  const { profile, setProfile, insurance, setInsurance, travelLogs, setTravelLogs, registrations, setRegistrations, logout } = usePixie();

  const handleSaveProfile = (updatedProfile: any) => {
    setProfile(updatedProfile);
    toast.success("Profile updated successfully");
  };

  const handleAddInsurance = (ins: any) => {
    setInsurance([...insurance, { id: Date.now().toString(), ...ins }]);
    toast.success("Insurance policy added");
  };

  const handleAddTravel = (log: any) => {
    setTravelLogs([...travelLogs, { id: Date.now().toString(), ...log }]);
    toast.success("Travel log added");
  };

  const handleAddRegistration = (reg: any) => {
    setRegistrations([...registrations, { id: Date.now().toString(), ...reg }]);
    toast.success("Registration added");
  };

  const deleteInsurance = (id: string) => {
    setInsurance(insurance.filter(i => i.id !== id));
    toast.error("Insurance policy deleted");
  };

  const deleteTravel = (id: string) => {
    setTravelLogs(travelLogs.filter(t => t.id !== id));
    toast.error("Travel log deleted");
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(registrations.filter(r => r.id !== id));
    toast.error("Registration deleted");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatarUrl || "/pixie.jpg"} alt={profile.name} className="object-cover" />
              <AvatarFallback className="text-3xl bg-amber-100 text-amber-700">{profile.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
              <Camera className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{profile.name}</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-sm py-0.5 px-2">
                <HeartPulse className="mr-1.5 h-3.5 w-3.5" /> Healthy
              </Badge>
            </div>
            <p className="text-lg text-slate-600 font-medium">{profile.breed}</p>
          </div>
        </div>
        <EditProfileModal currentProfile={{...profile, registration: profile.reg}} onSave={handleSaveProfile}>
          <Button variant="outline" className="rounded-xl border-slate-200 w-full sm:w-fit">
            <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </EditProfileModal>
      </div>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Shield className="h-5 w-5 text-emerald-500" /> Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Insurance</span>
                {insurance.length > 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Uninsured</Badge>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Travel Status</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                  <Plane className="h-3 w-3" /> Ready
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Settings & Navigation for Mobile */}
          <Card className="rounded-2xl border-slate-100 shadow-sm md:hidden">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-xl text-slate-800">More Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 p-4">
                <Link href="/growth" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Activity className="h-6 w-6 text-amber-600" />
                  <span className="text-sm font-medium">Growth Track</span>
                </Link>
                <Link href="/contacts" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Users className="h-6 w-6 text-indigo-600" />
                  <span className="text-sm font-medium">Contacts</span>
                </Link>
                <Link href="/documents" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">Vault</span>
                </Link>
                <button onClick={() => { logout(); router.push('/login'); }} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors">
                  <LogOut className="h-6 w-6 text-rose-600" />
                  <span className="text-sm font-medium text-rose-600">Log Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Vital Details */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-xl text-slate-800">Vital Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-amber-500 shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
                  <p className="font-semibold text-slate-900">{profile.dob}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-rose-500 shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Gender</p>
                  <p className="font-semibold text-slate-900">{profile.gender}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-indigo-500 shrink-0">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Color</p>
                  <p className="font-semibold text-slate-900">Light Golden</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-red-500 shrink-0">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Blood Group</p>
                  <p className="font-semibold text-slate-900">{profile.bloodGroup || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-800">Insurance & Protection</CardTitle>
              <AddInsuranceModal onAdd={handleAddInsurance}>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </AddInsuranceModal>
            </CardHeader>
            <CardContent className="p-0">
              <dl className="divide-y divide-slate-100">
                {insurance.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">No insurance records found.</div>
                ) : (
                  insurance.map(ins => (
                    <div key={ins.id} className="px-6 py-5 flex items-center gap-4">
                      <div className="bg-emerald-50 p-3 rounded-xl">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-sm font-semibold text-slate-900">{ins.provider}</dt>
                        <dd className="text-sm text-slate-500 mt-0.5">Policy: <span className="font-mono">{ins.policyNumber}</span> • Valid until: {ins.validUntil}</dd>
                      </div>
                      {ins.documentUrl && (
                        <Button variant="outline" size="sm" className="rounded-lg mr-2" onClick={() => window.open(ins.documentUrl, '_blank')}>View Doc</Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteInsurance(ins.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Identification & Registration */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-800">Identification & Registration</CardTitle>
              <AddRegistrationModal onAdd={handleAddRegistration}>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </AddRegistrationModal>
            </CardHeader>
            <CardContent className="p-0">
              <dl className="divide-y divide-slate-100">
                <div className="px-6 py-5 flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <Search className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-slate-500">Microchip Number</dt>
                    <dd className="text-base font-semibold text-slate-900 mt-1 font-mono tracking-wider">{profile.microchip}</dd>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">Copy</Button>
                </div>
                {profile.reg && (
                  <div className="px-6 py-5 flex items-center gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <Hash className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-slate-500">Primary Registration</dt>
                      <dd className="text-base font-semibold text-slate-900 mt-1 font-mono tracking-wider">{profile.reg}</dd>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">Copy</Button>
                  </div>
                )}
                {registrations.map(reg => (
                  <div key={reg.id} className="px-6 py-5 flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-xl">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-slate-500">{reg.type} Registration</dt>
                      <dd className="text-base font-semibold text-slate-900 mt-1 font-mono tracking-wider">{reg.regNumber}</dd>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 mr-1" onClick={() => deleteRegistration(reg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg">Copy</Button>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Travel Logs */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-800">Travel History</CardTitle>
              <AddTravelLogModal onAdd={handleAddTravel}>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  <Plus className="h-4 w-4 mr-1" /> Log Trip
                </Button>
              </AddTravelLogModal>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {travelLogs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">No travel history logged.</div>
                ) : (
                  travelLogs.map(log => (
                    <div key={log.id} className="p-6 flex flex-col sm:flex-row gap-4 group">
                      {log.mediaUrl ? (
                        <div className="w-full sm:w-24 h-32 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                          <img src={log.mediaUrl} alt={log.destination} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full sm:w-24 h-16 sm:h-24 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                          <Map className="h-8 w-8 text-indigo-200" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-lg">{log.destination}</h4>
                            <p className="text-sm font-medium text-slate-500 mb-2">
                              {log.startDate} {log.endDate && `- ${log.endDate}`}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-600 hover:bg-red-50" onClick={() => deleteTravel(log.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {log.description && (
                          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {log.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </motion.div>
  );
}
