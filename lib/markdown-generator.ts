import { BuilderState } from '@/store/useBuilderStore';

export interface MarkdownResult {
  header: string;
  customLanguages: string;
  widgets: string;
  footer: string;
  full: string;
}

function getSlug(name: string) {
  // Simple Icons slugs mapping
  const mapping: Record<string, string> = {
    'nodejs': 'nodejs',
    'react': 'react',
    'typescript': 'typescript',
    'javascript': 'javascript',
    'python': 'python',
    'tailwind': 'tailwind',
    'next.js': 'nextjs',
    'mongodb': 'mongodb',
    'docker': 'docker',
    'git': 'git',
    'github': 'github',
    'visual studio code': 'vscode',
    'figma': 'figma',
    'firebase': 'firebase',
    'mysql': 'mysql',
    'postgresql': 'postgres',
    'redis': 'redis',
    'graphql': 'graphql',
    'apollo': 'apollo',
    'rust': 'rust',
    'go': 'go',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'flutter': 'flutter',
    'tensorflow': 'tensorflow',
    'pytorch': 'pytorch',
    'kubernetes': 'kubernetes',
    'aws': 'aws',
    'azure': 'azure',
    'google cloud': 'gcp',
    'linux': 'linux',
    'nginx': 'nginx',
    'apache': 'apache',
    'bash': 'bash',
    'markdown': 'md',
    'html5': 'html',
    'css3': 'css',
    'sass': 'sass',
    'less': 'less',
    'postman': 'postman',
    'npm': 'npm',
    'yarn': 'yarn',
    'pnpm': 'pnpm',
  };

  const lower = name.toLowerCase();
  if (mapping[lower]) return mapping[lower];

  return lower
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
}

export function generateMarkdown(state: BuilderState): MarkdownResult {
  const empty = { header: '', customLanguages: '', widgets: '', footer: '', full: '' };
  if (!state.username) {
    return { ...empty, full: '<!-- Please enter your GitHub username to generate the README -->' };
  }

  const {
    username,
    showStats,
    showStreak,
    showTrophies,
    showTopRepos,
    showLanguages,
    showBadges,
    analyticsConfig,
    badgesConfig,
    manualSkills,
    hiddenLanguages,
    hiddenSkills,
    theme,
    customBgColor,
    customTextColor,
    customIconColor,
    customBorderColor,
    hideBorder,
    layout,
    widgetOrder,
  } = state;

  let themeParams = `&theme=${theme}`;
  if (theme === 'custom') {
    themeParams = `&bg_color=${customBgColor}&title_color=${customTextColor}&text_color=${customTextColor}&icon_color=${customIconColor}&border_color=${customBorderColor}`;
  }
  if (hideBorder) {
    themeParams += '&hide_border=true';
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://github-customizer.vercel.app';

  const header = `<h1 align="center">Hi there, I'm ${username} 👋</h1>\n\n`;

  let widgets = '';
  
  // Dynamic Widget Generation based on order
  widgetOrder.forEach((id) => {
    if (id === 'languages' && showLanguages) {
      const advancedParams = `&blockRadius=${analyticsConfig.blockRadius}&elementRadius=${analyticsConfig.elementRadius}&showGlow=${analyticsConfig.showGlow}&animationSpeed=${analyticsConfig.animationSpeed}&donutHoleSize=${analyticsConfig.donutHoleSize}&startAngle=${analyticsConfig.startAngle}&barHeight=${analyticsConfig.barHeight}&lineThickness=${analyticsConfig.lineThickness}&cardsPerRow=${analyticsConfig.cardsPerRow}&shadowDepth=${analyticsConfig.shadowDepth}&bgType=${analyticsConfig.bgType}&bgColor2=${analyticsConfig.bgColor2}&pieShowHoverLabels=${analyticsConfig.pieShowHoverLabels}&pieLabelPosition=${analyticsConfig.pieLabelPosition}&pieHideLegend=${analyticsConfig.pieHideLegend}`;
      widgets += `<div align="center">\n  <img src="${baseUrl}/api/github-languages?username=${username}&include_contribs=${analyticsConfig.includeContributions}&limit=${analyticsConfig.languageLimit}&layout=${analyticsConfig.layout}${themeParams}${advancedParams}" alt="Detailed Language Analytics" />\n</div>\n\n`;
    }

    if (id === 'badges' && showBadges) {
      const allSkills = [
        ...state.autoLanguages.filter(l => !hiddenLanguages.includes(l.name)).map(l => l.name),
        ...manualSkills.filter(s => !hiddenSkills.includes(s))
      ];

      if (allSkills.length > 0) {
        widgets += `<div align="center">\n`;
        if (badgesConfig.badgeStyle === 'skillicons') {
          const slugs = allSkills.map(s => getSlug(s)).join(',');
          widgets += `  <img src="https://skillicons.dev/icons?i=${slugs}&theme=${badgesConfig.skillIconTheme}&perline=${badgesConfig.skillIconsPerRow}" alt="My Skills" />\n`;
        } else {
          allSkills.forEach(skill => {
            if (badgesConfig.badgeStyle === 'shields') {
              const slug = getSlug(skill);
              const color = badgesConfig.useOfficialColors ? '20232a' : customIconColor;
              const logoColor = badgesConfig.useOfficialColors ? 'white' : customTextColor;
              widgets += `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-%23${color}.svg?style=for-the-badge&logo=${slug}&logoColor=${logoColor}" alt="${skill}" loading="lazy" />\n`;
            } else {
              const color = badgesConfig.badgeColorMode === 'brand' ? '' : `&color=${customIconColor}`;
              widgets += `  <img src="${baseUrl}/api/badge?name=${encodeURIComponent(skill)}${color}&size=${badgesConfig.badgeSize}&radius=${badgesConfig.elementRadius}&useOfficialColor=${badgesConfig.useOfficialColors}&showGlow=${analyticsConfig.showGlow}" alt="${skill}" loading="lazy" />\n`;
            }
          });
        }
        widgets += `</div>\n\n`;
      }
    }

    if (id === 'stats' && showStats) {
      widgets += `<div align="center">\n  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true${themeParams}" alt="${username}'s GitHub Stats" />\n</div>\n\n`;
    }

    if (id === 'streak' && showStreak) {
      widgets += `<div align="center">\n  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}${themeParams.replace('bg_color', 'background').replace('title_color', 'stroke').replace('text_color', 'currStreakNum').replace('icon_color', 'fire')}" alt="${username}'s GitHub Streak" />\n</div>\n\n`;
    }

    if (id === 'trophies' && showTrophies) {
      widgets += `<div align="center">\n  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme === 'custom' ? 'flat' : theme}&no-frame=false&no-bg=true&margin-w=15" alt="trophies" />\n</div>\n\n`;
    }
  });

  const footer = `\n<!-- Generated by GitCustomize (github-customizer.vercel.app) -->\n`;

  return {
    header,
    customLanguages: '', // Merged into widgets for order
    widgets,
    footer,
    full: `${header}${widgets}${footer}`
  };
}
