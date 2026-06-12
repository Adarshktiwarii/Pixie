"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Calendar as CalendarIcon, Type, Pill } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddMedicalRecordModal({ children, onAdd, defaultTab = "vaccinations", initialData }: { children: React.ReactNode, onAdd?: (record: any) => void, defaultTab?: string, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(defaultTab);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDue, setNextDue] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    if (open && initialData) {
      setType(initialData.type || defaultTab);
      setName(initialData.name || initialData.product || "");
      if (initialData.date && initialData.date !== "-") {
        try {
          setDate(new Date(initialData.date).toISOString().split('T')[0]);
        } catch (e) {
          setDate(new Date().toISOString().split('T')[0]);
        }
      }
      if (initialData.nextDue && initialData.nextDue !== "None" && initialData.nextDue !== "-") {
        try {
          setNextDue(new Date(initialData.nextDue).toISOString().split('T')[0]);
        } catch (e) {
          setNextDue("");
        }
      }
      setProvider(initialData.vet || "");
    } else if (open && !initialData) {
      setType(defaultTab);
      setName("");
      setDate(new Date().toISOString().split('T')[0]);
      setNextDue("");
      setProvider("");
    }
  }, [open, initialData, defaultTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdd && name) {
      onAdd({ ...initialData, type, name, date, nextDue, provider });
    }
    setOpen(false);
    setName("");
    setProvider("");
    setDate(new Date().toISOString().split('T')[0]);
    setNextDue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 p-0 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">{initialData ? "Edit Medical Record" : "Add Medical Record"}</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-slate-400" /> Record Type
            </Label>
            <Select value={type} onValueChange={(val) => setType(val || "")}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-amber-500/20 focus:border-amber-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                <SelectItem value="vaccinations">Vaccination</SelectItem>
                <SelectItem value="deworming">Deworming</SelectItem>
                <SelectItem value="medications">Medication</SelectItem>
                <SelectItem value="conditions">Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Pill className="h-4 w-4 text-slate-400" /> Name / Details
            </Label>
            <Input 
              id="name" 
              required 
              placeholder="e.g. Rabies Vaccine" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" /> Date
              </Label>
              <Input 
                id="date" 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDue" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" /> Next Due
              </Label>
              <Input 
                id="nextDue" 
                type="date" 
                value={nextDue}
                onChange={(e) => setNextDue(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              {initialData ? "Save Changes" : "Save Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
