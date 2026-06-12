"use client";

import { usePixie } from "@/lib/context";
import { AddMemoryModal } from "@/components/modals/AddMemoryModal";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Gallery() {
  const { memories, setMemories, isLoaded } = usePixie();

  const handleAddMemory = (memory: any) => {
    // Format the date
    const formattedDate = new Date(memory.date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    setMemories([
      { 
        id: Date.now().toString(), 
        ...memory, 
        date: formattedDate 
      },
      ...memories
    ]);
    toast.success("Photo saved successfully!");
  };

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
    toast.error("Photo deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  // Sort memories chronologically (newest first)
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Gallery...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Photo Gallery</h1>
          <p className="text-slate-500 mt-1">All of Pixie&apos;s memories in one place.</p>
        </div>
        <AddMemoryModal onAdd={handleAddMemory}>
          <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-fit shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Upload Photo
          </Button>
        </AddMemoryModal>
      </div>

      {sortedMemories.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <ImageIcon className="h-8 w-8 text-amber-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No photos yet</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">Upload the first photo to start building Pixie&apos;s gallery!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedMemories.map((memory) => (
            <div key={memory.id} className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-square shadow-sm border border-slate-200">
              <img 
                src={memory.imageBase64} 
                alt={memory.caption || "Gallery photo"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(memory.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                {memory.caption && (
                  <p className="text-white font-medium text-sm leading-snug mb-1 line-clamp-2">
                    {memory.caption}
                  </p>
                )}
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <span>{memory.date}</span>
                  {memory.age && <span>{memory.age}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
