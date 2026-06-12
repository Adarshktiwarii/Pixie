"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Hash } from "lucide-react";

export function AddRegistrationModal({ children, onAdd, initialData }: { children: React.ReactNode, onAdd: (reg: any) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(initialData?.type || "");
  const [regNumber, setRegNumber] = useState(initialData?.regNumber || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      regNumber
    });
    setOpen(false);
    if (!initialData) {
      setType(""); setRegNumber("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 shadow-xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-amber-500" /> {initialData ? "Edit Registration" : "Add Registration"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-slate-700 flex items-center gap-2">Registration Type</Label>
            <Input id="type" required placeholder="e.g. BBMP, KCI, BCI" value={type} onChange={(e) => setType(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regNumber" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Hash className="h-4 w-4 text-slate-400" /> Registration Number</Label>
            <Input id="regNumber" required value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">Cancel</Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">Save Registration</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
