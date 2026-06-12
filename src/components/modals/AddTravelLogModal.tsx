"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Edit2, Image as ImageIcon } from "lucide-react";

export function AddTravelLogModal({ children, onAdd, initialData }: { children: React.ReactNode, onAdd: (log: any) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setMediaUrl(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      destination,
      startDate,
      endDate,
      description,
      mediaUrl
    });
    setOpen(false);
    if (!initialData) {
      setDestination(""); setStartDate(""); setEndDate(""); setDescription(""); setMediaUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 shadow-xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" /> {initialData ? "Edit Travel Log" : "Add Travel Log"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium text-slate-700 flex items-center gap-2">Destination</Label>
            <Input id="destination" required value={destination} onChange={(e) => setDestination(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> Start Date</Label>
              <Input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Edit2 className="h-4 w-4 text-slate-400" /> Notes</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media" className="text-sm font-medium text-slate-700 flex items-center gap-2"><ImageIcon className="h-4 w-4 text-slate-400" /> Upload Photo</Label>
            {mediaUrl && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 mb-2">
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <Input id="media" type="file" accept="image/*" onChange={handleFileChange} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white file:rounded-lg file:border-0" />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">Cancel</Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">Save Travel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
