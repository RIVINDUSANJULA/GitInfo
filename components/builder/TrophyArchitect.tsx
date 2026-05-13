"use client";

import { useBuilderStore, Trophy } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import { Star, GitCommit, Users, GitPullRequest, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  'Stars': Star,
  'Commits': GitCommit,
  'Followers': Users,
  'PRs': GitPullRequest,
  'Issues': CircleAlert,
};

const RANK_COLORS: Record<string, string> = {
  'SSS': '#00f3ff',
  'SS': '#00f3ff',
  'A': '#00ff41',
  'B': '#1a1a1a',
  'C': '#1a1a1a',
};

const RANK_ORDER = ['SSS', 'SS', 'A', 'B', 'C'];

export function TrophyArchitect() {
  const { autoTrophies, trophiesConfig } = useBuilderStore();
  
  const filteredTrophies = autoTrophies
    .filter(t => !trophiesConfig.hiddenTrophies.includes(t.label))
    .filter(t => {
      const floorIdx = RANK_ORDER.indexOf(trophiesConfig.rankFloor);
      const trophyIdx = RANK_ORDER.indexOf(t.rank);
      return trophyIdx <= floorIdx;
    });

  if (filteredTrophies.length === 0) return null;

  return (
    <div className="w-full">
      {trophiesConfig.layout === 'vault' && (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {filteredTrophies.map((trophy, i) => (
            <TrophyCard key={trophy.label} trophy={trophy} index={i} showGlow={trophiesConfig.showGlow} />
          ))}
        </div>
      )}

      {trophiesConfig.layout === 'citadel' && (
        <div className="grid grid-cols-3 gap-4">
          {filteredTrophies.map((trophy, i) => (
            <TrophyCard key={trophy.label} trophy={trophy} index={i} showGlow={trophiesConfig.showGlow} />
          ))}
        </div>
      )}

      {trophiesConfig.layout === 'minimalist' && (
        <div className="flex flex-wrap gap-3">
          {filteredTrophies.map((trophy, i) => (
            <MinimalistTrophy key={trophy.label} trophy={trophy} index={i} showGlow={trophiesConfig.showGlow} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrophyCard({ trophy, index, showGlow }: { trophy: Trophy; index: number; showGlow: boolean }) {
  const Icon = ICON_MAP[trophy.label] || Star;
  const color = RANK_COLORS[trophy.rank];
  const isHighRank = trophy.rank === 'SSS' || trophy.rank === 'SS';
  const hasGlow = showGlow && trophy.rank !== 'B' && trophy.rank !== 'C';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 min-w-[120px] aspect-square rounded-[40px] border backdrop-blur-md transition-all",
        "bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5",
        hasGlow && "shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      )}
      style={{
        borderColor: hasGlow ? `${color}44` : undefined,
      }}
    >
      {/* Neon Glow Engine */}
      {hasGlow && (
        <motion.div
          animate={isHighRank ? {
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-[40px] blur-xl -z-10"
          style={{ backgroundColor: `${color}33` }}
        />
      )}

      <div 
        className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-white/10 dark:bg-white/5 mb-3"
        style={{ border: `1px solid ${hasGlow ? color : 'transparent'}` }}
      >
        <Icon 
          className="w-6 h-6" 
          style={{ color: hasGlow ? color : '#888' }} 
        />
      </div>

      <div className="text-center">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{trophy.label}</div>
        <div className="text-xl font-black text-white" style={{ textShadow: hasGlow ? `0 0 10px ${color}` : 'none' }}>
          {trophy.rank}
        </div>
        <div className="text-[8px] font-mono text-slate-500 mt-1">{trophy.value.toLocaleString()}</div>
      </div>
    </motion.div>
  );
}

function MinimalistTrophy({ trophy, index, showGlow }: { trophy: Trophy; index: number; showGlow: boolean }) {
  const Icon = ICON_MAP[trophy.label] || Star;
  const color = RANK_COLORS[trophy.rank];
  const hasGlow = showGlow && trophy.rank !== 'B' && trophy.rank !== 'C';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.1 }}
      className="group relative flex items-center justify-center w-10 h-10 rounded-[20px] bg-white/5 dark:bg-black/40 border border-white/10"
    >
      <Icon 
        className="w-5 h-5 transition-colors" 
        style={{ color: '#444' }} 
      />
      
      {/* Glow on hover */}
      <div 
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10"
        style={{ backgroundColor: color }}
      />
      <Icon 
        className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
        style={{ color: hasGlow ? color : '#fff' }} 
      />
    </motion.div>
  );
}
