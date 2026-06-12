"use client";

import { usePixie } from "@/lib/context";
import { AddMemoryModal } from "@/components/modals/AddMemoryModal";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Calendar, Clock, Trash2 } from "lucide-react";
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
    toast.success("Memory saved successfully!");
  };

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
    toast.error("Memory deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  // Sort memories chronologically (newest first based on the assumption they are added sequentially, or sort by parsed date)
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Memories...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Photo Diary</h1>
          <p className="text-slate-500 mt-1">Track Pixie&apos;s growth and progress over time.</p>
        </div>
        <AddMemoryModal onAdd={handleAddMemory}>
          <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-fit shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Upload Photo
          </Button>
        </AddMemoryModal>
      </div>

      <div className="relative pt-4">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-orange-200 to-transparent -translate-x-1/2"></div>

        {sortedMemories.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
              <ImageIcon className="h-8 w-8 text-amber-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No memories yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Upload the first photo to start building Pixie&apos;s timeline!</p>
          </div>
        ) : (
          <div className="space-y-12 pb-12">
            {sortedMemories.map((memory, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={memory.id} className="relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 group">
                  
                  {/* Center Node */}
                  <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm -translate-x-1/2 md:-translate-y-1/2 z-10"></div>
                  
                  {/* Left Side (Empty on mobile, Date/Age on Desktop for Even) */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pr-12 md:order-1 opacity-0 hidden md:block'}`}>
                    {isEven && (
                      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 shadow-sm inline-block">
                        <div className="flex items-center md:justify-end gap-2 text-amber-600 font-semibold mb-1">
                          <Calendar className="h-4 w-4" /> {memory.date}
                        </div>
                        {memory.age && (
                          <div className="flex items-center md:justify-end gap-2 text-slate-500 text-sm font-medium">
                            <Clock className="h-4 w-4" /> Age: {memory.age}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side (Content on mobile, Date/Age on Desktop for Odd) */}
                  <div className={`w-full md:w-1/2 pl-12 ${isEven ? '' : 'md:pl-12 md:order-2'}`}>
                    {!isEven && (
                      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 shadow-sm inline-block mb-4 md:mb-0 md:hidden">
                        <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                          <Calendar className="h-4 w-4" /> {memory.date}
                        </div>
                        {memory.age && (
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Clock className="h-4 w-4" /> Age: {memory.age}
                          </div>
                        )}
                      </div>
                    )}

                    {!isEven && (
                      <div className="hidden md:inline-block bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 shadow-sm mb-4 md:mb-0 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                          <Calendar className="h-4 w-4" /> {memory.date}
                        </div>
                        {memory.age && (
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Clock className="h-4 w-4" /> Age: {memory.age}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* The Polaroid Card */}
                    <div className={`mt-4 md:mt-0 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-md ${isEven ? 'md:mr-auto' : 'md:ml-auto'} max-w-sm w-full relative`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(memory.id)}
                        className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                        <img src={memory.imageBase64} alt={memory.caption} className="w-full h-full object-cover" />
                      </div>
                      {memory.caption && (
                        <p className="text-slate-700 font-medium text-[15px] px-2 pb-2 leading-snug">
                          {memory.caption}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
