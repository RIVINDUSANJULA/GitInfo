/**
 * GitInfo Narrative Engine v3.0 (Universal Identity Architect)
 * Generates elite GitHub biographies across five distinct strategic styles.
 */

interface BioOptions {
  username: string;
  title: string;
  skills: string[];
  socials: string[];
  vibe: 'professional' | 'creative' | 'minimalist' | 'technical' | 'elite';
  format: 'paragraph' | 'bullets' | 'mixed';
  length: 'short' | 'medium' | 'long';
  notes?: string;
  repoStack?: string[];
}

export function generateBio(options: BioOptions): string {
  const { username, title, skills, vibe, format, length, notes, repoStack } = options;
  
  const name = username || "Developer";
  const role = title || "Software Architect";
  const rawSkills = skills.length > 0 ? skills : ["Next.js", "React 19", "Tailwind v4", "TypeScript", "Zustand v5"];
  const stack = (repoStack && repoStack.length > 0) ? repoStack : rawSkills;

  // British English Dictionary
  const BE = {
    optimised: "optimised",
    visualising: "visualising",
    architecting: "Architecting",
    synthesising: "Synthesising",
    abstracting: "Abstracting",
    deploying: "Deploying",
    modelling: "modelling"
  };

  // Categorised Tech Stack
  const categories = {
    frontend: rawSkills.filter(s => /next|react|tailwind|css|html|framer|three|ui|ux/i.test(s)).slice(0, 4),
    logic: rawSkills.filter(s => /zustand|redux|state|kafka|mq|api|graphql|rest/i.test(s)).slice(0, 4),
    core: rawSkills.filter(s => /java|node|python|go|rust|c|typescript|js/i.test(s)).slice(0, 4),
    tools: rawSkills.filter(s => /docker|git|aws|gcp|vercel|supabase|firebase/i.test(s)).slice(0, 4)
  };

  const commonContext = {
    gitinfo: "Iterating on **GitInfo** — a zero-config identity suite engineered to bypass GitHub's server-side caching limitations via deterministic proxy architecture.",
    education: "Academic research at **IIT Sri Lanka / University of Westminster**, specialising in Enterprise Architecture and Cybersecurity (SOC Analyst path)."
  };

  // STYLE 1: [💼 PROFESSIONAL]
  if (vibe === 'professional') {
    const sections = [
      `# Professional Summary`,
      `I am a **${role}** dedicated to delivering high-impact, ${BE.optimised} digital solutions. My approach combines technical excellence with industry-standard patterns to build scalable architectures.`,
      `## Key Expertise`,
      rawSkills.slice(0, 6).map(s => `* **${s}** — Implementation & Optimisation`).join('\n'),
      `## Current Focus`,
      `* **${commonContext.gitinfo}**`,
      `* **${commonContext.education}**`
    ];
    return sections.join('\n\n');
  }

  // STYLE 2: [🎨 CREATIVE]
  if (vibe === 'creative') {
    const sections = [
      `# 🚀 The Intersection of Art & Logic`,
      `I don't just write code; I am **${BE.visualising}** the future of the web. As a **${role}**, I believe that software should be as beautiful as it is functional.`,
      `My work is a process of **${BE.synthesising}** raw data into immersive, glassmorphic experiences. I am currently ${BE.modelling} high-performance environments where pixels and logic dance in perfect harmony.`,
      `### The Toolkit`,
      `Building interactive reality with **${stack.slice(0, 5).join(" + ")}**.`,
      `### The Journey`,
      `Currently architecting **GitInfo** to solve the limitations of static profiles, bringing dynamic, real-time identity to the developer community.`
    ];
    return sections.join('\n\n');
  }

  // STYLE 3: [☁️ MINIMALIST]
  if (vibe === 'minimalist') {
    const sections = [
      `# ${name.toUpperCase()}`,
      `**${role}**`,
      `> ${BE.abstracting} complexity. ${BE.optimised} for performance.`,
      `## TECH`,
      stack.slice(0, 8).join(' • '),
      `## FOCUS`,
      `Architecting **GitInfo** • Bypassing cache limitations • Zero-config logic.`
    ];
    return sections.join('\n\n');
  }

  // STYLE 4: [⚙️ TECHNICAL]
  if (vibe === 'technical') {
    const sections = [
      `### // SYSTEM_SPECIFICATION`,
      `**Title:** ${role}\n**Focus:** System Design / Deterministic Engines\n**Location:** Colombo, LK (IIT / Westminster)`,
      `### // TECHNOLOGY_STACK`,
      `**Frontend:** ${categories.frontend.join(', ') || 'React 19, Next.js'}\n**Logic/MQ:** ${categories.logic.join(', ') || 'Zustand v5, Kafka'}\n**Core:** ${categories.core.join(', ') || 'TypeScript, Java'}`,
      `### // ACTIVE_BRANCH`,
      `Developing **GitInfo** (v1.0). Addressing the "GitHub Caching Bottleneck" by implementing server-side proxying for deterministic identity rendering.`,
      `### // ARCHITECTURAL_GOALS`,
      `Transitioning towards **SOC Analyst** operations and high-availability enterprise infrastructure.`
    ];
    return sections.join('\n\n');
  }

  // STYLE 5: [👑 ELITE - THE TITAN]
  const eliteSections = {
    identity: `## // IDENTITY_ROOT\n${BE.architecting} high-performance digital ecosystems as a **${role}**. Engineered for the 2026 technical landscape.`,
    
    logic: `## // CORE_LOGIC\nMy work revolves around ${BE.abstracting} complex requirements into scalable architectures. Focused on the next generation of web mechanics, ensuring every deployment is ${BE.optimised} for peak performance and glassmorphic elegance.`,
    
    stack: `## // STACK_TRACE\n\`\`\`text\n${stack.join(" | ")}\n\`\`\``,
    
    process: `## // ACTIVE_PROCESS\n${commonContext.gitinfo}`,
    
    future: `## // FUTURE_STATE\n${commonContext.education}`,
    
    status: `Status: Currently iterating on GitInfo v1.0`
  };

  let bio = `${eliteSections.identity}\n\n${eliteSections.logic}\n\n${eliteSections.stack}\n\n${eliteSections.process}\n\n${eliteSections.future}\n\n---\n${eliteSections.status}`;
  
  if (notes) {
    bio += `\n\n## // SUPPLEMENTARY_CONTEXT\n${notes}`;
  }
  
  return bio;
}
