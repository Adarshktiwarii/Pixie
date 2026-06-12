"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Activity, Sparkles, HeartPulse, Scale, Syringe, Bug } from "lucide-react";
import Link from "next/link";
import { AddMedicalRecordModal } from "@/components/modals/AddMedicalRecordModal";
import { LogWeightModal } from "@/components/modals/LogWeightModal";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal";
import { usePixie, getIcon } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function HomeDashboard() {
  const { events, setEvents, profile, growthData, isLoaded } = usePixie();

  const handleAddRecord = (record: any) => {
    const newEvent = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      title: record.name,
      type: record.type,
      description: "Added from quick actions.",
      iconName: record.type === 'health' ? 'Syringe' : 'Heart',
      color: "bg-amber-100 text-amber-700",
      attachments: 0
    };
    setEvents([newEvent, ...events]);
    toast.success("Record added successfully!");
  };

  const handleLogWeight = (weight: number) => {
    const newEvent = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      title: `Logged weight: ${weight} kg`,
      type: "growth",
      description: "Weight check-in.",
      iconName: "Scale",
      color: "bg-amber-100 text-amber-700",
      attachments: 0
    };
    setEvents([newEvent, ...events]);
    toast.success("Weight logged successfully!");
  };

  const handleUploadDoc = (doc: any) => {
    const newEvent = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      title: `Uploaded ${doc.name}`,
      type: "document",
      description: "Document vault updated.",
      iconName: "FileText",
      color: "bg-orange-100 text-orange-700",
      attachments: 1
    };
    setEvents([newEvent, ...events]);
    toast.success("Document uploaded successfully!");
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Pixie...</div>;

  const currentWeight = growthData.length > 0 ? growthData[growthData.length - 1].weight : "N/A";
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-6 rounded-3xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-6 md:p-8">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-sm">
          {/* We would normally use a real photo URL from the DB here */}
          <AvatarImage src={profile.avatarUrl || "/pixie.jpg"} alt={profile.name} className="object-cover" />
          <AvatarFallback className="text-3xl bg-amber-100 text-amber-700">{profile.name.substring(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{profile.name}</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-sm py-1 px-3">
              <HeartPulse className="mr-1.5 h-3.5 w-3.5" />
              Healthy
            </Badge>
          </div>
          <p className="text-lg text-slate-600 font-medium">{profile.breed} • {profile.gender}</p>
          <p className="text-slate-500">Born {profile.dob}</p>
          
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 px-3 py-1.5 rounded-lg shadow-sm">
              <Scale className="h-4 w-4 text-amber-500" />
              <span className="font-semibold">{currentWeight} kg</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 px-3 py-1.5 rounded-lg shadow-sm">
              <Syringe className="h-4 w-4 text-rose-500" />
              <span>Next Vax: <span className="font-semibold text-rose-700">Jun 25</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AddMedicalRecordModal onAdd={handleAddRecord}>
            <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 rounded-2xl bg-white shadow-sm hover:bg-slate-50 border-slate-100">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-700">Add Record</span>
            </Button>
          </AddMedicalRecordModal>
          <UploadDocumentModal onUpload={handleUploadDoc}>
            <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 rounded-2xl bg-white shadow-sm hover:bg-slate-50 border-slate-100">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
                <Upload className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-700">Upload Doc</span>
            </Button>
          </UploadDocumentModal>
          <LogWeightModal onLog={handleLogWeight}>
            <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 rounded-2xl bg-white shadow-sm hover:bg-slate-50 border-slate-100">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-700">Add Weight</span>
            </Button>
          </LogWeightModal>
          <Link href="/ai" className="block">
            <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm hover:from-amber-100 hover:to-orange-100 border-amber-100 transition-all">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-medium text-amber-700">Ask Pixie AI</span>
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Timeline */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
            <Link href="/timeline" className="text-sm font-medium text-amber-600 hover:text-amber-700">View All</Link>
          </div>
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {events.slice(0, 4).map((item, i) => (
                <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${item.color} shrink-0`}>
                    {item.type}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No recent activity. Start logging events!
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Reminders Widget */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Upcoming</h2>
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl shrink-0">
                  <Bug className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Deworming Dose</p>
                  <p className="text-sm text-slate-600 mt-0.5">Jun 25 • In 13 days</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-rose-100 text-rose-700 p-2.5 rounded-xl shrink-0">
                  <Syringe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Vaccination Booster</p>
                  <p className="text-sm text-slate-600 mt-0.5">Jun 25 • In 13 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </motion.div>
  );
}
