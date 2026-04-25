"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SkillBadgeGrid() {
  const store = useBuilderStore();
  const { 
    manualSkills, 
    autoLanguages, 
    hiddenLanguages, 
    hiddenSkills, 
    badgesConfig,
    analyticsConfig,
    customIconColor
  } = store;

  const { badgeColorMode, badgeSize, elementRadius, useOfficialColors } = badgesConfig;
  const { showGlow } = analyticsConfig;

  const visibleAutoLangs = autoLanguages.filter(l => !hiddenLanguages.includes(l.name));
  const visibleManualSkills = manualSkills.filter(s => !hiddenSkills.includes(s));

  // Combine them
  const allVisibleSkills = [
    ...visibleAutoLangs.map(l => ({ name: l.name, type: 'auto' as const })),
    ...visibleManualSkills.map(s => ({ name: s, type: 'manual' as const }))
  ];

  if (allVisibleSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl text-slate-400">
        <p className="text-sm italic">No visible skills or languages. Add some or check visibility.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <AnimatePresence mode="popLayout">
        {allVisibleSkills.map((skill) => {
          const color = customIconColor;
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          
          return (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <img 
                src={`${baseUrl}/api/badge?name=${encodeURIComponent(skill.name)}&color=${color}&size=${badgeSize}&radius=${elementRadius}&useOfficialColor=${useOfficialColors}&showGlow=${showGlow}`} 
                alt={skill.name}
                className={cn(
                  "shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default",
                  badgeSize === 'sm' ? "h-[26px]" : "h-[32px]"
                )}
                style={{ borderRadius: `${elementRadius}px` }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
