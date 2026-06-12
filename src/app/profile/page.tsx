"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { Activity, Calendar, Hash, MapPin, Shield, Tag, User, Camera, Bone, HeartPulse, Edit2, Plane, Search } from "lucide-react";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { profile, setProfile } = usePixie();

  const handleSaveProfile = (updatedProfile: any) => {
    setProfile(updatedProfile);
    toast.success("Profile updated successfully");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
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
          <Button variant="outline" className="rounded-xl border-slate-200 w-fit">
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
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
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
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-xl text-slate-800">Vital Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-amber-500 shrink-0">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Color</p>
                  <p className="font-semibold text-slate-900">Light Golden</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-xl text-slate-800">Identification & Registration</CardTitle>
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
                <div className="px-6 py-5 flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <Hash className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-slate-500">Registration Number</dt>
                    <dd className="text-base font-semibold text-slate-900 mt-1 font-mono tracking-wider">{profile.reg}</dd>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">Copy</Button>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
