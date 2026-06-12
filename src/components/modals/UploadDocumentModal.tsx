"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Type } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UploadDocumentModal({ children, onUpload, initialData }: { children: React.ReactNode, onUpload?: (doc: any) => void, initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vaccinations");
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setDataUrl("");
      return;
    }
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      setFileError("Document must be less than 2MB");
      setFile(null);
      setDataUrl("");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "Vaccinations");
      setFile(null); // File cannot be prepopulated easily
      setDataUrl(initialData.dataUrl || "");
      setFileError("");
    } else if (open && !initialData) {
      setName("");
      setCategory("Vaccinations");
      setFile(null);
      setDataUrl("");
      setFileError("");
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpload && name) {
      onUpload({
        ...initialData,
        name,
        category,
        type: file?.type.includes('pdf') ? 'pdf' : (initialData?.type || 'image'),
        size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : (initialData?.size || '1.0 MB'),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        dataUrl: dataUrl || initialData?.dataUrl
      });
    }
    setOpen(false);
    setName("");
    setFile(null);
    setDataUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white border-slate-100 p-0 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">{initialData ? "Edit Document" : "Upload Document"}</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Upload className="h-4 w-4 text-slate-400" /> Select File
            </Label>
            <Input 
              id="file" 
              type="file"
              accept="image/*,application/pdf"
              required={!initialData} 
              onChange={handleFileChange}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 cursor-pointer file:text-slate-700 file:bg-slate-200 file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-1 hover:file:bg-slate-300"
            />
            {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Type className="h-4 w-4 text-slate-400" /> Document Name
            </Label>
            <Input 
              id="name" 
              required 
              placeholder="e.g. Rabies Certificate" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" /> Category
            </Label>
            <Select value={category} onValueChange={(val) => setCategory(val || "")}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-amber-500/20 focus:border-amber-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                <SelectItem value="Vaccinations">Vaccinations</SelectItem>
                <SelectItem value="Prescriptions">Prescriptions</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Registration">Registration</SelectItem>
                <SelectItem value="Documents">Other Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              {initialData ? "Save Changes" : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
