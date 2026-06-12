"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, FileText, Image as ImageIcon, ShieldCheck, FileHeart, Trash2, FolderOpen, Edit2, Eye } from "lucide-react";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal";
import { ViewDocumentModal } from "@/components/modals/ViewDocumentModal";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DocumentsVault() {
  const { documents, setDocuments, isLoaded } = usePixie();
  const categories = [
    { name: "Vaccinations", icon: FileHeart, color: "text-rose-500", bg: "bg-rose-100", count: 2 },
    { name: "Prescriptions", icon: FileText, color: "text-blue-500", bg: "bg-blue-100", count: 1 },
    { name: "Insurance", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-100", count: 0 },
    { name: "Registration", icon: FileText, color: "text-amber-500", bg: "bg-amber-100", count: 1 },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  
  const handleUpload = (doc: any) => {
    setDocuments([{ ...doc, id: Date.now().toString() }, ...documents]);
    toast.success("Document uploaded successfully!");
  };

  const handleEditDocument = (id: string, updated: any) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, name: updated.name, category: updated.category } : d));
    toast.success("Document updated successfully!");
  };

  const handleDelete = (idToDelete: string) => {
    setDocuments(documents.filter((d) => d.id !== idToDelete));
    toast.error("Document deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  const filteredFiles = documents.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Documents...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documents Vault</h1>
          <p className="text-slate-500 mt-1">Secure storage for all of Pixie&apos;s important files.</p>
        </div>
        <UploadDocumentModal onUpload={handleUpload}>
          <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white w-fit">
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </UploadDocumentModal>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search documents by name or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl border-slate-200 bg-white h-12 text-base shadow-sm"
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Card 
              key={idx} 
              onClick={() => setSearchQuery(cat.name === searchQuery ? "" : cat.name)}
              className={`rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${searchQuery === cat.name ? 'ring-2 ring-amber-500 bg-amber-50/50' : ''}`}
            >
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <div className={`${cat.bg} ${cat.color} p-4 rounded-full`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{cat.name}</p>
                  <p className="text-xs text-slate-500">{documents.filter(d => d.category === cat.name).length} files</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Files</h2>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 hidden md:table-cell">Size</th>
                  <th className="px-6 py-4">Date Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                          <FolderOpen className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-700">No documents found</p>
                        <p className="text-sm mt-1">Upload a file to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${file.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                          {file.type === 'pdf' ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                        </div>
                        <span className="font-medium text-slate-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal hover:bg-slate-200">
                        {file.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-500">{file.size}</td>
                    <td className="px-6 py-4 text-slate-500">{file.date}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div onClick={(e) => e.stopPropagation()}>
                        {file.dataUrl && (
                          <ViewDocumentModal doc={file}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg mr-1">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </ViewDocumentModal>
                        )}
                        <UploadDocumentModal initialData={file} onUpload={(updated) => handleEditDocument(file.id, updated)}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg mr-1">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </UploadDocumentModal>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
