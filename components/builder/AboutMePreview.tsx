"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AboutMePreview() {
  const store = useBuilderStore();
  const { aboutMe, aboutMeConfig, showAboutMe, theme, customIconColor } = store;
  const isGenerating = aboutMeConfig.isGenerating;
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (aboutMeConfig.preset === 'matrix') {
      setGlitch(true);
      const timer = setTimeout(() => setGlitch(false), 300);
      return () => clearTimeout(timer);
    }
  }, [aboutMeConfig.preset]);

  if (!showAboutMe) return null;

  // Preset Overrides
  const isMatrix = aboutMeConfig.preset === 'matrix';
  const isPaper = aboutMeConfig.preset === 'paper';
  
  const glowColor = isMatrix ? '#00FF41' : (theme === 'custom' ? `#${customIconColor}` : '#f43f5e');
  const headerLabel = isMatrix ? '[SECURE_ACCESS]' : (isPaper ? '[MEMO]' : aboutMeConfig.headerLabel);
  
  const content = isGenerating 
    ? "Synthesizing your professional narrative... generating technical insights and career milestones based on your technical stack and manual notes."
    : (aboutMe || "### Your Professional Story Starts Here\nUse the **AI Generator** or switch to **Manual Mode** in the sidebar to write your bio. It will appear here with beautiful glassmorphism and neon accents!");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group w-full"
      style={{
        '--bio-glow': glowColor,
        '--bio-blur': `${aboutMeConfig.glassBlur}px`,
        '--bio-border-op': isMatrix ? '0.6' : aboutMeConfig.borderOpacity,
        '--bio-glass-op': isPaper ? '1' : aboutMeConfig.glassOpacity,
        '--bio-spread': `${aboutMeConfig.glowSpread}px`,
      } as any}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-700 shadow-2xl",
          isMatrix ? "bg-black font-mono" : (isPaper ? "bg-[#F5F5F5] font-serif text-slate-900" : "bg-black/40 backdrop-blur-[var(--bio-blur)]"),
          glitch && "animate-glitch",
          !aboutMe && !isGenerating && "border-dashed opacity-60"
        )}
        style={{ 
          borderRadius: `${aboutMeConfig.blockRadius}px`,
          border: isPaper ? 'none' : `1px ${aboutMeConfig.borderStyle} var(--bio-glow)`,
          borderColor: isPaper ? 'transparent' : `rgba(${parseInt(glowColor.slice(1,3), 16)}, ${parseInt(glowColor.slice(3,5), 16)}, ${parseInt(glowColor.slice(5,7), 16)}, var(--bio-border-op))`,
          boxShadow: (aboutMeConfig.showGlow && !isPaper) ? `0 0 var(--bio-spread) -12px var(--bio-glow)` : (isPaper ? '0 10px 30px -10px rgba(0,0,0,0.1)' : undefined)
        }}
      >
        {/* Matrix Scanline Effect */}
        {isMatrix && (
          <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] animate-scanline bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0)_0px,rgba(0,0,0,0)_1px,#00FF41_2px,rgba(0,0,0,0)_3px)] bg-[length:100%_4px]" />
        )}

        {/* Shimmer Overlay for Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            >
              <div 
                className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${glowColor}05, ${glowColor}20, ${glowColor}05, transparent)`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Header Label */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
          {!isPaper && (
            <div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ 
                backgroundColor: glowColor,
                boxShadow: `0 0 8px ${glowColor}`
              }} 
            />
          )}
          <span className={cn(
            "text-[9px] font-mono font-bold tracking-[0.3em] uppercase",
            isMatrix ? "text-[#00FF41]" : (isPaper ? "text-slate-400" : "text-white/50")
          )}>
            {headerLabel}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-14 relative z-10">
          <div className={cn(
            "prose prose-sm max-w-none transition-all duration-1000",
            !isPaper && "dark:prose-invert",
            isGenerating ? "opacity-20 blur-[3px]" : "opacity-100 blur-0",
            isMatrix ? "prose-p:text-[#00FF41]/90 prose-headings:text-[#00FF41] font-mono" : (isPaper ? "prose-p:text-slate-700 prose-headings:text-slate-900" : "prose-p:text-slate-300/90 prose-headings:text-white"),
            "prose-p:leading-[1.6] prose-headings:font-black prose-headings:tracking-tight",
            "prose-strong:font-black",
            !isPaper && "prose-strong:text-white",
            "prose-ul:list-none prose-ul:pl-0",
            "prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-2 prose-li:before:h-[1px] prose-li:before:opacity-30"
          )}
          style={{ 
            "--tw-prose-bullets": glowColor,
            "--tw-prose-counters": glowColor,
            "--tw-prose-links": glowColor,
            "--tw-prose-bold": isPaper ? 'inherit' : "white",
          } as any}>
            <ReactMarkdown key={aboutMe || 'loading'}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Minimal Decorative Gradients */}
        {!isMatrix && !isPaper && (
          <>
            <div 
              className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.08]"
              style={{ backgroundColor: glowColor }}
            />
            <div 
              className="absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.05]"
              style={{ backgroundColor: glowColor }}
            />
          </>
        )}

        <style jsx global>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
          }
          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 1px); }
            40% { transform: translate(-2px, -1px); }
            60% { transform: translate(2px, 1px); }
            80% { transform: translate(2px, -1px); }
            100% { transform: translate(0); }
          }
          .animate-glitch {
            animation: glitch 0.3s ease-in-out;
          }
          .animate-scanline {
            animation: scanline 10s linear infinite;
          }
        `}</style>
      </div>
    </motion.div>
  );
}
