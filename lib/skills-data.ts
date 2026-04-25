export interface BrandData {
  name: string;
  color: string;
  icon?: string;
}

export const SKILL_BRANDS: Record<string, BrandData> = {
  // Languages
  python: { name: "Python", color: "3776ab", icon: "python" },
  javascript: { name: "JavaScript", color: "f7df1e", icon: "javascript" },
  typescript: { name: "TypeScript", color: "3178c6", icon: "typescript" },
  html5: { name: "HTML5", color: "e34f26", icon: "html5" },
  css3: { name: "CSS3", color: "1572b6", icon: "css3" },
  "c#": { name: "C#", color: "239120", icon: "csharp" },
  cpp: { name: "C++", color: "00599c", icon: "cplusplus" },
  java: { name: "Java", color: "007396", icon: "java" },
  php: { name: "PHP", color: "777bb4", icon: "php" },
  ruby: { name: "Ruby", color: "cc342d", icon: "ruby" },
  swift: { name: "Swift", color: "f05138", icon: "swift" },
  go: { name: "Go", color: "00add8", icon: "go" },
  rust: { name: "Rust", color: "000000", icon: "rust" },
  
  // Frameworks/Tools
  react: { name: "React", color: "61dafb", icon: "react" },
  nextjs: { name: "Next.js", color: "000000", icon: "nextdotjs" },
  vue: { name: "Vue.js", color: "4fc08d", icon: "vuedotjs" },
  angular: { name: "Angular", color: "dd0031", icon: "angular" },
  nodejs: { name: "Node.js", color: "339933", icon: "nodedotjs" },
  docker: { name: "Docker", color: "2496ed", icon: "docker" },
  figma: { name: "Figma", color: "f24e1e", icon: "figma" },
  adobephotoshop: { name: "Adobe Photoshop", color: "31a8ff", icon: "adobephotoshop" },
  adobeillustrator: { name: "Adobe Illustrator", color: "ff9a00", icon: "adobeillustrator" },
  tailwind: { name: "Tailwind CSS", color: "06b6d4", icon: "tailwindcss" },
  mongodb: { name: "MongoDB", color: "47a248", icon: "mongodb" },
  postgresql: { name: "PostgreSQL", color: "4169e1", icon: "postgresql" },
  firebase: { name: "Firebase", color: "ffca28", icon: "firebase" },
  aws: { name: "AWS", color: "232f3e", icon: "amazonaws" },
  git: { name: "Git", color: "f05032", icon: "git" },
};

export function getBrandData(name: string): BrandData {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return SKILL_BRANDS[key] || { name, color: "4f46e5", icon: "code" };
}

export const POPULAR_SKILLS = Object.values(SKILL_BRANDS).map(b => b.name);
