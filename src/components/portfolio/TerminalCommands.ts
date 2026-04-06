export type PlatformIconKey = "leetcode" | "codechef" | "geeksforgeeks" | "github" | "codingninjas" | "gmail" | "phone" | "globe" | "x";

export interface TerminalLine {
  type: "input" | "output" | "link" | "header" | "icon-line";
  content: string;
  url?: string;
  iconKey?: PlatformIconKey;
  iconColor?: string;
  prefix?: string;
}

const ASCII_BANNER = [
  "  ███╗   ███╗██╗   ██╗██████╗ ████████╗██╗  ██╗██╗   ██╗",
  "  ████╗ ████║██║   ██║██╔══██╗╚══██╔══╝██║  ██║╚██╗ ██╔╝",
  "  ██╔████╔██║██║   ██║██████╔╝   ██║   ███████║ ╚████╔╝ ",
  "  ██║╚██╔╝██║██║   ██║██╔══██╗   ██║   ██╔══██║  ╚██╔╝  ",
  "  ██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║   ██║  ██║   ██║   ",
  "  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ",
  "                    ╔═╗╔═╗╔═╗╔═╗",
  "                    ║║║╠╣ ║║║╠═╝",
  "                    ╚╩╝╚  ╚╩╝╩  ",
];

export const TERMINAL_PROMPT = "murthy0x05@portfolio:~$";

const COMMANDS: Record<string, (addOutput: (lines: TerminalLine[]) => void) => void> = {
  help: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ╔══════════════════════════════════════════╗" },
      { type: "header", content: "  ║        AVAILABLE COMMANDS                ║" },
      { type: "header", content: "  ╚══════════════════════════════════════════╝" },
      { type: "output", content: "" },
      { type: "output", content: "  whoami          → About me" },
      { type: "output", content: "  experience      → Work experience" },
      { type: "output", content: "  projects        → Featured projects" },
      { type: "output", content: "  skills          → Technical skills" },
      { type: "output", content: "  education       → Academic background" },
      { type: "output", content: "  certifications  → Certs & achievements" },
      { type: "output", content: "  awards          → Coding achievements" },
      { type: "output", content: "  contact         → Contact info" },
      { type: "output", content: "  resume          → Download resume" },
      { type: "output", content: "  github          → Open GitHub profile" },
      { type: "output", content: "  linkedin        → Open LinkedIn profile" },
      { type: "output", content: "  others          → Other coding profiles" },
      { type: "output", content: "  neofetch        → System info" },
      { type: "output", content: "  banner          → Show ASCII banner" },
      { type: "output", content: "  clear           → Clear terminal" },
      { type: "output", content: "  exit            → Close terminal" },
      { type: "output", content: "" },
    ]);
  },

  banner: (add) => {
    add([
      { type: "output", content: "" },
      ...ASCII_BANNER.map((line) => ({ type: "header" as const, content: line })),
      { type: "output", content: "" },
    ]);
  },

  whoami: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── IDENTITY ───────────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  Name      :  Pavan Kumar" },
      { type: "output", content: "  │  Handle    :  @murthy0x05" },
      { type: "output", content: "  │  Role      :  CSE-AIML Student & AI Engineer" },
      { type: "output", content: "  │  Focus     :  LLM Fine-tuning, ML, Deep Learning" },
      { type: "output", content: "  │  Location  :  India 🇮🇳" },
      { type: "output", content: "  │  Website   :  murthy0x05.me" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  experience: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── WORK EXPERIENCE ────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  ▸ AI Performance Engineer" },
      { type: "output", content: "  │    Deccan AI Experts  ·  March 2026" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │    • Fine-tuned LLMs with supervised &" },
      { type: "output", content: "  │      instruction tuning (+18% ROUGE-L," },
      { type: "output", content: "  │      +15% BLEU improvements)" },
      { type: "output", content: "  │    • Evaluated model outputs using ROUGE," },
      { type: "output", content: "  │      BLEU, and Perplexity metrics" },
      { type: "output", content: "  │    • Performed error analysis on low-scoring" },
      { type: "output", content: "  │      samples to mitigate hallucinations" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │    Tech: LLM Fine-Tuning · Transformers ·" },
      { type: "output", content: "  │          PyTorch · Generative AI · NLP" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  projects: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── PROJECTS ──────────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  01 ▸ Credit Risk Assessment Using ML" },
      { type: "output", content: "  │       Pipeline for 10k+ loan applications" },
      { type: "output", content: "  │       92.8% AUC · XGBoost + Logistic Reg" },
      { type: "output", content: "  │       [Python, Scikit-learn, Pandas]" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  02 ▸ UDP-Based DNS Query Handling" },
      { type: "output", content: "  │       100+ concurrent queries · <5ms lookup" },
      { type: "output", content: "  │       Trie-based resolution · 65% cache hit" },
      { type: "output", content: "  │       [Retrieval Trees, LRU Cache, UDP]" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  03 ▸ Apache Kafka Broker (KafkaX)" },
      { type: "output", content: "  │       5,000+ msg/sec · Log persistence" },
      { type: "output", content: "  │       Multi-topic · TCP socket comm" },
      { type: "output", content: "  │       [Java, TCP, Kafka Protocol]" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  04 ▸ Handwritten Digit Recognition" },
      { type: "output", content: "  │       CNN on MNIST · 99% accuracy" },
      { type: "output", content: "  │       Real-time prediction UI" },
      { type: "output", content: "  │       [TensorFlow/Keras, NumPy]" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  skills: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── TECHNICAL SKILLS ───────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  Languages" },
      { type: "output", content: "  │    C++ · C · Python 3 · Java 8+ · Kotlin" },
      { type: "output", content: "  │    JavaScript · TypeScript · SQL · MongoDB" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  Frameworks & Libraries" },
      { type: "output", content: "  │    Flask · Gradio · scikit-learn · LangChain" },
      { type: "output", content: "  │    NumPy · Pandas · TensorFlow · spaCy · NLTK" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  Developer Tools" },
      { type: "output", content: "  │    Git · GitHub · Docker · Supabase · Postman" },
      { type: "output", content: "  │    Jupyter Notebook · Android Studio · Cisco PKT" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  CS Fundamentals" },
      { type: "output", content: "  │    OOPs · OS · Computer Networks · DBMS" },
      { type: "output", content: "  │    Statistics · Agile Methodology" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  education: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── EDUCATION ─────────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  🎓 B.Tech, CSE-AIML" },
      { type: "output", content: "  │     Lovely Professional University" },
      { type: "output", content: "  │     2023 — Present  ·  CGPA: 9.38" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  📘 BIEAP – Class XII" },
      { type: "output", content: "  │     Narayana Junior College" },
      { type: "output", content: "  │     2021 — 2023  ·  98.1%" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  📗 BSEAP – Class X" },
      { type: "output", content: "  │     Narayana Group of Schools" },
      { type: "output", content: "  │     2020 — 2021  ·  99%" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  certifications: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── CERTIFICATIONS ────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  📜 MongoDB Fundamentals" },
      { type: "output", content: "  │     MongoDB Learning" },
      { type: "output", content: "  │" },
      { type: "output", content: "  │  📜 Design & Analysis of Algorithms" },
      { type: "output", content: "  │     NPTEL  ·  Top 5%" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  awards: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── CODING ACHIEVEMENTS ────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  LeetCode", iconKey: "leetcode", iconColor: "#FFA116", url: "https://leetcode.com/murthy0x05" },
      { type: "output", content: "  │     Rating: 1609 · 485+ day streak" },
      { type: "output", content: "  │     800+ problems solved" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  CodeChef", iconKey: "codechef", iconColor: "#5B4638", url: "https://codechef.com/users/murthy0x05" },
      { type: "output", content: "  │     Rating: 1605 (3 STAR)" },
      { type: "output", content: "  │     Global Ranks: 235, 381, 637, 656, 820" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  GeeksForGeeks", iconKey: "geeksforgeeks", iconColor: "#2F8D46", url: "https://www.geeksforgeeks.org/user/murthy0x05" },
      { type: "output", content: "  │     50+ days POTD streak · 280+ score" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  GitHub", iconKey: "github", iconColor: "#e2e2e2", url: "https://github.com/murthy0x05" },
      { type: "output", content: "  │     3,185+ contributions (last 12 months)" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  Coding Ninjas", iconKey: "codingninjas", iconColor: "#F28D1A", url: "https://www.naukri.com/code360/profile/murthy0x05" },
      { type: "output", content: "  │     Rating: 1808 (Specialist/Grand Master)" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └─────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  contact: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── CONTACT INFO ──────────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "icon-line", content: "  │  Email    :  murthy0x05@gmail.com", iconKey: "gmail", iconColor: "#EA4335" },
      { type: "icon-line", content: "  │  Phone    :  +91 8688477224", iconKey: "phone", iconColor: "#22c55e" },
      { type: "icon-line", content: "  │  Website  :  murthy0x05.me", iconKey: "globe", iconColor: "#699cff" },
      { type: "icon-line", content: "  │  Twitter  :  @murthy0x05", iconKey: "x", iconColor: "#e2e2e2" },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  resume: (add) => {
    add([
      { type: "output", content: "" },
      { type: "output", content: "  📄 Download Resume:" },
      { type: "output", content: "" },
      { type: "link", content: "/cv-general.pdf", url: "/cv-general.pdf", prefix: "  [1] General CV        → " },
      { type: "link", content: "/cv-aiml.pdf", url: "/cv-aiml.pdf", prefix: "  [2] AIML Specialized  → " },
      { type: "link", content: "/cv-android.pdf", url: "/cv-android.pdf", prefix: "  [3] Android Dev       → " },
      { type: "output", content: "" },
    ]);
  },

  github: (add) => {
    window.open("https://github.com/murthy0x05", "_blank");
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Opening GitHub → github.com/murthy0x05 ..." },
      { type: "output", content: "" },
    ]);
  },

  linkedin: (add) => {
    window.open("https://linkedin.com/in/murthy0x05", "_blank");
    add([
      { type: "output", content: "" },
      { type: "output", content: "  Opening LinkedIn → linkedin.com/in/murthy0x05 ..." },
      { type: "output", content: "" },
    ]);
  },

  others: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "  ┌─── CODING PROFILES ───────────────────────┐" },
      { type: "output", content: "  │" },
      { type: "link", content: "leetcode.com/murthy0x05", url: "https://leetcode.com/murthy0x05", prefix: "  │  LeetCode    → " },
      { type: "link", content: "codeforces.com/profile/murthy1e9", url: "https://codeforces.com/profile/murthy1e9", prefix: "  │  Codeforces  → " },
      { type: "link", content: "codechef.com/users/murthy0x05", url: "https://codechef.com/users/murthy0x05", prefix: "  │  CodeChef    → " },
      { type: "link", content: "kaggle.com/murthy0x05", url: "https://kaggle.com/murthy0x05", prefix: "  │  Kaggle      → " },
      { type: "link", content: "atcoder.jp/users/murthy1e9", url: "https://atcoder.jp/users/murthy1e9", prefix: "  │  AtCoder     → " },
      { type: "output", content: "  │" },
      { type: "header", content: "  └────────────────────────────────────────────┘" },
      { type: "output", content: "" },
    ]);
  },

  neofetch: (add) => {
    add([
      { type: "output", content: "" },
      { type: "header", content: "         /\\_/\\        murthy0x05@portfolio" },
      { type: "header", content: "        ( o.o )       ──────────────────────" },
      { type: "output", content: "         > ^ <        OS:        Ubuntu 22.04 LTS" },
      { type: "output", content: "        /|   |\\       Shell:     portfolio-terminal v2.0" },
      { type: "output", content: "       (_|   |_)      Theme:     Obsidian Protocol 🖤" },
      { type: "output", content: "                      Name:      Pavan Kumar" },
      { type: "output", content: "                      Role:      AI Performance Engineer" },
      { type: "output", content: "                      Uni:       Lovely Professional University" },
      { type: "output", content: "                      CGPA:      9.38" },
      { type: "output", content: "                      GitHub:    github.com/murthy0x05" },
      { type: "output", content: "                      LeetCode:  1609 Rating · 800+ solved" },
      { type: "output", content: "                      Streak:    485+ days 🔥" },
      { type: "output", content: "" },
      { type: "header", content: "        ██ ██ ██ ██ ██ ██ ██ ██" },
      { type: "output", content: "" },
    ]);
  },
};

export const COMMAND_LIST = [
  "help",
  "whoami",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "awards",
  "contact",
  "resume",
  "github",
  "linkedin",
  "others",
  "neofetch",
  "banner",
  "clear",
  "exit",
];

export const WELCOME_LINES: TerminalLine[] = [
  ...ASCII_BANNER.map((line) => ({ type: "header" as const, content: line })),
  { type: "output", content: "" },
  { type: "output", content: '  Welcome to Pavan Kumar\'s portfolio terminal.' },
  { type: "output", content: '  Type "help" to see available commands.' },
  { type: "output", content: "" },
];

export default COMMANDS;
