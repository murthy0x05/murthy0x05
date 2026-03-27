export interface TerminalLine {
  type: "input" | "output" | "link";
  content: string;
  url?: string;
}

const COMMANDS: Record<string, (addOutput: (lines: TerminalLine[]) => void) => void> = {
  help: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "Available commands:" },
      { type: "output", content: "" },
      { type: "output", content: "  whoami      - About me" },
      { type: "output", content: "  projects    - My projects" },
      { type: "output", content: "  skills      - Technical skills" },
      { type: "output", content: "  resume      - Download resume" },
      { type: "output", content: "  github      - Open GitHub" },
      { type: "output", content: "  linkedin    - Open LinkedIn" },
      { type: "output", content: "  awards      - Achievements" },
      { type: "output", content: "  neofetch    - System info" },
      { type: "output", content: "  others      - Other profiles" },
      { type: "output", content: "  clear       - Clear terminal" },
      { type: "output", content: "  exit        - Close terminal" },
      { type: "output", content: "" },
    ]);
  },

  whoami: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Name:    Pavan Kumar" },
      { type: "output", content: "  Role:    AI Engineer / Software Developer" },
      { type: "output", content: "  Focus:   AI systems, Machine Learning, Deep Learning problem solving" },
      { type: "output", content: "  Based:   India" },
      { type: "output", content: "" },
    ]);
  },

  projects: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Projects:" },
      { type: "output", content: "" },
      { type: "output", content: "  1. AI Resume Analyzer" },
      { type: "output", content: "  2. RAG Research Assistant" },
      { type: "output", content: "  3. Android ML App" },
      { type: "output", content: "  4. Portfolio Website" },
      { type: "output", content: "" },
    ]);
  },

  skills: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Languages:   Python, Java, JavaScript, TypeScript" },
      { type: "output", content: "  Frameworks:  React, Next.js, TensorFlow, Node.js" },
      { type: "output", content: "  Tools:       Git, Docker, AWS, Vercel, Firebase" },
      { type: "output", content: "" },
    ]);
  },

  resume: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Download Resume:" },
      { type: "link", content: "  https://your-resume-link.com", url: "https://your-resume-link.com" },
      { type: "output", content: "" },
    ]);
  },

  github: (add) => {
    window.open("https://github.com", "_blank");
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Opening GitHub..." },
      { type: "output", content: "" },
    ]);
  },

  linkedin: (add) => {
    window.open("https://linkedin.com", "_blank");
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Opening LinkedIn..." },
      { type: "output", content: "" },
    ]);
  },

  awards: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Achievements:" },
      { type: "output", content: "" },
      { type: "output", content: "  🏆  Open Source Contributor — 100+ GitHub Stars" },
      { type: "output", content: "  🥇  Hackathon Winner — National Level" },
      { type: "output", content: "  📜  Certified AWS Cloud Practitioner" },
      { type: "output", content: "" },
    ]);
  },

  neofetch: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "       /\\_/\\" },
      { type: "output", content: "      ( o.o )    Name:     Pavan Kumar" },
      { type: "output", content: "       > ^ <     Role:     AI Engineer" },
      { type: "output", content: "      /|   |\\    Location: India" },
      { type: "output", content: "     (_|   |_)   GitHub:   github.com/username" },
      { type: "output", content: "                 Shell:    portfolio-terminal v1.0" },
      { type: "output", content: "                 Theme:    Dark Hacker 🖤" },
      { type: "output", content: "" },
    ]);
  },

  others: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Other Profiles:" },
      { type: "output", content: "" },
      { type: "link", content: "  LeetCode  → https://leetcode.com", url: "https://leetcode.com" },
      { type: "link", content: "  Kaggle    → https://kaggle.com", url: "https://kaggle.com" },
      { type: "output", content: "" },
    ]);
  },
};

export const COMMAND_LIST = [
  "awards",
  "clear",
  "exit",
  "github",
  "help",
  "linkedin",
  "neofetch",
  "others",
  "projects",
  "resume",
  "skills",
  "whoami",
];

export default COMMANDS;
