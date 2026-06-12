"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Calendar as CalendarIcon } from "lucide-react";

export function LogWeightModal({ children, onLog, initialData }: { children: React.ReactNode, onLog?: (weight: number, date: string) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (open && initialData) {
      setWeight(initialData.weight?.toString() || "");
      if (initialData.date) {
        try {
          const parsed = new Date(initialData.date + " 2026"); // append year to dummy data dates like "Apr 10" to parse properly
          if (!isNaN(parsed.getTime())) {
            setDate(parsed.toISOString().split('T')[0]);
          }
        } catch (e) {
          // ignore
        }
      }
    } else if (open && !initialData) {
      setWeight("");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLog && weight) {
      onLog(parseFloat(weight), date);
    }
    setOpen(false);
    setWeight("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[400px] rounded-2xl bg-white border-slate-100 p-0 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">{initialData ? "Edit Weight Log" : "Log Weight"}</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-400" /> Weight (kg)
            </Label>
            <Input 
              id="weight" 
              type="number" 
              step="0.1"
              required 
              placeholder="e.g. 5.2" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

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

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              {initialData ? "Save Changes" : "Save Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
