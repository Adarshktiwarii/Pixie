"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Type, FileText } from "lucide-react";

export function AddEventModal({ children, onAdd, initialData }: { children: React.ReactNode, onAdd?: (event: any) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("milestone");

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title || "");
      if (initialData.date) {
        try {
          setDate(new Date(initialData.date).toISOString().split('T')[0]);
        } catch (e) {
          setDate(new Date().toISOString().split('T')[0]);
        }
      }
      setCategory(initialData.type || "milestone");
    } else if (open && !initialData) {
      setTitle("");
      setDate(new Date().toISOString().split('T')[0]);
      setCategory("milestone");
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdd) {
      onAdd({
        ...initialData,
        title,
        date,
        type: category,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white border-slate-100 p-0 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">{initialData ? "Edit Timeline Event" : "Add Timeline Event"}</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Type className="h-4 w-4 text-slate-400" /> Event Title
            </Label>
            <Input 
              id="title" 
              required 
              placeholder="e.g. First time at the park" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" /> Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-amber-500/20 focus:border-amber-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                <SelectItem value="health">Health & Vet</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              {initialData ? "Save Changes" : "Add Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
