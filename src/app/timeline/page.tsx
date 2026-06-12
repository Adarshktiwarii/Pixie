"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Activity, Image as ImageIcon, FileText, Syringe, Heart, Sparkles, Trash2, CalendarX, Edit2 } from "lucide-react";
import { AddEventModal } from "@/components/modals/AddEventModal";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Timeline() {
  const { events, setEvents, isLoaded } = usePixie();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");


  const getIconForType = (type: string) => {
    switch (type) {
      case 'health': return "Syringe";
      case 'document': return "FileText";
      default: return "Heart";
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'health': return "bg-amber-100 text-amber-600";
      case 'document': return "bg-orange-100 text-orange-600";
      default: return "bg-rose-100 text-rose-600";
    }
  };

  const handleAddEvent = (evt: any) => {
    const formattedDate = new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const newEvent = {
      id: Date.now().toString(),
      date: formattedDate,
      title: evt.title,
      type: evt.type,
      description: evt.description || "Added from quick actions.",
      iconName: getIconForType(evt.type),
      color: getColorForType(evt.type),
      attachments: 0
    };
    setEvents([newEvent, ...events]);
    toast.success("Timeline event added!");
  };

  const handleEditEvent = (idToEdit: string, updatedData: any) => {
    const formattedDate = new Date(updatedData.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setEvents(events.map(evt => evt.id === idToEdit ? {
      ...evt,
      date: formattedDate,
      title: updatedData.title,
      type: updatedData.type,
      iconName: getIconForType(updatedData.type),
      color: getColorForType(updatedData.type),
    } : evt));
    toast.success("Timeline event updated!");
  };

  const handleDeleteEvent = (idToDelete: string) => {
    setEvents(events.filter((evt) => evt.id !== idToDelete));
    toast.error("Timeline event deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            evt.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeCategory === "All") return matchesSearch;
      if (activeCategory === "Medical") return matchesSearch && ["health", "vaccinations", "deworming", "medications"].includes(evt.type);
      if (activeCategory === "Milestones") return matchesSearch && ["milestone", "growth"].includes(evt.type);
      if (activeCategory === "Documents") return matchesSearch && evt.type === "document";
      return matchesSearch;
    });
  }, [events, searchQuery, activeCategory]);

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Timeline...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Life Timeline</h1>
          <p className="text-slate-500 mt-1">Chronological history of Pixie&apos;s health and milestones.</p>
        </div>
        <div className="flex items-center gap-2">
          <AddEventModal onAdd={handleAddEvent}>
            <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
              <Calendar className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </AddEventModal>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search timeline..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl border-slate-200 bg-white h-12 text-base shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Medical", "Milestones", "Documents"].map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            onClick={() => setActiveCategory(tag)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium border cursor-pointer shrink-0 shadow-sm transition-colors ${
              activeCategory === tag 
                ? "bg-amber-600 text-white border-amber-600 hover:bg-amber-700" 
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-6 pt-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
              <CalendarX className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              {searchQuery ? "We couldn't find any events matching your search." : "Your timeline is empty. Add a new event to keep track of important milestones."}
            </p>
          </div>
        ) : (
          filteredEvents.map((event, eventIdx) => {
            let IconComponent;
            switch(event.iconName) {
              case 'Syringe': IconComponent = Syringe; break;
              case 'FileText': IconComponent = FileText; break;
              case 'Sparkles': IconComponent = Sparkles; break;
              default: IconComponent = Heart;
            }

            return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: eventIdx * 0.05 }}
              key={event.id} 
              className="flex gap-4 md:gap-6 relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-6 top-10 bottom-[-1.5rem] w-px bg-slate-200 last:hidden" />
              
              <div className="flex flex-col items-center shrink-0 w-12 pt-1 z-10">
                <span className="text-sm font-bold text-slate-500">{event.date.split(' ')[1].replace(',', '')}</span>
                <div className={`mt-2 h-3 w-3 rounded-full border-2 border-white ring-2 ring-slate-100 ${event.color.split(' ')[0]}`} />
              </div>
              
              <div className="flex-1 pb-2">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">{event.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`shrink-0 border-transparent ${event.color} bg-opacity-20`}>
                        {event.type}
                      </Badge>
                      <AddEventModal initialData={event} onAdd={(updated) => handleEditEvent(event.id, updated)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </AddEventModal>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="mt-2 text-xs text-slate-400 font-medium">
                    {event.date}
                  </div>
                  
                  {event.attachments > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 w-fit px-3 py-1.5 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                      <IconComponent className="h-4 w-4" />
                      {event.attachments} Attachment{event.attachments > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )})
        )}
      </div>
    </motion.div>
  );
}
