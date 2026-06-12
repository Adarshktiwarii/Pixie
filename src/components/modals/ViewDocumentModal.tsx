"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Eye } from "lucide-react";
import { Document } from "@/lib/context";

export function ViewDocumentModal({ children, doc }: { children: React.ReactNode, doc: Document }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col rounded-2xl bg-white border-slate-100 p-0 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Eye className="h-5 w-5 text-amber-500" /> {doc.name}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center">
          {!doc.dataUrl ? (
            <div className="text-slate-500 text-center">
              <p>No preview available.</p>
              <p className="text-sm">This file does not have a saved data URL.</p>
            </div>
          ) : doc.type === 'pdf' ? (
            <iframe src={doc.dataUrl} className="w-full h-full rounded-xl shadow-sm border border-slate-200" title={doc.name} />
          ) : (
            <img src={doc.dataUrl} alt={doc.name} className="max-w-full max-h-full object-contain rounded-xl shadow-sm border border-slate-200" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
