<div align="center">

# GitInfo

**Elevate your GitHub profile with high-fidelity analytics, premium skill badges, and dynamic aesthetic themes.**<br>
[Not Live Yet](#)

[![License: AGPL](https://img.shields.io/badge/License-AGPL-blue.svg?style=flat-square)](LICENSE)
[![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-emerald.svg?style=flat-square)]()
[![Next.js 16.2.4](https://img.shields.io/badge/Next.js_16.2.4-black?style=flat-square&logo=next.js)]()
[![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-38bdf8?style=flat-square&logo=tailwind-css)]()
[![REST Fallback](https://img.shields.io/badge/Setup-GitHub_API_Key-brightgreen?style=flat-square)]()

<br />

**GitInfo** is an advanced GitHub profile enhancement suite designed for developers who want more than just a static bio. It leverages the **GitHub GraphQL API** to perform a "Titan-Class" deep-sync, aggregating repository data and language statistics across your entire portfolio—including contributions to public organizations and collaborative projects. Whether you're looking to showcase a neon-glow tech stack or a minimalist data-driven analytics chart, GitInfo provides a real-time, premium preview engine to build and export your ideal profile aesthetic.

</div>

---

## ✨ Core Architecture

We engineered this suite to bridge the gap between static Markdown and living web applications, providing a seamless configuration engine with robust fallback methods.

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>📊 Titan-Class Analytics (Token Required)</h3>
      <p>Move beyond owned repos. Aggregate language bytes from all public contributions, organizations, and collaborations using our GraphQL deep-sync technology.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🛡️ Premium Skill Badges</h3>
      <p>5+ distinct styles including <i>Artistic</i>, <i>Shields</i>, and <i>Modern Soft</i>. Features include custom glow intensity, official brand colors, and dynamic icon toggling.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎨 Aesthetic Live Preview</h3>
      <p>A real-time sidebar configuration engine with instant visual feedback and "Matrix", "Frost", and "Magma" visual presets.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Under The Hood

GitInfo combines a modern frontend stack with a custom API layer to generate beautiful, README-ready snippets that mirror your web configuration.

| Feature / Input | Engineering Mechanic | Visual Result |
| :--- | :--- | :--- |
| **Data Aggregation** | GraphQL API (v4) + REST Fallback | Deep-syncs repo data across your entire portfolio seamlessly. |
| **Badge Generation** | Custom SVG Generator API | Renders pixel-perfect badges with dynamic recoloring and applied filters. |
| **State & Config** | Zustand Persistent Config Store | Remembers your precise layout and aesthetic choices across sessions. |
| **Code Export** | One-Click Export Engine | Instantly generates README-ready Markdown and SVG snippets. |

---

## ⚙️ The Tech Stack

Built on the absolute bleeding edge of the modern web ecosystem.

* **Framework:** Next.js 16.2 (App Router, Turbopack)
* **State Management:** Zustand (Persistent Config Store)
* **Animations:** Framer Motion (Smooth Transitions & Micro-interactions)
* **Styling:** Tailwind CSS v4 (Modern Utility-first CSS)
* **API & Data:** GitHub GraphQL API (v4) with REST Scraper Fallback
* **Icons:** Simple Icons & Lucide React
* **Badge Engine:** Custom SVG Generator API

---

## 🚀 Quick Start

GitInfo is designed to run instantly out-of-the-box using our REST fallback for basic data. However, to unlock the true **Titan-Class deep-sync analytics**, setting up a GitHub Personal Access Token is highly recommended.

```bash
# 1. Clone the repository
git clone https://github.com/RIVINDUSANJULA/GitHub-Customizer.git
cd GitHub-Customizer

# 2. Install Dependencies
npm install

# 3. Configure Environment (For Titan-Class Analytics)
# Create a .env file in the root directory:
GITHUB_TOKEN=your_personal_access_token_here

# 4. Start the development server with Turbopack
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📂 Project Structure

```ascii
GitHub-Customizer/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # GraphQL & Badge Generation Routes
│   └── builder/          # Main Customizer Interface
├── components/           # UI Components
│   ├── builder/          # Sidebar, Preview, & Grid Logic
│   └── ui/               # Atomic Design System
├── lib/                  # Core Utilities & GitHub Engine
├── public/               # Static Assets
├── store/                # Zustand Store (State & Config)
└── tailwind.config.ts    # Styling Configuration
```

---

## 🤝 Contributing

We welcome contributions! To get started:
1.  **Fork** the repository.
2.  Create a **feature branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 👨‍💻 About the Developer

Hi, I'm **Rivindu Sanjula**. I started this project as a small idea to upgrade my own GitHub profile, and it quickly grew into the Titan-Class tool you see today! As a Computer Science student currently seeking software engineering internships for 2026, I'm always building and learning. 

Feel free to reach out: [LinkedIn](http://linkedin.com/in/rivindusanjula/) | [GitHub](https://github.com/RIVINDUSANJULA) | [Email](mailto:your.email@example.com)

---

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<br>
<div align="center">
<i>Built with passion by the Rivindu Sanjula.</i>
</div>