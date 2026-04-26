"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

import { AnimatePresence } from "framer-motion";

export function LanguageStats() {
  const store = useBuilderStore();
  const limit = store.analyticsConfig.languageLimit || 6;
  const rawLanguages = Array.isArray(store.autoLanguages) ? store.autoLanguages : [];
  const languages = rawLanguages.slice(0, limit);
  const layout = store.analyticsConfig.layout || 'modern-bar';
  
  const isSyncing = store.username && languages.length === 0;

  if (isSyncing) return <SkeletonShimmer layout={layout} />;

  if (languages.length === 0) {
    return (
      <div className="w-full p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">// NO_PUBLIC_DATA_FOUND</p>
        <p className="text-[8px] text-slate-600 mt-2">Enter a valid GitHub username to initiate trace</p>
      </div>
    );
  }

  // Titan Geometric DNA
  const blockRadius = "40px";
  const elementRadius = "20px";

  return (
    <div 
      className="w-full space-y-6 p-8 bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden group"
      style={{ 
        borderRadius: blockRadius,
        backdropFilter: `blur(var(--blur-amount, ${store.analyticsConfig.blurStrength}px))`,
        '--glow-intensity': store.analyticsConfig.glowIntensity,
        '--blur-amount': `${store.analyticsConfig.blurStrength}px`
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          // NEON_ANALYTICS_V4
        </h3>
        <div className="flex gap-2 items-center bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_theme(colors.emerald.500)]" />
          <span className="text-[7px] font-black text-emerald-500/80 uppercase tracking-widest">GRAPHQL_ACTIVE</span>
        </div>
      </div>

      <div className="relative z-10 min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={layout}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="w-full"
          >
            {layout === 'compact' && <CompactList languages={languages} elementRadius={elementRadius} />}
            {layout === 'pie' && <PieChart languages={languages} />}
            {layout === 'modern-bar' && <ModernBars languages={languages} elementRadius={elementRadius} />}
            {layout === 'soft-cards' && <SoftCards languages={languages} elementRadius={elementRadius} />}
            {layout === 'minimalist-line' && <MinimalistLine languages={languages} elementRadius={elementRadius} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">TITAN_ENGINE_RECON</p>
        <div className="flex gap-4">
          <div className="h-1 w-8 bg-indigo-500/20 rounded-full overflow-hidden">
             <motion.div className="h-full bg-indigo-500" animate={{ x: [-32, 32] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const getNeonStyle = (color: string, baseIntensity: number = 0.5) => ({
  '--lang-color': color,
  boxShadow: `0 0 calc(30px * var(--glow-intensity, ${baseIntensity})) var(--lang-color)66, inset 0 0 calc(10px * var(--glow-intensity, ${baseIntensity})) var(--lang-color)33`,
  border: `1px solid ${color}33`,
  background: `linear-gradient(135deg, ${color}11, transparent)`,
});

function SkeletonShimmer({ layout }: { layout: string }) {
  return (
    <div className="w-full p-8 bg-white/5 border border-white/10 rounded-[40px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-12 bg-white/10 rounded animate-pulse" />
        </div>

        {layout === 'pie' ? (
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="w-40 h-40 rounded-full border-8 border-white/10 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-2 w-20 bg-white/10 rounded animate-pulse" />)}
            </div>
          </div>
        ) : layout === 'soft-cards' ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-white/10 rounded-[20px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-2 w-full bg-white/10 rounded-[20px] animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompactList({ languages, elementRadius }: { languages: LanguageData[], elementRadius: string }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-4">
      {languages.map((lang, i) => (
        <motion.div 
          key={lang.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between group/item p-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
          style={{ borderRadius: elementRadius }}
        >
          <div className="flex items-center gap-4">
             <div 
              className="w-2 h-2 shadow-[0_0_15px_var(--lang-color)]" 
              style={{ ...getNeonStyle(lang.color, 0.8), borderRadius: "50%" }}
            />
            <span className="text-[11px] font-black text-slate-300 group-hover/item:text-white transition-colors uppercase tracking-widest">{lang.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${lang.percentage}%` }} className="h-full" style={{ backgroundColor: lang.color }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">{lang.percentage.toFixed(1)}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ModernBars({ languages, elementRadius }: { languages: LanguageData[], elementRadius: string }) {
  const store = useBuilderStore();
  const barHeight = store.analyticsConfig.barHeight || 24;
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-6">
      {languages.map((lang, index) => (
        <motion.div 
          key={lang.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.15em]">{lang.name}</span>
            <span className="text-[10px] font-mono font-bold text-indigo-400">{lang.percentage.toFixed(1)}%</span>
          </div>
          <div className="relative w-full bg-white/5 overflow-hidden border border-white/5 p-[1px]" style={{ height: `${barHeight}px`, borderRadius: elementRadius }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
              className="absolute inset-y-0 left-0"
              style={{ 
                ...getNeonStyle(lang.color, store.analyticsConfig.showGlow ? 1 : 0),
                borderRadius: elementRadius,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer opacity-30" />
              <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" style={{ borderRadius: elementRadius }} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PieChart({ languages }: { languages: LanguageData[] }) {
  const store = useBuilderStore();
  const donutHoleSize = store.analyticsConfig.donutHoleSize || 60;
  if (!Array.isArray(languages)) return null;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex items-center justify-center gap-8 py-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {languages.map((lang, i) => {
            const strokeDasharray = `${(lang.percentage * circumference) / 100} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (lang.percentage * circumference) / 100;

            return (
              <motion.circle
                key={lang.name}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={lang.color}
                strokeWidth="14"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: i * 0.1 }}
                style={{ 
                  filter: store.analyticsConfig.showGlow 
                    ? `drop-shadow(0 0 12px ${lang.color}88) drop-shadow(0 0 4px ${lang.color})` 
                    : undefined,
                  strokeLinecap: "round"
                }}
                className="hover:stroke-[16px] transition-all duration-300 cursor-pointer"
              />
            );
          })}
          {/* Inner glass circle (Donut hole) */}
          <circle cx="50" cy="50" r={radius * (donutHoleSize / 100)} fill="rgba(255,255,255,0.02)" className="backdrop-blur-[40px]" />
          <circle cx="50" cy="50" r={radius * (donutHoleSize / 100)} fill="transparent" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-[8px] font-black text-slate-500 tracking-tighter">TOTAL_BYTES</span>
           <span className="text-[12px] font-black text-white">100%</span>
        </div>
      </div>
      {!store.analyticsConfig.pieHideLegend && (
        <div className="space-y-2">
          {languages.map((lang, i) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lang.name}</span>
              <span className="text-[9px] font-mono text-slate-600">{lang.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SoftCards({ languages, elementRadius }: { languages: LanguageData[], elementRadius: string }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {languages.map((lang, i) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
          className="p-4 bg-white/5 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition-all duration-500 group/card relative overflow-hidden"
          style={{ ...getNeonStyle(lang.color, 0.4), borderRadius: elementRadius }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="w-5 h-5 bg-white/5 flex items-center justify-center border border-white/10" style={{ borderRadius: "8px" }}>
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}` }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 group-hover/card:text-white transition-colors">{lang.percentage.toFixed(0)}%</span>
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[9px] font-black uppercase text-slate-200 tracking-wider truncate block">{lang.name}</span>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${lang.percentage}%` }} className="h-full" style={{ backgroundColor: lang.color }} />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-10 group-hover/card:opacity-20 transition-opacity">
            <svg width="40" height="20" viewBox="0 0 40 20">
              <path d="M0 15 L10 5 L20 18 L30 8 L40 12" fill="none" stroke={lang.color} strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MinimalistLine({ languages, elementRadius }: { languages: LanguageData[], elementRadius: string }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-8 py-6">
      <div 
        className="h-5 w-full bg-white/5 overflow-hidden flex border border-white/10 shadow-inner p-[2px]"
        style={{ borderRadius: elementRadius }}
      >
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ flex: 0, opacity: 0 }}
            animate={{ flex: lang.percentage, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="h-full relative group/segment"
            style={{ backgroundColor: lang.color, borderRight: i < languages.length - 1 ? '2px solid rgba(0,0,0,0.2)' : 'none' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
        {languages.map(lang => (
          <div key={lang.name} className="flex items-center gap-3 group/leg">
            <div className="w-2.5 h-2.5 shadow-[0_0_10px_var(--lang-color)]" style={{ ...getNeonStyle(lang.color, 0.6), borderRadius: "4px" }} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 group-hover/leg:text-white transition-colors uppercase tracking-widest">{lang.name}</span>
              <span className="text-[9px] font-mono font-bold text-slate-600">{lang.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
