"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, PawPrint, Hash } from "lucide-react";

export function EditProfileModal({ children, currentProfile, onSave }: { children: React.ReactNode, currentProfile?: any, onSave?: (profile: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentProfile?.name || "Pixie");
  const [breed, setBreed] = useState(currentProfile?.breed || "English Golden Retriever");
  const [microchip, setMicrochip] = useState(currentProfile?.microchip || "981020000123456");
  const [reg, setReg] = useState(currentProfile?.reg || "KCI-2026-ENG-0987");
  const [avatarUrl, setAvatarUrl] = useState(currentProfile?.avatarUrl || "");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...currentProfile,
        name,
        breed,
        microchip,
        reg,
        avatarUrl
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 p-0 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">Edit Profile</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" /> Name
            </Label>
            <Input 
              id="name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              Profile Picture
            </Label>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <Input 
                  id="avatar" 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 cursor-pointer file:text-slate-700 file:bg-slate-200 file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-1 hover:file:bg-slate-300"
                />
                {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-slate-400" /> Breed
            </Label>
            <Input 
              id="breed" 
              required 
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" /> Microchip Number
            </Label>
            <Input 
              id="microchip" 
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" /> Registration Number
            </Label>
            <Input 
              id="reg" 
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
