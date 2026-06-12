"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale, Target, TrendingUp, Plus, Trash2, Edit2 } from "lucide-react";
import { LogWeightModal } from "@/components/modals/LogWeightModal";
import { usePixie } from "@/lib/context";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function GrowthTracker() {
  const { growthData, setGrowthData, isLoaded } = usePixie();


  const handleLogWeight = (weight: number, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setGrowthData([...growthData, { id: Date.now().toString(), date: formattedDate, weight }]);
    toast.success("Weight logged successfully!");
  };

  const handleEditWeight = (id: string, weight: number, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setGrowthData(growthData.map(log => log.id === id ? { ...log, date: formattedDate, weight } : log));
    toast.success("Weight log updated!");
  };

  const handleDeleteWeight = (idToDelete: string) => {
    setGrowthData(growthData.filter((log) => log.id !== idToDelete));
    toast.error("Weight log deleted", { style: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444' } });
  };

  const sortedData = [...growthData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const currentWeight = sortedData.length > 0 ? sortedData[sortedData.length - 1].weight : "--";
  
  let growthTrendStr = "--";
  if (sortedData.length > 1) {
    const last = sortedData[sortedData.length - 1].weight;
    const prev = sortedData[sortedData.length - 2].weight;
    const diff = last - prev;
    growthTrendStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  }

  const targetWeight = "--";

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Growth Data...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Growth Tracker</h1>
          <p className="text-slate-500 mt-1">Monitor weight, height, and body condition.</p>
        </div>
        <LogWeightModal onLog={handleLogWeight}>
          <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-fit">
            <Plus className="mr-2 h-4 w-4" /> Add Weight
          </Button>
        </LogWeightModal>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Current Weight</p>
                <p className="text-3xl font-bold text-slate-900">{currentWeight} <span className="text-lg text-slate-500 font-normal">kg</span></p>
              </div>
              <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                <Scale className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Growth Trend</p>
                <p className="text-3xl font-bold text-emerald-600">{growthTrendStr} <span className="text-lg font-normal">kg</span></p>
                <p className="text-xs text-slate-500 mt-1">Since last log</p>
              </div>
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Target Adult Weight</p>
                <p className="text-3xl font-bold text-slate-900">{targetWeight} <span className="text-lg text-slate-500 font-normal">kg</span></p>
                <p className="text-xs text-slate-500 mt-1">Not Set</p>
              </div>
              <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-800">Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {growthData.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500">No weight logs recorded.</td></tr>
              ) : (
              growthData.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{log.date}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{log.weight} kg</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <LogWeightModal initialData={log} onLog={(weight, date) => handleEditWeight(log.id, weight, date)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg mr-1">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </LogWeightModal>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWeight(log.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-800">Visual Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-[300px]">
          {growthData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Scale className="h-10 w-10 text-slate-300 mb-2" />
              <p>No weight data logged yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#d97706" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#d97706', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
