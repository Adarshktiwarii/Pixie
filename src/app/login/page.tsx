"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePixie } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { login } = usePixie();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        // Supabase might require email verification, but we'll assume it logs them in
        // or we handle the error if it requires verification.
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      
      login(); // update local context immediately to bypass checking momentarily
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-amber-600 p-2.5 rounded-xl text-white shadow-md">
                <PawPrint className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Pixie</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-slate-500">
              {isSignUp ? "Sign up to securely sync Pixie's records to the cloud." : "Enter your details to access Pixie's records."}
            </p>
          </div>

          <div className="bg-white px-8 py-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <form onSubmit={handleAuth} className="space-y-6">
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  {!isSignUp && (
                    <a href="#" className="text-sm font-medium text-amber-600 hover:text-amber-500">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> {isSignUp ? "Creating account..." : "Logging in..."}
                  </span>
                ) : (
                  isSignUp ? "Sign Up" : "Sign In"
                )}
              </Button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-sm text-slate-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} {" "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }} 
              className="font-medium text-amber-600 hover:text-amber-500"
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right side - Hero Image / Branding */}
      <div className="hidden lg:flex flex-1 relative bg-amber-50 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 mix-blend-multiply" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-lg text-center px-8">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 mb-8 inline-block transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <PawPrint className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 text-lg">Pixie Passport</h3>
                <p className="text-slate-500">Your pet's lifelong companion</p>
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Everything your pet needs, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">in one place.</span>
          </h2>
          <p className="text-lg text-slate-600">
            Manage medical records, track growth milestones, and keep all important documents securely stored and instantly synced to the cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
