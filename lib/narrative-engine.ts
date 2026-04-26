/**
 * GitInfo Narrative Engine v2.0
 * Generates elite, cyber-minimalist GitHub biographies.
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
  const role = title || "Full Stack Architect";
  const mainSkills = skills.slice(0, 8);
  const stack = (repoStack && repoStack.length > 0) ? repoStack : mainSkills;

  // British English spelling & elite vocabulary
  const vocab = {
    optimised: "optimised",
    visualising: "visualising",
    architecting: "Architecting",
    synthesising: "Synthesising",
    abstracting: "Abstracting",
    deploying: "Deploying"
  };

  const sections = {
    identity: `## // IDENTITY_ROOT\n${vocab.architecting} high-performance digital ecosystems as a **${role}**.`,
    
    logic: `## // CORE_LOGIC\nMy work revolves around ${vocab.abstracting} complex requirements into scalable system architectures. I am currently focused on ${vocab.visualising} the next generation of web mechanics, ensuring every line of code is ${vocab.optimised} for peak performance and glassmorphic elegance.`,
    
    stack: `## // STACK_TRACE\n\`\`\`text\n${stack.join(" | ")}\n\`\`\``,
    
    process: `## // ACTIVE_PROCESS\nCurrently iterating on **GitInfo** — a zero-config identity suite designed to bypass GitHub caching limitations via server-side proxy architecture.`,
    
    future: `## // FUTURE_STATE\nAdvancing academic research at **IIT Sri Lanka / University of Westminster**. Navigating towards a future in **Cybersecurity (SOC Analyst)** and Enterprise Architecture.`,
    
    status: `Status: Currently iterating on GitInfo v1.0`
  };

  if (vibe === 'elite') {
    let bio = `${sections.identity}\n\n${sections.logic}\n\n${sections.stack}\n\n${sections.process}\n\n${sections.future}\n\n---\n${sections.status}`;
    
    if (notes) {
      bio += `\n\n## // SUPPLEMENTARY_CONTEXT\n${notes}`;
    }
    
    return bio;
  }

  // Fallback to updated legacy vibes with British English
  const templates = {
    professional: {
      intro: `I am a **${role}** dedicated to architecting robust digital solutions.`,
      focus: `Currently, my technical focus is on ${vocab.visualising} systems using **${stack.slice(0,3).join(", ")}**.`,
      passion: `I am passionate about ensuring all deployments are ${vocab.optimised} for industry standards.`,
    },
    creative: {
      intro: `🚀 **${role}** synthesising ideas into interactive reality.`,
      focus: `Architecting pixels and logic with **${stack.slice(0,3).join(", ")}**.`,
      passion: `Code is the medium through which I am ${vocab.visualising} the future.`,
    },
    minimalist: {
      intro: `**${role}** | ${vocab.architecting} with **${stack.slice(0,3).join(", ")}**.`,
      focus: `Focused on ${vocab.optimised} code and minimalist systems.`,
      passion: `Abstracting complexity into simplicity.`,
    },
    technical: {
      intro: `**${role}** specialised in system design and modern web mechanics.`,
      focus: `Actively ${vocab.deploying} solutions built with **${stack.slice(0,3).join(", ")}**.`,
      passion: `Committed to continuous technical growth and system ${vocab.optimised} strategies.`,
    }
  };

  const selected = templates[vibe as keyof typeof templates] || templates.professional;
  let bio = "";

  if (length === 'short') {
    bio = `${selected.intro} ${selected.focus}`;
  } else if (length === 'medium') {
    bio = `${selected.intro}\n\n${selected.focus}\n\n${selected.passion}`;
  } else {
    bio = `${selected.intro}\n\n${selected.focus}\n\nMy primary toolkit includes: **${skills.join(", ")}**. ${selected.passion}`;
  }

  if (notes) {
    if (format === 'bullets' || format === 'mixed') {
      const bulletPoints = notes.split('\n').filter(l => l.trim()).map(l => `* ${l.trim()}`).join('\n');
      bio += `\n\n### // SUPPLEMENTARY_CONTEXT\n${bulletPoints}`;
    } else {
      bio += `\n\n${notes}`;
    }
  }

  return bio;
}
