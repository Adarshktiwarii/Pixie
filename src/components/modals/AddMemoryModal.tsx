"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Calendar, Clock, Edit2 } from "lucide-react";

interface AddMemoryModalProps {
  children: React.ReactNode;
  onAdd: (memory: any) => void;
}

export function AddMemoryModal({ children, onAdd }: AddMemoryModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [age, setAge] = useState("");
  const [caption, setCaption] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File must be less than 5MB");
        return;
      }
      setFileError("");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize image to max 800px width/height to save local storage space
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setImageBase64(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setFileError("Please select an image");
      return;
    }
    onAdd({
      date,
      age,
      caption,
      imageBase64
    });
    setOpen(false);
    setDate("");
    setAge("");
    setCaption("");
    setImageBase64("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border-slate-100 shadow-xl p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-amber-500" /> Upload Memory
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-slate-400" /> Photo
            </Label>
            <div className="flex flex-col gap-2">
              {imageBase64 && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <Input 
                id="image" 
                type="file"
                accept="image/*"
                required={!imageBase64}
                onChange={handleFileChange}
                className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 cursor-pointer file:text-slate-700 file:bg-slate-200 file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-1 hover:file:bg-slate-300"
              />
            </div>
            {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" /> Date Taken
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
            <Label htmlFor="age" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" /> Age at the Time
            </Label>
            <Input 
              id="age" 
              placeholder="e.g. 8 Weeks, 3 Months" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-slate-400" /> Caption
            </Label>
            <Input 
              id="caption" 
              placeholder="A short description..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="h-11 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-6">
              Upload Memory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
