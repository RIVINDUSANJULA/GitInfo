"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

export function LanguageStats() {
  const store = useBuilderStore();
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store.username) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/github/languages?username=${store.username}&include_contribs=${store.analyticsConfig.includeContributions}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setLanguages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [store.username, store.analyticsConfig.includeContributions]);

  if (loading) {
    return (
      <div className="w-full space-y-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between h-3 w-full bg-white/5 rounded-full" />
            <div className="h-2 w-full bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error || languages.length === 0) {
    return (
      <div className="w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
        <p className="text-xs text-slate-400 italic">Data Syncing...</p>
      </div>
    );
  }

  // Get accent color from store for neon glow
  const accent = `#${store.aboutMeConfig.accentColor || 'f43f5e'}`;

  return (
    <div className="w-full space-y-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          // LANGUAGE_DISTRIBUTION
        </h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-500/80 uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-5">
        {languages.map((lang, index) => (
          <motion.div 
            key={lang.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--glow)]" 
                  style={{ backgroundColor: lang.color, '--glow': lang.color } as any}
                />
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                  {lang.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {lang.percentage.toFixed(1)}%
              </span>
            </div>

            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 1, ease: "circOut", delay: index * 0.1 }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ 
                  backgroundColor: lang.color,
                  boxShadow: `0 0 15px ${lang.color}44`
                }}
              />
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-tight text-center">
          Aggregated via GitInfo Byte-Count Engine v1.0
        </p>
      </div>
    </div>
  );
}
