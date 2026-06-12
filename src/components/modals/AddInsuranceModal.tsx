"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Hash, Calendar, Upload } from "lucide-react";

export function AddInsuranceModal({ children, onAdd, initialData }: { children: React.ReactNode, onAdd: (insurance: any) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(initialData?.provider || "");
  const [policyNumber, setPolicyNumber] = useState(initialData?.policyNumber || "");
  const [validUntil, setValidUntil] = useState(initialData?.validUntil || "");
  const [documentUrl, setDocumentUrl] = useState(initialData?.documentUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setDocumentUrl(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      provider,
      policyNumber,
      validUntil,
      documentUrl
    });
    setOpen(false);
    if (!initialData) {
      setProvider(""); setPolicyNumber(""); setValidUntil(""); setDocumentUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 shadow-xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" /> {initialData ? "Edit Insurance" : "Add Insurance"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium text-slate-700 flex items-center gap-2">Provider Name</Label>
            <Input id="provider" required value={provider} onChange={(e) => setProvider(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Hash className="h-4 w-4 text-slate-400" /> Policy Number</Label>
            <Input id="policyNumber" required value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> Valid Until</Label>
            <Input id="validUntil" type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Upload className="h-4 w-4 text-slate-400" /> Upload Document</Label>
            <Input id="document" type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="h-11 rounded-xl bg-slate-50 focus-visible:bg-white file:rounded-lg file:border-0" />
            {documentUrl && <p className="text-xs text-emerald-600 font-medium mt-1">Document attached</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">Cancel</Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">Save Insurance</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
