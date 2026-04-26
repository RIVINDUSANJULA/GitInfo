/**
 * Deterministic Narrative Engine
 * Generates high-quality GitHub README bios locally without external AI dependencies.
 */

interface BioOptions {
  username: string;
  title: string;
  skills: string[];
  socials: string[];
  vibe: 'professional' | 'creative' | 'minimalist' | 'technical';
  format: 'paragraph' | 'bullets' | 'mixed';
  length: 'short' | 'medium' | 'long';
  notes?: string;
  repoStack?: string[];
}

export function generateBio(options: BioOptions): string {
  const { username, title, skills, vibe, format, length, notes, repoStack } = options;
  
  const name = username || "Developer";
  const role = title || "Software Engineer";
  const mainSkills = skills.slice(0, 5).join(", ");
  const stack = (repoStack && repoStack.length > 0) ? repoStack.slice(0, 3).join(", ") : mainSkills;

  const templates = {
    professional: {
      intro: `I am a **${role}** dedicated to building robust and scalable digital solutions.`,
      focus: `Currently, my technical focus revolves around **${stack}**, ensuring high-quality code and performance.`,
      passion: `I am passionate about software architecture and creating seamless user experiences.`,
    },
    creative: {
      intro: `🚀 **${role}** on a mission to transform ideas into interactive reality.`,
      focus: `Dancing between pixels and logic with **${stack}**.`,
      passion: `I believe code is art, and I'm here to paint something meaningful.`,
    },
    minimalist: {
      intro: `**${role}** | Building with **${stack}**.`,
      focus: `Focused on clean code and efficient systems.`,
      passion: `Simplicity is the ultimate sophistication.`,
    },
    technical: {
      intro: `**${role}** specializing in system design and modern web technologies.`,
      focus: `Actively developing with a stack consisting of **${stack}**.`,
      passion: `Optimization-driven and committed to continuous technical growth.`,
    }
  };

  const selected = templates[vibe] || templates.professional;
  let bio = "";

  // Paragraph construction
  if (length === 'short') {
    bio = `${selected.intro} ${selected.focus}`;
  } else if (length === 'medium') {
    bio = `${selected.intro}\n\n${selected.focus}\n\n${selected.passion}`;
  } else {
    bio = `${selected.intro}\n\n${selected.focus}\n\nMy toolkit includes **${skills.join(", ")}**. ${selected.passion}`;
  }

  // Inject Notes
  if (notes) {
    if (format === 'bullets' || format === 'mixed') {
      const bulletPoints = notes.split('\n').filter(l => l.trim()).map(l => `* ${l.trim()}`).join('\n');
      bio += `\n\n### ⚡ Quick Facts\n${bulletPoints}`;
    } else {
      bio += `\n\n${notes}`;
    }
  }

  return bio;
}
